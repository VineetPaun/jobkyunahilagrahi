"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { LiquidButton } from "@/components/liquid-glass-button";
import { OAuthButtons } from "@/components/oauth-buttons";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { error } = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/dashboard",
            });

            if (error) {
                setError(error.message || "Failed to sign up");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
                    <p className="mt-2 text-muted-foreground">
                        Already have an account?{" "}
                        <a href="/sign-in" className="text-primary hover:underline">
                            Sign in
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
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-foreground mb-1"
                            >
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="John Doe"
                            />
                        </div>

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
                                minLength={8}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                Must be at least 8 characters
                            </p>
                        </div>

                        <LiquidButton
                            type="submit"
                            disabled={loading}
                            className="w-full justify-center"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </LiquidButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
