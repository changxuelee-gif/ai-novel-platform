"use client"

import { useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCreateStore } from "@/stores/useCreateStore"
import { trpc } from "@/trpc/client"

export function PublishDialog() {
  const { publishDialogOpen, setPublishDialogOpen, currentNovelId } =
    useCreateStore()

  const [publishType, setPublishType] = useState<
    "public" | "private" | "scheduled"
  >("public")
  const [scheduledTime, setScheduledTime] = useState("")

  const updateNovel = trpc.novel.update.useMutation({
    onSuccess: () => {
      setPublishDialogOpen(false)
      resetForm()
    },
  })

  const resetForm = () => {
    setPublishType("public")
    setScheduledTime("")
  }

  const handleConfirm = () => {
    if (!currentNovelId) return
    updateNovel.mutate({
      id: currentNovelId,
      status: "PUBLISHED" as const,
    })
  }

  const handleOpenChange = (open: boolean) => {
    setPublishDialogOpen(open)
    if (!open) resetForm()
  }

  return (
    <Dialog open={publishDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发布章节</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {/* 公开 */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="publishType"
              checked={publishType === "public"}
              onChange={() => setPublishType("public")}
              className="accent-purple-600"
            />
            <div>
              <div className="text-sm font-medium">公开</div>
              <div className="text-xs text-muted-foreground">所有读者可见</div>
            </div>
          </label>

          {/* 仅自己可见 */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="publishType"
              checked={publishType === "private"}
              onChange={() => setPublishType("private")}
              className="accent-purple-600"
            />
            <div>
              <div className="text-sm font-medium">仅自己可见</div>
              <div className="text-xs text-muted-foreground">
                只有作者本人可以查看
              </div>
            </div>
          </label>

          {/* 定时发布 */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="publishType"
              checked={publishType === "scheduled"}
              onChange={() => setPublishType("scheduled")}
              className="accent-purple-600"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">定时发布</div>
              <div className="text-xs text-muted-foreground">
                设定时间自动发布
              </div>
            </div>
          </label>

          {/* 定时发布时间选择 */}
          {publishType === "scheduled" && (
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="ml-6 h-8 rounded border border-input bg-background px-2 text-sm outline-none focus:border-ring"
            />
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>取消</DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={updateNovel.isPending}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {updateNovel.isPending ? "发布中..." : "确认发布"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
