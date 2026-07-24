// 违规关键词列表（可根据需要扩展）
const BLOCKED_KEYWORDS = [
  // 暴力类
  "血腥屠杀",
  "虐杀儿童",
  // 色情类
  "色情描写",
  "淫秽内容",
  // 违禁类
  "制毒方法",
  "炸弹制作",
];

export interface SafetyCheckResult {
  passed: boolean;
  reason?: string;
}

export function checkContentSafety(content: string): SafetyCheckResult {
  const lowerContent = content.toLowerCase();

  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerContent.includes(keyword.toLowerCase())) {
      // 记录审计日志
      console.warn(
        `[AI Safety] Content blocked: keyword="${keyword}", contentPreview="${content.substring(0, 100)}..."`
      );
      return { passed: false, reason: "生成内容不符合规范" };
    }
  }

  return { passed: true };
}

export function logAIAudit(params: {
  userId: string;
  action: string;
  inputPreview: string;
  outputPreview: string;
  blocked: boolean;
}) {
  console.log(
    `[AI Audit] userId=${params.userId} action=${params.action} blocked=${params.blocked} input="${params.inputPreview.substring(0, 50)}" output="${params.outputPreview.substring(0, 50)}"`
  );
}
