import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";

export default function MyWorksPage() {
  const t = useTranslations("profile");
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">{t("myWorks")}</h1>
      </div>
    </AppLayout>
  );
}
