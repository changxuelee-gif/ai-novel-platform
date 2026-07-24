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

function buildPrompt(action: Action, params: URLSearchParams): string {
  switch (action) {
    case "continue":
      return buildContinuePrompt(
        params.get("context") || "",
        params.get("character") || undefined,
        params.get("style") || undefined
      );
    case "inspire":
      return buildInspirePrompt(
        params.get("chapterContent") || "",
        params.get("setting") || undefined
      );
    case "rewrite":
      return buildRewritePrompt(
        params.get("text") || "",
        params.get("mode") || "生动"
      );
    case "dialogue": {
      const charactersRaw = params.get("characters") || "[]";
      const characters = JSON.parse(charactersRaw);
      return buildDialoguePrompt(characters, params.get("situation") || "");
    }
    case "outline":
      return buildOutlinePrompt(
        params.get("worldView") || "",
        params.get("protagonist") || "",
        params.get("conflict") || ""
      );
    case "randomCharacter":
      return buildRandomCharacterPrompt(params.get("tags") || "");
    case "randomStyle":
      return buildRandomStylePrompt(params.get("tags") || "");
  }
}

export async function GET(request: NextRequest) {
  // 1. 认证检查
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权，请先登录" }, { status: 401 });
  }

  const userId = session.user.id;
  const params = request.nextUrl.searchParams;
  const action = params.get("action") as Action | null;

  // 2. 校验 action
  if (!action || !VALID_ACTIONS.includes(action)) {
    return NextResponse.json(
      { error: `无效的 action，可选值：${VALID_ACTIONS.join(" | ")}` },
      { status: 400 }
    );
  }

  // 3. 配额检查
  const quota = await checkQuota(userId);
  if (!quota.allowed) {
    return NextResponse.json(
      { error: "今日AI使用额度已用完，请明天再试或升级套餐" },
      { status: 429 }
    );
  }

  // 4. 构建 prompt
  let prompt: string;
  try {
    prompt = buildPrompt(action, params);
  } catch {
    return NextResponse.json(
      { error: "参数解析失败，请检查输入" },
      { status: 400 }
    );
  }

  // 5. 创建 SSE 流
  const aiClient = getAIClient();
  const startTime = Date.now();
  let outputTokens = 0;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
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
        // 6. 记录使用量和审计日志
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

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
