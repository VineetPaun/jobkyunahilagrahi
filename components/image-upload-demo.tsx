'use client'
import { useCallback, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Upload, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";

const iconButtonClasses =
    "inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm transition hover:bg-background";

export function ImageUploadDemo() {
    const {
        previewUrl,
        fileName,
        fileInputRef,
        handleThumbnailClick,
        handleFileChange,
        handleRemove,
    } = useImageUpload({
        onUpload: (url) => console.log("Uploaded image URL:", url),
    });

    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            setIsDragging(false);

            const file = event.dataTransfer.files?.[0];
            if (file && file.type.startsWith("image/")) {
                const fakeEvent = {
                    target: {
                        files: [file],
                    },
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleFileChange(fakeEvent);
            }
        },
        [handleFileChange],
    );

    return (
        <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload Your Resume</h3>
                <p className="text-sm text-muted-foreground">
                    Supported formats: PDF
                </p>
            </div>

            <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {!previewUrl ? (
                <div
                    onClick={handleThumbnailClick}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        "flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
                        isDragging && "border-primary/50 bg-primary/5",
                    )}
                >
                    <div className="rounded-full bg-background p-3 shadow-sm">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium">Click to select</p>
                        <p className="text-xs text-muted-foreground">
                            or drag and drop file here
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <div className="group relative h-64 overflow-hidden rounded-lg border">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                                type="button"
                                onClick={handleThumbnailClick}
                                className={iconButtonClasses}
                            >
                                <Upload className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className={cn(iconButtonClasses, "text-destructive")}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    {fileName && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="truncate">{fileName}</span>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="ml-auto rounded-full p-1 transition hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
