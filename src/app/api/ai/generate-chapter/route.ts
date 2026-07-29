import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAIClient } from "@/lib/ai/client";
import { checkQuota, recordUsage } from "@/lib/ai/quota";
import {
  buildChapterPrompt,
  buildQuickChapterPrompt,
  type NovelMetadata,
  type NovelCharacter,
} from "@/lib/ai/prompts/novel-creation";

export const dynamic = "force-dynamic";

interface ChapterStreamBody {
  mode: "full" | "quick";
  concept?: string;
  metadata: NovelMetadata;
  worldview?: string;
  character?: NovelCharacter;
  chapters: Array<{ title: string; summary: string }>;
  chapterIndex: number;
  previousSummary?: string;
  locale?: string;
}

function createSSEStream(
  systemPrompt: string,
  prompt: string,
  aiClient: ReturnType<typeof getAIClient>,
  userId: string,
  action: string
) {
  const encoder = new TextEncoder();
  const startTime = Date.now();
  let outputTokens = 0;

  return new ReadableStream({
    async start(controller) {
      try {
        const chunks = aiClient.completeStream({
          systemPrompt,
          prompt,
          temperature: 0.7,
          maxTokens: 4096,
        });

        for await (const chunk of chunks) {
          outputTokens++;
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "AI 服务调用异常";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      } finally {
        const elapsed = Date.now() - startTime;
        const inputTokens = Math.ceil(prompt.length / 2);
        recordUsage(userId, action, inputTokens, outputTokens).catch((err) => {
          console.error("[AI Chapter Stream] Failed to record usage:", err);
        });
        console.log(
          `[AI Chapter Stream] user=${userId} action=${action} outputTokens=${outputTokens} elapsed=${elapsed}ms`
        );
      }
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权，请先登录" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: ChapterStreamBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "请求体必须是有效的JSON" },
      { status: 400 }
    );
  }

  if (!body.metadata || !body.chapters || body.chapterIndex === undefined) {
    return NextResponse.json(
      { error: "缺少必要参数：metadata、chapters、chapterIndex" },
      { status: 400 }
    );
  }

  if (body.chapterIndex < 0 || body.chapterIndex >= body.chapters.length) {
    return NextResponse.json(
      { error: "chapterIndex 超出范围" },
      { status: 400 }
    );
  }

  const quota = await checkQuota(userId);
  if (!quota.allowed) {
    return NextResponse.json(
      { error: "今日AI使用额度已用完，请明天再试或升级套餐" },
      { status: 429 }
    );
  }

  let systemPrompt: string;
  let prompt: string;
  const action = body.mode === "quick" ? "generateQuickChapter" : "generateChapter";

  try {
    if (body.mode === "quick") {
      if (!body.concept) {
        return NextResponse.json(
          { error: "quick模式需要提供concept参数" },
          { status: 400 }
        );
      }
      const result = buildQuickChapterPrompt(
        body.concept,
        body.metadata,
        body.chapters,
        body.chapterIndex,
        body.previousSummary,
        body.locale
      );
      systemPrompt = result.systemPrompt;
      prompt = result.prompt;
    } else {
      if (!body.worldview || !body.character) {
        return NextResponse.json(
          { error: "full模式需要提供worldview和character参数" },
          { status: 400 }
        );
      }
      const result = buildChapterPrompt(
        body.metadata,
        body.worldview,
        body.character,
        body.chapters,
        body.previousSummary || "",
        body.chapterIndex,
        body.locale
      );
      systemPrompt = result.systemPrompt;
      prompt = result.prompt;
    }
  } catch {
    return NextResponse.json(
      { error: "参数解析失败，请检查输入" },
      { status: 400 }
    );
  }

  const aiClient = getAIClient();
  const stream = createSSEStream(systemPrompt, prompt, aiClient, userId, action);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
