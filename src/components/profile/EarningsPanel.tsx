"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";
import type { EarningsData } from "@/lib/mock-data";
import { formatNumber } from "@/lib/mock-data";

interface EarningsPanelProps {
  data: EarningsData;
}

const MIN_WITHDRAWAL = 1000;

export function EarningsPanel({ data }: EarningsPanelProps) {
  const t = useTranslations("profile.earningsPage");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const canWithdraw = data.withdrawable >= MIN_WITHDRAWAL;
  const usdAmount = (data.withdrawable / 100).toFixed(2);

  const handleWithdraw = () => {
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base font-medium">{t("currentIncome")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-xl font-bold text-foreground">{formatNumber(data.currentIncome)}</div>
            <div className="text-xs text-muted-foreground">{t("currentIncome")}</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-xl font-bold text-amber-500">{formatNumber(data.pendingIncome)}</div>
            <div className="text-xs text-muted-foreground">{t("pendingIncome")}</div>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-xl font-bold text-primary">{formatNumber(data.withdrawable)}</div>
            <div className="text-xs text-muted-foreground">{t("withdrawable")}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {t("withdrawMin")}
          </div>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  size="sm"
                  disabled={!canWithdraw}
                  className={!canWithdraw ? "opacity-50 cursor-not-allowed" : ""}
                />
              }
            >
              {t("withdraw")} ({formatNumber(data.withdrawable)} {t("coins")} ≈ ${usdAmount} {t("usd")})
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("withdrawTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("withdrawDesc", { amount: formatNumber(data.withdrawable), usd: usdAmount })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3">
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleWithdraw}>
                  {t("confirm")}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {withdrawSuccess && (
          <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            {t("withdrawSuccess")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
