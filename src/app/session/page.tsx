import { AppShell } from "@/components/layout/AppShell";
import { WaitSession } from "@/components/wait/WaitSession";

export const metadata = {
  title: "Session | Waitplay",
  description: "Run a Waitplay agent wait session with live streamed progress.",
};

export default function SessionPage() {
  return (
    <AppShell>
      <WaitSession />
    </AppShell>
  );
}
