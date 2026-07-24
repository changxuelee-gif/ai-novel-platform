import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh-CN", "zh-TW", "en", "ja", "ko"],
  defaultLocale: "zh-CN",
});
