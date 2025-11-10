"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { LiquidButton } from "@/components/liquid-glass-button";
import { OAuthButtons } from "@/components/oauth-buttons";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/",
            });

            if (error) {
                setError(error.message || "Failed to sign in");
            } else {
                router.push("/");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground">Sign in to your account</h2>
                    <p className="mt-2 text-muted-foreground">
                        Or{" "}
                        <a href="/sign-up" className="text-primary hover:underline">
                            create a new account
                        </a>
                    </p>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-md space-y-6 border">
                    {/* OAuth Buttons */}
                    <OAuthButtons />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-card text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-foreground mb-1"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-foreground mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="••••••••"
                            />
                        </div>

                        <LiquidButton
                            type="submit"
                            disabled={loading}
                            className="w-full justify-center"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </LiquidButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
