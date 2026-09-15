import { AppShell } from "@/components/layout/AppShell";
import { HistoryClient } from "@/components/wait/HistoryClient";

export const metadata = {
  title: "Session history | Waitplay",
  description: "Replay past Waitplay sessions and reopen shareable artifacts.",
};

export default function HistoryPage() {
  return (
    <AppShell>
      <HistoryClient />
    </AppShell>
  );
}
