"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-rose-400/20 bg-rose-500/5 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15">
          <AlertTriangle className="h-5 w-5 text-rose-300" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-white">{title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{message}</p>
          {onRetry && (
            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
