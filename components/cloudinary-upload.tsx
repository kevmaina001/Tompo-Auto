"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (options: Record<string, unknown>, callback: (error: unknown, result: { event: string; info: { secure_url: string } }) => void) => {
        open: () => void;
      };
    };
  }
}

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  buttonText?: string;
  multiple?: boolean;
  maxFiles?: number;
  currentImages?: string[];
}

export function CloudinaryUpload({
  onUpload,
  buttonText = "Upload Image",
  multiple = false,
  maxFiles = 1,
  currentImages = [],
}: CloudinaryUploadProps) {
  const widgetRef = useRef<{ open: () => void } | null>(null);
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
              multiple: multiple,
              maxFiles: maxFiles,
              folder: "auto-spares",
              sources: ["local", "url", "camera"],
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
              maxImageFileSize: 2000000, // 2MB max
              maxImageWidth: 2000,
              maxImageHeight: 2000,
              cropping: false,
              resourceType: "image",
              // Optimize upload performance
              showPoweredBy: false,
              showUploadMoreButton: false,
              prepareUploadParams: (cb: (params: Record<string, unknown>) => void) => {
                // Client-side optimization settings
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
              if (!error && result) {
                if (result.event === "success") {
                  const imageUrl = result.info.secure_url;
                  onUpload(imageUrl);
                }
                // Show upload progress
                if (result.event === "upload-added") {
                  console.log("Upload started...");
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
  }, [multiple, maxFiles, onUpload]);

  const openWidget = () => {
    if (!widgetRef.current) {
      alert("Upload widget is still loading. Please wait a moment and try again.");
      return;
    }
    widgetRef.current.open();
  };

  return (
    <div>
      <Button
        type="button"
        onClick={openWidget}
        variant="outline"
        disabled={!isReady}
      >
        <Upload className="mr-2 h-4 w-4" />
        {!isReady ? "Loading..." : buttonText}
      </Button>

      {/* Preview current images */}
      {currentImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {currentImages.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
              <img
                src={url}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
