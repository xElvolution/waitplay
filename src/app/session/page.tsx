import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { WaitSession } from "@/components/wait/WaitSession";

export const metadata = {
  title: "Session | Waitplay",
  description: "Run a Waitplay agent wait session with live streamed progress.",
};

export default function SessionPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-10">
        <WaitSession />
      </main>
      <Footer />
    </>
  );
}
