import { NextRequest, NextResponse } from "next/server";
import { loadPdfContent } from "@/lib/pdf-loader";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "File must be a PDF" },
                { status: 400 }
            );
        }

        // Parse the PDF content
        const result = await loadPdfContent(file);

        // Log the content to console
        console.log("=".repeat(80));
        console.log("PDF PARSING RESULT");
        console.log("=".repeat(80));
        console.log(`File Name: ${result.metadata.fileName}`);
        console.log(
            `File Size: ${(result.metadata.fileSize / 1024).toFixed(2)} KB`
        );
        console.log(`Total Pages: ${result.metadata.totalPages}`);
        console.log("-".repeat(80));
        console.log("FULL CONTENT:");
        console.log("-".repeat(80));
        console.log(result.content);
        console.log("-".repeat(80));
        console.log("PAGE BY PAGE:");
        console.log("-".repeat(80));
        result.pages.forEach((page) => {
            console.log(`\n--- Page ${page.pageNumber} ---`);
            console.log(page.content);
        });
        console.log("=".repeat(80));

        // Return the parsed data
        return NextResponse.json({
            success: true,
            content: result.content,
            pages: result.pages,
            metadata: result.metadata,
        });
    } catch (error) {
        console.error("Error parsing PDF:", error);
        return NextResponse.json(
            {
                error: "Failed to parse PDF",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
