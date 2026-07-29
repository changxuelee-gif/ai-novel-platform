const BLOCKED_KEYWORDS = [
  "血腥屠杀",
  "虐杀儿童",
  "杀人教程",
  "分尸细节",
  "虐待动物",
  "色情描写",
  "淫秽内容",
  "卖淫嫖娼",
  "裸体图片",
  "性暴力",
  "乱伦",
  "制毒方法",
  "炸弹制作",
  "恐怖袭击",
  "枪支制造",
  "毒品交易",
  "赌博技巧",
  "诈骗方法",
  "传销教程",
  "邪教宣传",
  "种族歧视",
  "人身攻击",
  "仇恨言论",
  "暴力极端主义",
  "儿童色情",
  "人口贩卖",
];

export interface SafetyCheckResult {
  passed: boolean;
  reason?: string;
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function validateContentLength(
  text: string,
  min: number,
  max: number
): { valid: boolean; reason?: string } {
  if (!text || text.length < min) {
    return { valid: false, reason: `内容长度不能少于${min}个字符` };
  }
  if (text.length > max) {
    return { valid: false, reason: `内容长度不能超过${max}个字符` };
  }
  return { valid: true };
}

export function checkContentSafety(content: string): SafetyCheckResult {
  const lowerContent = content.toLowerCase();

  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerContent.includes(keyword.toLowerCase())) {
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
