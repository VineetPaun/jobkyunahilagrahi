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

export async function processPdfAction(formData: FormData) {
    const MAX_PAGES = 2; // Maximum allowed pages for resume

    try {
        const file = formData.get("file") as File;

        if (!file) {
            return {
                success: false,
                error: "No file provided",
            };
        }

        if (file.type !== "application/pdf") {
            return {
                success: false,
                error: "File must be a PDF",
            };
        }

        // Dynamically import the PDF loader (server-side only)
        const { loadPdfContent } = await import("@/lib/pdf-loader");

        const result = await loadPdfContent(file);

        // Validate page count
        if (result.metadata.totalPages > MAX_PAGES) {
            return {
                success: false,
                error: `Please upload a shorter resume. Your PDF has ${result.metadata.totalPages} pages, but we only accept resumes with up to ${MAX_PAGES} pages.`,
            };
        }

        // Log the PDF content to console
        console.log("=== PDF UPLOAD ===");
        console.log("File Name:", result.metadata.fileName);
        console.log("File Size:", result.metadata.fileSize, "bytes");
        console.log("Total Pages:", result.metadata.totalPages);
        console.log("PDF Info:", result.metadata.pdfInfo);
        console.log("\n=== PDF CONTENT ===");
        console.log(result.content);
        console.log("\n=== PAGE-BY-PAGE CONTENT ===");
        result.pages.forEach((page) => {
            console.log(`\n--- Page ${page.pageNumber} ---`);
            console.log(page.content);
        });
        console.log("\n=== END PDF UPLOAD ===\n");

        return {
            success: true,
            data: {
                fileName: result.metadata.fileName,
                fileSize: result.metadata.fileSize,
                totalPages: result.metadata.totalPages,
                content: result.content,
                pages: result.pages,
            },
        };
    } catch (error) {
        console.error("Error processing PDF:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to process PDF",
        };
    }
}
