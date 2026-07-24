"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStore } from "@/stores/useCreateStore";
import { trpc } from "@/trpc/client";
import { Upload } from "lucide-react";

const CATEGORIES = [
  { value: "玄幻", label: "玄幻" },
  { value: "都市", label: "都市" },
  { value: "仙侠", label: "仙侠" },
  { value: "科幻", label: "科幻" },
  { value: "竞技", label: "竞技" },
  { value: "历史", label: "历史" },
  { value: "悬疑", label: "悬疑" },
  { value: "言情", label: "言情" },
] as const;

export function NewNovelDialog() {
  const t = useTranslations("create");
  const open = useCreateStore((s) => s.newNovelDialogOpen);
  const setOpen = useCreateStore((s) => s.setNewNovelDialogOpen);
  const addNovel = useCreateStore((s) => s.addNovel);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("玄幻");
  const [summary, setSummary] = useState("");

  const createMutation = trpc.novel.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      resetForm();
    },
  });

  function resetForm() {
    setTitle("");
    setCategory("玄幻");
    setSummary("");
  }

  function handleClose(open: boolean) {
    setOpen(open);
    if (!open) resetForm();
  }

  function handleConfirm() {
    if (!title.trim()) return;

    const now = new Date().toISOString();
    const novelId = `novel-${Date.now()}`;

    addNovel({
      id: novelId,
      title: title.trim(),
      summary: summary.trim() || undefined,
      status: "DRAFT",
      categoryName: category,
      wordCount: 0,
      chapters: [],
      createdAt: now,
      updatedAt: now,
    });

    createMutation.mutate({
      title: title.trim(),
      summary: summary.trim() || undefined,
    });

    setOpen(false);
    resetForm();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("newNovel")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* 作品名称 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              {t("novelName")}
            </label>
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder={t("novelName")}
              autoFocus
            />
          </div>

          {/* 作品分类 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              {t("novelCategory")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 作品简介 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              {t("novelSummary")}
            </label>
            <Textarea
              value={summary}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSummary(e.target.value)
              }
              placeholder={t("novelSummary")}
              rows={3}
            />
          </div>

          {/* 封面上传 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              {t("coverUpload")}
            </label>
            <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground">
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="size-5" />
                <span className="text-xs">{t("uploadCover")}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!title.trim() || createMutation.isPending}
          >
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
