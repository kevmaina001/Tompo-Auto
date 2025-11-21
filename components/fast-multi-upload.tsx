"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, Loader2, X } from "lucide-react";

interface FastMultiUploadProps {
  currentImages: string[];
  onUpdate: (urls: string[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
}

export function FastMultiUpload({
  currentImages,
  onUpdate,
  onRemove,
  maxFiles = 5,
}: FastMultiUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const totalFiles = Math.min(files.length, maxFiles);
      const uploadedUrls: string[] = [];
      let completed = 0;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];

        // Create form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        formData.append("folder", "auto-spares");

        // Direct upload to Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.secure_url);

        completed++;
        setProgress(Math.round((completed / totalFiles) * 100));
      }

      // Add all uploaded URLs to current images
      onUpdate([...currentImages, ...uploadedUrls]);

      // Reset file input
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Some uploads failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label
          htmlFor="multi-file-upload"
          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading... {progress}%
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Select Images (Max {maxFiles})
            </>
          )}
        </Label>
        <Input
          id="multi-file-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif,image/svg+xml,image/bmp,image/tiff"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {/* Preview current images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {currentImages.map((url, idx) => (
            <div key={idx} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                <img
                  src={url}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(idx)}
              >
                <X className="h-4 w-4" />
              </Button>
              {idx === 0 && (
                <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚡ Fast direct upload. Select multiple images at once. Current: {currentImages.length}/{maxFiles}
      </p>
    </div>
  );
}
