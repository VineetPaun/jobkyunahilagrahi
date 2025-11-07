import Link from "next/link";

import { ImageUploadDemo } from "@/components/image-upload-demo";
import { LiquidButton } from "@/components/liquid-glass-button";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0">
        <FlickeringGrid
          className="absolute inset-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
      </div>
      <div className="mt-10 relative z-10 max-w-2xl space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Bro, Job Kyu Nahi Lag Rahi?! 💀
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload your resume, sit back, and let us roast—uhh… review—it 😎. Get real,
          personalized feedback on what’s stopping you from landing that dream tech job. No
          fake motivation, no sugarcoating — just straight-up insights to help you level up
          your resume, skills, and chances.
        </p>
        <div className="flex justify-center">
          <ImageUploadDemo />
        </div>
        <p className="text-lg text-muted-foreground">
          Or Click
        </p>
        <div className="flex justify-center">
          <LiquidButton asChild size="xl" className="font-semibold">
            <Link href="/review">😭 Tell Me Why I’m Jobless</Link>
          </LiquidButton>
        </div>
      </div>
    </main>
  );
}

