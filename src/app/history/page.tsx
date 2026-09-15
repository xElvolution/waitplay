import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { HistoryClient } from "@/components/wait/HistoryClient";

export const metadata = {
  title: "Session history | Waitplay",
  description: "Replay past Waitplay sessions and reopen shareable artifacts.",
};

export default function HistoryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-10">
        <HistoryClient />
      </main>
      <Footer />
    </>
  );
}
