"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";

const defaultUser = {
  id: "",
  name: "用户",
  avatar: "",
  vip: false,
  bio: "",
  following: 0,
  followers: 0,
  works: 0,
  banner: "",
};

const faqItems = [
  {
    category: "账户相关",
    items: [
      { q: "如何注册账号？", a: "点击页面右上角的「注册」按钮，使用邮箱地址即可完成注册。注册后可完善个人资料和头像。" },
      { q: "如何修改个人信息？", a: "进入「设置」页面，可以修改昵称、头像、个人简介等信息。" },
      { q: "如何绑定/解绑Google账号？", a: "在「设置」-「账号设置」中，可以绑定或解绑第三方登录账号。" },
      { q: "忘记密码怎么办？", a: "在登录页面点击「忘记密码」，通过注册邮箱接收重置邮件即可重新设置密码。" },
    ],
  },
  {
    category: "阅读相关",
    items: [
      { q: "如何将小说加入书架？", a: "在小说详情页点击「加入书架」按钮，即可将小说收藏到书架中，方便后续阅读。" },
      { q: "阅读进度会自动保存吗？", a: "是的，系统会自动记录您的阅读进度，下次打开时会自动跳转到上次阅读的章节。" },
      { q: "如何调整阅读设置？", a: "在阅读页面点击屏幕中央呼出菜单，可以调整字体大小、行间距、背景色等阅读偏好。" },
      { q: "书架和收藏有什么区别？", a: "书架主要记录您正在阅读的小说及阅读进度，收藏则是您喜欢的所有作品的合集。" },
    ],
  },
  {
    category: "墨币与会员",
    items: [
      { q: "什么是墨币？", a: "墨币是平台的虚拟货币，可用于解锁付费章节、打赏作者等。1元=100墨币。" },
      { q: "如何充值墨币？", a: "点击个人中心「我的资产」区域的「充值」按钮，选择充值金额和支付方式即可完成充值。" },
      { q: "会员有什么权益？", a: "会员可享受：每日免费墨币、专属会员标识、部分付费章节折扣、去除广告等权益。" },
      { q: "如何开通/续费会员？", a: "在个人中心「我的资产」区域点击「续费」按钮，选择会员套餐即可开通或续费。" },
    ],
  },
  {
    category: "创作相关",
    items: [
      { q: "如何开始创作？", a: "点击顶部「创作中心」或个人中心的「开始创作」按钮，即可进入创作页面开始写小说。" },
      { q: "作品如何发布？", a: "创作完成后，在作品管理中点击「发布」按钮，作品经过审核后即可公开展示。" },
      { q: "如何参加创作活动？", a: "进入「活动中心」，查看正在进行的活动，点击「参与活动」提交作品即可参赛。" },
      { q: "创作收益如何计算？", a: "收益来源于付费章节订阅、读者打赏、活动奖励等，具体数据可在「数据与收益」页面查看。" },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-foreground pr-4">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="pb-4 text-sm text-muted-foreground leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpCenterPage() {
  const { data: userData } = trpc.user.getProfile.useQuery();

  const user = userData
    ? {
        ...defaultUser,
        id: userData.id,
        name: userData.name ?? "用户",
        avatar: userData.avatar ?? userData.image ?? "",
        vip: userData.role === "VERIFIED" || userData.role === "AUTHOR",
        bio: userData.bio ?? "",
        following: userData._count?.following ?? 0,
        followers: userData._count?.followers ?? 0,
        works: userData._count?.novels ?? 0,
      }
    : defaultUser;

  const assets = {
    coins: userData?.coins ?? 0,
    membershipExpiry: "",
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={user} assets={assets} />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">帮助中心</h1>
                <p className="text-sm text-muted-foreground">常见问题解答，帮您快速上手</p>
              </div>
            </div>

            <div className="space-y-8">
              {faqItems.map((cat) => (
                <div key={cat.category}>
                  <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    {cat.category}
                  </h2>
                  <div className="pl-3">
                    {cat.items.map((item, i) => (
                      <FaqItem key={i} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                没有找到您需要的答案？请通过消息通知联系客服，我们会尽快回复您。
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
