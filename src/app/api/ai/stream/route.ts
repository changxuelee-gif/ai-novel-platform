import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getAIClient,
  buildContinuePrompt,
  buildInspirePrompt,
  buildRewritePrompt,
  buildDialoguePrompt,
  buildOutlinePrompt,
  buildRandomCharacterPrompt,
  buildRandomStylePrompt,
} from "@/lib/ai";
import { checkQuota, recordUsage } from "@/lib/ai/quota";

export const dynamic = "force-dynamic";

const VALID_ACTIONS = [
  "continue",
  "inspire",
  "rewrite",
  "dialogue",
  "outline",
  "randomCharacter",
  "randomStyle",
] as const;

type Action = (typeof VALID_ACTIONS)[number];

function buildPrompt(action: Action, params: Record<string, string>): string {
  switch (action) {
    case "continue":
      return buildContinuePrompt(
        params.context || "",
        params.character || undefined,
        params.style || undefined
      );
    case "inspire":
      return buildInspirePrompt(
        params.chapterContent || "",
        params.setting || undefined
      );
    case "rewrite":
      return buildRewritePrompt(
        params.text || "",
        params.mode || "生动"
      );
    case "dialogue": {
      const charactersRaw = params.characters || "[]";
      const characters = JSON.parse(charactersRaw);
      return buildDialoguePrompt(characters, params.situation || "");
    }
    case "outline":
      return buildOutlinePrompt(
        params.worldView || "",
        params.protagonist || "",
        params.conflict || ""
      );
    case "randomCharacter":
      return buildRandomCharacterPrompt(params.tags || "");
    case "randomStyle":
      return buildRandomStylePrompt(params.tags || "");
  }
}

function createSSEStream(
  prompt: string,
  aiClient: ReturnType<typeof getAIClient>,
  userId: string,
  action: Action
) {
  const encoder = new TextEncoder();
  const startTime = Date.now();
  let outputTokens = 0;

  return new ReadableStream({
    async start(controller) {
      try {
        const chunks = aiClient.completeStream({ prompt });

        for await (const chunk of chunks) {
          outputTokens++;
          controller.enqueue(
            encoder.encode(`data: ${chunk}\n\n`)
          );
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
        recordUsage(userId, action, inputTokens, outputTokens).catch(
          (err) => {
            console.error("[AI Stream] Failed to record usage:", err);
          }
        );
        console.log(
          `[AI Stream] user=${userId} action=${action} outputTokens=${outputTokens} elapsed=${elapsed}ms`
        );
      }
    },
  });
}

async function handleStreamRequest(
  userId: string,
  action: Action | null,
  params: Record<string, string>
): Promise<NextResponse> {
  if (!action || !VALID_ACTIONS.includes(action)) {
    return NextResponse.json(
      { error: `无效的 action，可选值：${VALID_ACTIONS.join(" | ")}` },
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

  let prompt: string;
  try {
    prompt = buildPrompt(action, params);
  } catch {
    return NextResponse.json(
      { error: "参数解析失败，请检查输入" },
      { status: 400 }
    );
  }

  const aiClient = getAIClient();
  const stream = createSSEStream(prompt, aiClient, userId, action);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权，请先登录" }, { status: 401 });
  }

  const userId = session.user.id;
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action") as Action | null;

  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return handleStreamRequest(userId, action, params);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权，请先登录" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "请求体必须是有效的JSON" },
      { status: 400 }
    );
  }

  const action = (body.action || null) as Action | null;

  return handleStreamRequest(userId, action, body);
}
