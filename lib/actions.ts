"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session;
}

export async function signInAction(email: string, password: string) {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to sign in",
        };
    }
}

export async function signUpAction(
    email: string,
    password: string,
    name: string = ""
) {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            },
        });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to sign up",
        };
    }
}

export async function signOutAction() {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Failed to sign out",
        };
    }
}
