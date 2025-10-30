import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">
            Welcome to Better Auth
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A complete authentication system for Next.js with email/password
            and OAuth support (Google & GitHub)
          </p>
        </div>

        <div className="flex gap-4 justify-center items-center">
          <Link href="/sign-in">
            <Button size="lg" variant="default">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg" variant="outline">
              Sign Up
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-500">
          <p>Powered by Better Auth + Next.js</p>
        </div>
      </div>
    </div>
  );
}

