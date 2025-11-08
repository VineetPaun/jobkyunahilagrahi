import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs/promises";
import path from "path";
import os from "os";

/**
 * Load and extract text content from a PDF file
 * @param file - The PDF file to process
 * @param options - Optional configuration for PDF loading
 * @returns Promise with extracted text content and metadata
 */
export async function loadPdfContent(
    file: File,
    options?: {
        splitPages?: boolean;
        parsedItemSeparator?: string;
    }
): Promise<{
    content: string;
    pages: Array<{
        pageNumber: number;
        content: string;
    }>;
    metadata: {
        fileName: string;
        fileSize: number;
        totalPages: number;
        pdfInfo?: Record<string, unknown>;
    };
}> {
    // Create a temporary file to store the uploaded PDF
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(
        tempDir,
        `upload-${Date.now()}-${file.name}`
    );

    try {
        // Convert File to Buffer and write to temp file
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(tempFilePath, buffer);

        // Load PDF using LangChain PDFLoader
        const loader = new PDFLoader(tempFilePath, {
            splitPages: options?.splitPages ?? true,
            parsedItemSeparator: options?.parsedItemSeparator ?? " ",
        });

        const docs = await loader.load();

        // Extract content from all pages
        const pages = docs.map((doc) => ({
            pageNumber: doc.metadata?.loc?.pageNumber ?? 0,
            content: doc.pageContent,
        }));

        // Combine all page content
        const fullContent = docs.map((doc) => doc.pageContent).join("\n\n");

        // Get PDF metadata
        const pdfMetadata = docs[0]?.metadata?.pdf;

        return {
            content: fullContent,
            pages,
            metadata: {
                fileName: file.name,
                fileSize: file.size,
                totalPages: pdfMetadata?.totalPages ?? docs.length,
                pdfInfo: pdfMetadata?.info,
            },
        };
    } finally {
        // Clean up temporary file
        try {
            await fs.unlink(tempFilePath);
        } catch (error) {
            console.error("Error deleting temporary file:", error);
        }
    }
}

/**
 * Load PDF content from a file path (server-side only)
 * @param filePath - Path to the PDF file
 * @param options - Optional configuration for PDF loading
 * @returns Promise with extracted text content and metadata
 */
export async function loadPdfFromPath(
    filePath: string,
    options?: {
        splitPages?: boolean;
        parsedItemSeparator?: string;
    }
): Promise<{
    content: string;
    pages: Array<{
        pageNumber: number;
        content: string;
    }>;
    metadata: {
        totalPages: number;
        pdfInfo?: Record<string, unknown>;
    };
}> {
    const loader = new PDFLoader(filePath, {
        splitPages: options?.splitPages ?? true,
        parsedItemSeparator: options?.parsedItemSeparator ?? " ",
    });

    const docs = await loader.load();

    const pages = docs.map((doc) => ({
        pageNumber: doc.metadata?.loc?.pageNumber ?? 0,
        content: doc.pageContent,
    }));

    const fullContent = docs.map((doc) => doc.pageContent).join("\n\n");
    const pdfMetadata = docs[0]?.metadata?.pdf;

    return {
        content: fullContent,
        pages,
        metadata: {
            totalPages: pdfMetadata?.totalPages ?? docs.length,
            pdfInfo: pdfMetadata?.info,
        },
    };
}
