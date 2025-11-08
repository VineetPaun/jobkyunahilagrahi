'use client'

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, ImagePlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";
import { processPdfAction } from "@/lib/actions";

const SUPPORTED_FORMAT = "PDF";

const isPdfFile = (file: File) =>
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

export function ImageUploadDemo() {
    const router = useRouter();
    const {
        fileName,
        selectedFile,
        fileInputRef,
        handleThumbnailClick,
        handleFileChange,
        handleRemove,
    } = useImageUpload();

    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!selectedFile) {
            return;
        }

        if (isPdfFile(selectedFile)) {
            // Process the PDF file
            const processPdf = async () => {
                setIsProcessing(true);
                try {
                    const formData = new FormData();
                    formData.append("file", selectedFile);

                    const result = await processPdfAction(formData);

                    if (result.success) {
                        console.log("✅ PDF processed successfully!");
                        console.log("PDF Data:", result.data);
                        // Navigate to review page after successful processing
                        router.push("/review");
                    } else {
                        console.error("❌ PDF processing failed:", result.error);
                        setUploadError(result.error || "Failed to process PDF");
                        handleRemove();
                    }
                } catch (error) {
                    console.error("❌ Error processing PDF:", error);
                    // Show a user-friendly error message
                    const errorMessage = error instanceof Error
                        ? error.message
                        : "Unable to process PDF. Please ensure it's a valid PDF file with max 2 pages.";
                    setUploadError(errorMessage);
                    handleRemove();
                } finally {
                    setIsProcessing(false);
                }
            };

            processPdf();
            return;
        }

        setUploadError(`Please upload a ${SUPPORTED_FORMAT} file.`);
        handleRemove();
    }, [selectedFile, router, handleRemove]);

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            setIsDragging(false);

            const file = event.dataTransfer.files?.[0];
            if (!file) {
                return;
            }

            if (!isPdfFile(file)) {
                setUploadError(`Please upload a ${SUPPORTED_FORMAT} file.`);
                return;
            }

            setUploadError(null);

            const fakeEvent = {
                target: {
                    files: [file],
                },
            } as unknown as ChangeEvent<HTMLInputElement>;

            handleFileChange(fakeEvent);
        },
        [handleFileChange],
    );

    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) {
                return;
            }

            if (!isPdfFile(file)) {
                setUploadError(`Please upload a ${SUPPORTED_FORMAT} file.`);
                event.target.value = "";
                return;
            }

            setUploadError(null);
            handleFileChange(event);
        },
        [handleFileChange],
    );

    return (
        <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload Your Resume</h3>
                <p className="text-sm text-muted-foreground">
                    Supported formats: {SUPPORTED_FORMAT} (max 2 pages)
                </p>
            </div>

            <Input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleInputChange}
            />

            <div
                onClick={handleThumbnailClick}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
                    isDragging && "border-primary/50 bg-primary/5",
                    isProcessing && "cursor-wait opacity-60",
                )}
            >
                {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                        <FileText className="h-10 w-10 text-primary" />
                        <p className="max-w-[240px] truncate text-sm font-medium">
                            {fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {isProcessing ? "Processing PDF..." : "Redirecting to the review page..."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-full bg-background p-3 shadow-sm">
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">Click to select</p>
                            <p className="text-xs text-muted-foreground">
                                or drag and drop file here
                            </p>
                        </div>
                    </>
                )}
            </div>

            {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
            )}
        </div>
    );
}
