import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-16">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-foreground">
            Welcome to Better Auth
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete authentication system for Next.js with email/password
            and OAuth support (Google & GitHub)
          </p>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          <p>Powered by Better Auth + Next.js</p>
        </div>
      </div>
    </div>
  );
}

