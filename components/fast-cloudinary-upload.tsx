"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, Loader2, X, Camera } from "lucide-react";

interface FastCloudinaryUploadProps {
  onUpload: (url: string) => void;
  currentImages?: string[];
  onRemove?: (index: number) => void;
  multiple?: boolean;
}

export function FastCloudinaryUpload({
  onUpload,
  currentImages = [],
  onRemove,
  multiple = false,
}: FastCloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
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
      const errorData = await response.json().catch(() => ({}));
      console.error("Cloudinary error:", errorData);
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadFile(file);
        onUpload(url);
      }
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const url = await uploadFile(files[0]);
      onUpload(url);
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload buttons - stacked on mobile */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Camera capture button */}
        <Label
          htmlFor="camera-upload"
          className={`cursor-pointer w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-12 sm:h-10 px-4 py-2 ${
            uploading
              ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400 border border-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 sm:h-4 sm:w-4 animate-spin" />
              <span className="text-base sm:text-sm">Uploading...</span>
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
          id="camera-upload"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          disabled={uploading}
          className="hidden"
        />

        {/* File picker button */}
        <Label
          htmlFor="file-upload"
          className={`cursor-pointer w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-12 sm:h-10 px-4 py-2 ${
            uploading
              ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400 border border-gray-200"
              : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 sm:h-4 sm:w-4 animate-spin" />
              <span className="text-base sm:text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-base sm:text-sm">{multiple ? "Choose Files" : "Choose File"}</span>
            </>
          )}
        </Label>
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {/* Preview current images */}
      {currentImages.length > 0 && onRemove && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {currentImages.map((url, idx) => (
            <div key={idx} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={url}
                  alt={`Uploaded ${idx + 1}`}
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
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        📸 Take photos or select files.
      </p>
    </div>
  );
}
