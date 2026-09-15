import { AppShell } from "@/components/layout/AppShell";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata = {
  title: "Settings | Waitplay",
  description: "Waitplay product settings, timing, and auth-ready identity.",
};

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsClient />
    </AppShell>
  );
}
