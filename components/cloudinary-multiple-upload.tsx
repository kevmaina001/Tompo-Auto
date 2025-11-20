"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (options: Record<string, unknown>, callback: (error: unknown, result: { event: string; info: { secure_url: string } }) => void) => {
        open: () => void;
      };
    };
  }
}

interface CloudinaryMultipleUploadProps {
  onUpload: (urls: string[]) => void;
  currentImages: string[];
  onRemove: (index: number) => void;
  maxFiles?: number;
}

export function CloudinaryMultipleUpload({
  onUpload,
  currentImages,
  onRemove,
  maxFiles = 5,
}: CloudinaryMultipleUploadProps) {
  const widgetRef = useRef<{ open: () => void } | null>(null);
  const uploadedUrlsRef = useRef<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Poll for Cloudinary script to load
    const checkCloudinary = setInterval(() => {
      if (typeof window !== "undefined" && window.cloudinary) {
        clearInterval(checkCloudinary);

        try {
          widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          multiple: true,
          maxFiles: maxFiles,
          folder: "auto-spares",
          sources: ["local", "url", "camera"],
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxImageFileSize: 2000000, // 2MB max per image
          maxImageWidth: 2000,
          maxImageHeight: 2000,
          cropping: false,
          resourceType: "image",
          // Optimize upload performance
          showPoweredBy: false,
          showUploadMoreButton: false,
          prepareUploadParams: (cb: (params: Record<string, unknown>) => void) => {
            cb({
              transformation: [
                { width: 2000, height: 2000, crop: "limit" },
                { quality: "auto:good" },
                { fetch_format: "auto" }
              ]
            });
          },
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1",
            },
          },
        },
        (error: unknown, result: { event: string; info: { secure_url: string } }) => {
          if (!error && result && result.event === "success") {
            const imageUrl = result.info.secure_url;
            uploadedUrlsRef.current.push(imageUrl);
          }

          // When user closes the widget, send all uploaded URLs
          if (result && result.event === "close") {
            if (uploadedUrlsRef.current.length > 0) {
              onUpload([...currentImages, ...uploadedUrlsRef.current]);
              uploadedUrlsRef.current = [];
            }
          }

          if (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Please try again.");
          }
        }
      );
      setIsReady(true);
    } catch (err) {
      console.error("Error creating widget:", err);
    }
  }
}, 100);

// Timeout after 10 seconds
const timeout = setTimeout(() => {
  clearInterval(checkCloudinary);
  if (!isReady) {
    console.error("Cloudinary script failed to load");
  }
}, 10000);

return () => {
  clearInterval(checkCloudinary);
  clearTimeout(timeout);
};
  }, [maxFiles, currentImages, onUpload]);

  const openWidget = () => {
    if (!widgetRef.current) {
      alert("Upload widget is still loading. Please wait a moment and try again.");
      return;
    }
    uploadedUrlsRef.current = []; // Reset on new upload session
    widgetRef.current.open();
  };

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={openWidget}
        variant="outline"
        disabled={!isReady}
      >
        <Upload className="mr-2 h-4 w-4" />
        {!isReady ? "Loading..." : "Upload Product Images"}
      </Button>

      {/* Preview current images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {currentImages.map((url, idx) => (
            <div key={idx} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border">
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
        You can upload up to {maxFiles} images. The first image will be used as the main product image.
      </p>
    </div>
  );
}
