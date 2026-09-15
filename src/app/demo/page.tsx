import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { DemoExperience } from "@/components/wait/DemoExperience";

export const metadata = {
  title: "Demo | Waitplay",
  description: "Interactive Waitplay demo with simulated agent latency.",
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-10">
        <DemoExperience />
      </main>
      <Footer />
    </>
  );
}
