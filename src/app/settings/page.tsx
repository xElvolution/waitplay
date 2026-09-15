import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata = {
  title: "Settings | Waitplay",
  description: "Waitplay product settings, timing, and auth-ready identity.",
};

export default function SettingsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-10">
        <SettingsClient />
      </main>
      <Footer />
    </>
  );
}
