import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, User, Calendar, Shield } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/");
    }

    const getInitials = (name: string | null, email: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return email.slice(0, 2).toUpperCase();
    };

    const formatDate = (timestamp: string | number | Date) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-background pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        Welcome back, {session.user.name || 'User'}!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's your account overview and information
                    </p>
                </div>

                {/* Profile Card */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Your account details and settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={session.user.image || undefined} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                        {getInitials(session.user.name, session.user.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {session.user.name || 'User'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {session.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium text-foreground">{session.user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">User ID:</span>
                                    <span className="font-mono text-xs text-foreground">{session.user.id}</span>
                                </div>
                                {session.user.createdAt && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Member since:</span>
                                        <span className="font-medium text-foreground">
                                            {formatDate(session.user.createdAt)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Email verified:</span>
                                    <span className="font-medium text-foreground">
                                        {session.user.emailVerified ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                            <CardDescription>Your activity summary</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Account Status</p>
                                <p className="text-2xl font-bold text-foreground">Active</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Session Status</p>
                                <p className="text-2xl font-bold text-green-600">Online</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Session Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Session Details</CardTitle>
                        <CardDescription>Current session information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted/50 p-4 rounded-lg border">
                            <pre className="text-xs overflow-auto">
                                {JSON.stringify(session, null, 2)}
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
