import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { TrpcProvider } from "@/components/providers/TrpcProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as string, namespace: "common" });
  return {
    title: {
      default: t("siteTitle"),
      template: `%s | ${t("appName")}`,
    },
    description: t("siteDescription"),
    alternates: {
      languages: {
        "zh-CN": `/zh-CN`,
        "zh-TW": `/zh-TW`,
        en: `/en`,
        ja: `/ja`,
        ko: `/ko`,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <TrpcProvider>
              <ThemeProvider>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster />
              </ThemeProvider>
            </TrpcProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
