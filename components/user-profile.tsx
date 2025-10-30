import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function UserProfile() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return <div>Not authenticated</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <p><strong>Name:</strong> {session.user.name || "Not provided"}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
        </div>
    );
}
