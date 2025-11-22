"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, Loader2, X, Camera } from "lucide-react";

interface FastMultiUploadProps {
  currentImages: string[];
  onUpdate: (urls: string[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
}

// Compress image before upload
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Scale down if larger than maxWidth
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not compress image"));
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function FastMultiUpload({
  currentImages,
  onUpdate,
  onRemove,
  maxFiles = 5,
}: FastMultiUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const remainingSlots = maxFiles - currentImages.length;
      const totalFiles = Math.min(files.length, remainingSlots);

      if (totalFiles <= 0) {
        alert(`Maximum ${maxFiles} images allowed. Please remove some images first.`);
        setUploading(false);
        return;
      }

      const uploadedUrls: string[] = [];
      let completed = 0;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];

        // Show compression status
        setStatusText(`Compressing ${i + 1}/${totalFiles}...`);

        // Compress the image (reduces size by 60-80%)
        let fileToUpload: Blob | File = file;
        if (file.type.startsWith("image/") && file.size > 100000) { // Only compress if > 100KB
          try {
            fileToUpload = await compressImage(file);
          } catch {
            // If compression fails, use original
            fileToUpload = file;
          }
        }

        setStatusText(`Uploading ${i + 1}/${totalFiles}...`);

        // Create form data
        const formData = new FormData();
        formData.append("file", fileToUpload, file.name);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        formData.append("folder", "auto-spares");
        // Use eager transformation for faster processing
        formData.append("eager", "c_limit,w_800,q_auto");

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
      setStatusText("");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Some uploads failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
      setStatusText("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      await uploadFiles(files);
      e.target.value = "";
    }
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      await uploadFiles(files);
      e.target.value = "";
    }
  };

  const canAddMore = currentImages.length < maxFiles;

  return (
    <div className="space-y-4">
      {/* Upload buttons - stacked on mobile, side by side on larger screens */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Camera capture button - prominent on mobile */}
        <div className="flex-1 sm:flex-none">
          <Label
            htmlFor="camera-capture"
            className={`cursor-pointer w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-12 sm:h-10 px-4 py-2 ${
              !canAddMore || uploading
                ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400 border border-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 sm:h-4 sm:w-4 animate-spin" />
                <span className="text-base sm:text-sm">{statusText || `${progress}%`}</span>
              </>
            ) : (
              <>
                <Camera className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                <span className="text-base sm:text-sm">Take Photo</span>
              </>
            )}
          </Label>
          <Input
            ref={cameraInputRef}
            id="camera-capture"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            disabled={uploading || !canAddMore}
            className="hidden"
          />
        </div>

        {/* File picker button */}
        <div className="flex-1 sm:flex-none">
          <Label
            htmlFor="multi-file-upload"
            className={`cursor-pointer w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-12 sm:h-10 px-4 py-2 ${
              !canAddMore || uploading
                ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400 border border-gray-200"
                : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 sm:h-4 sm:w-4 animate-spin" />
                <span className="text-base sm:text-sm">{statusText || `${progress}%`}</span>
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                <span className="text-base sm:text-sm">Choose Files</span>
              </>
            )}
          </Label>
          <Input
            ref={fileInputRef}
            id="multi-file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading || !canAddMore}
            className="hidden"
          />
        </div>
      </div>

      {/* Preview current images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
                className="absolute top-1 right-1 h-7 w-7 sm:h-6 sm:w-6 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(idx)}
              >
                <X className="h-4 w-4" />
              </Button>
              {idx === 0 && (
                <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        📸 Images are auto-compressed for faster uploads. {currentImages.length}/{maxFiles}
      </p>
    </div>
  );
}
