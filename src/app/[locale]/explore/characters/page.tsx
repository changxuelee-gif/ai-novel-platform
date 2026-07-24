import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";

export default function CharactersPage() {
  const t = useTranslations("nav");
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">{t("characters")}</h1>
      </div>
    </AppLayout>
  );
}
