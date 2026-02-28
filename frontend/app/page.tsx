import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/home/Navigation";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { CodeExample } from "@/components/home/CodeExample";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-violet-950">
      <Navigation />
      <HomeContent />
    </div>
  );
}

function HomeContent() {
  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4">
        <Features />
        <CodeExample />
        <Separator className="my-20 max-w-4xl mx-auto" />
        <Footer />
      </div>
    </div>
  );
}
