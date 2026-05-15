"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, Loader2, X, Camera, Sparkles, Wand2 } from "lucide-react";

interface FastMultiUploadProps {
  currentImages: string[];
  onUpdate: (urls: string[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
}

// Resize image to reduce upload time - max 1200px, 0.7 quality
const resizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    // If not an image or small enough, return original
    if (!file.type.startsWith('image/') || file.size < 100000) {
      resolve(file);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      const maxSize = 1200;
      let { width, height } = img;

      // Only resize if larger than maxSize
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else {
          width = (width / height) * maxSize;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(blob || file),
        'image/jpeg',
        0.7
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve(file); // Fallback to original on error
    };

    img.src = URL.createObjectURL(file);
  });
};

// Load @imgly/background-removal from a CDN at runtime so webpack never bundles it.
// Bundling this package fails because its onnxruntime dependency uses import.meta
// in a way that Next.js's SWC parser rejects. CDN ESM bypass works in all modern browsers.
type ImglyModule = { removeBackground: (input: string | Blob | File) => Promise<Blob> };
let imglyModulePromise: Promise<ImglyModule> | null = null;
const loadBackgroundRemoval = (): Promise<ImglyModule> => {
  if (!imglyModulePromise) {
    imglyModulePromise = import(
      /* webpackIgnore: true */
      // @ts-expect-error - dynamic CDN ESM import has no static types
      "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm"
    ) as Promise<ImglyModule>;
  }
  return imglyModulePromise;
};

type BgStyle = "white" | "dark" | "transparent";

const BG_COLORS: Record<Exclude<BgStyle, "transparent">, string> = {
  white: "#ffffff",
  dark: "#111111",
};

// Composite the transparent PNG cutout onto the chosen background.
// "transparent" returns the original PNG blob untouched.
// "white" / "dark" composite onto a solid color and return JPEG.
const compositeBackground = (blob: Blob, style: BgStyle): Promise<{ blob: Blob; ext: string }> => {
  if (style === "transparent") {
    return Promise.resolve({ blob, ext: "png" });
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.fillStyle = BG_COLORS[style];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((out) => {
        if (out) resolve({ blob: out, ext: "jpg" });
        else reject(new Error("Failed to encode JPEG"));
      }, "image/jpeg", 0.9);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load processed image"));
    };
    img.src = URL.createObjectURL(blob);
  });
};

// Upload a Blob to Cloudinary, return the secure_url
const uploadBlob = async (blob: Blob, filename: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", blob, filename);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
  formData.append("folder", "auto-spares");
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  const data = await response.json();
  return data.secure_url as string;
};

export function FastMultiUpload({
  currentImages,
  onUpdate,
  onRemove,
  maxFiles = 5,
}: FastMultiUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingIdx, setProcessingIdx] = useState<number | null>(null);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [bgError, setBgError] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeBackgroundFromIndex = async (idx: number, style: BgStyle) => {
    setBgError(null);
    setProcessingIdx(idx);
    try {
      const { removeBackground } = await loadBackgroundRemoval();
      const sourceUrl = currentImages[idx];
      const cutoutBlob = await removeBackground(sourceUrl);
      const { blob: finalBlob, ext } = await compositeBackground(cutoutBlob, style);
      const newUrl = await uploadBlob(finalBlob, `cleaned-${Date.now()}.${ext}`);
      const next = [...currentImages];
      next[idx] = newUrl;
      onUpdate(next);
    } catch (err) {
      console.error("Background removal failed:", err);
      setBgError("Background removal failed. Try again.");
    } finally {
      setProcessingIdx(null);
    }
  };

  const cleanAllImages = async (style: BgStyle) => {
    if (currentImages.length === 0) return;
    setBgError(null);
    setBatchProcessing(true);
    try {
      const { removeBackground } = await loadBackgroundRemoval();
      const next = [...currentImages];
      for (let i = 0; i < next.length; i++) {
        setProcessingIdx(i);
        const cutoutBlob = await removeBackground(next[i]);
        const { blob: finalBlob, ext } = await compositeBackground(cutoutBlob, style);
        next[i] = await uploadBlob(finalBlob, `cleaned-${Date.now()}-${i}.${ext}`);
        onUpdate([...next]);
      }
    } catch (err) {
      console.error("Batch background removal failed:", err);
      setBgError("Batch cleanup failed partway. Some images may already be cleaned.");
    } finally {
      setProcessingIdx(null);
      setBatchProcessing(false);
    }
  };

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

        // Resize image before upload for faster uploads
        const resizedBlob = await resizeImage(file);

        // Create form data
        const formData = new FormData();
        formData.append("file", resizedBlob, file.name);
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
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.secure_url);

        completed++;
        setProgress(Math.round((completed / totalFiles) * 100));
      }

      // Add all uploaded URLs to current images
      onUpdate([...currentImages, ...uploadedUrls]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
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
                <span className="text-base sm:text-sm">Uploading... {progress}%</span>
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
                <span className="text-base sm:text-sm">Uploading... {progress}%</span>
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
          {currentImages.map((url, idx) => {
            const isProcessing = processingIdx === idx;
            const anyBusy = processingIdx !== null || batchProcessing || uploading;
            return (
              <div key={idx} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                  <img
                    src={url}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
                      <Loader2 className="h-5 w-5 animate-spin mr-1" /> Cleaning...
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-7 w-7 sm:h-6 sm:w-6 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(idx)}
                  disabled={anyBusy}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute top-1 left-1 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeBackgroundFromIndex(idx, "white")}
                    disabled={anyBusy}
                    title="Remove background → white"
                    className="h-6 w-6 rounded-full bg-white border-2 border-gray-400 shadow disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
                  />
                  <button
                    type="button"
                    onClick={() => removeBackgroundFromIndex(idx, "dark")}
                    disabled={anyBusy}
                    title="Remove background → dark"
                    className="h-6 w-6 rounded-full bg-neutral-900 border-2 border-gray-400 shadow disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
                  />
                  <button
                    type="button"
                    onClick={() => removeBackgroundFromIndex(idx, "transparent")}
                    disabled={anyBusy}
                    title="Remove background → transparent PNG"
                    className="h-6 w-6 rounded-full border-2 border-gray-400 shadow disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                      backgroundSize: "8px 8px",
                      backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                    }}
                  />
                </div>
                {idx === 0 && (
                  <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    Main
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {currentImages.length > 1 && (
        <div className="flex flex-col sm:flex-row gap-2">
          {batchProcessing ? (
            <div className="flex items-center text-sm text-gray-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cleaning all images...
            </div>
          ) : (
            <>
              <span className="text-xs text-gray-600 self-center">Clean all backgrounds to:</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => cleanAllImages("white")}
                disabled={batchProcessing || processingIdx !== null || uploading}
              >
                <Wand2 className="mr-1 h-3 w-3" /> White
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => cleanAllImages("dark")}
                disabled={batchProcessing || processingIdx !== null || uploading}
              >
                <Wand2 className="mr-1 h-3 w-3" /> Dark
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => cleanAllImages("transparent")}
                disabled={batchProcessing || processingIdx !== null || uploading}
              >
                <Wand2 className="mr-1 h-3 w-3" /> Transparent
              </Button>
            </>
          )}
        </div>
      )}

      {bgError && <p className="text-xs text-red-600">{bgError}</p>}

      <p className="text-xs text-gray-500">
        Take photos or select files. {currentImages.length}/{maxFiles}. Hover an image and click a swatch (<Sparkles className="inline h-3 w-3" /> white / dark / transparent) to remove its background.
      </p>
    </div>
  );
}
