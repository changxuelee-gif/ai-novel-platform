"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Lock, Globe, AlertCircle } from "lucide-react";
import { trpc } from "@/trpc/client";

export default function SecuritySettingsPage() {
  const { data: userData } = trpc.user.getProfile.useQuery();
  const [message, setMessage] = useState<string | null>(null);

  const handleChangePassword = () => {
    setMessage("密码修改功能即将上线");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SettingsSidebar activeSection="accountSecurity" />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  账号安全
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  管理您的账号安全设置，保护您的账号免受未授权访问
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">邮箱地址</div>
                      <div className="text-xs text-muted-foreground">
                        {userData?.email ?? "u***@example.com"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">已验证</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">登录密码</div>
                      <div className="text-xs text-muted-foreground">
                        定期修改密码可以提高账号安全性
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleChangePassword}>
                    修改密码
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">第三方账号绑定</div>
                      <div className="text-xs text-muted-foreground">
                        使用 Google 账号快捷登录
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleChangePassword}>
                    绑定
                  </Button>
                </div>
              </div>

              {message && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 text-amber-700 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
