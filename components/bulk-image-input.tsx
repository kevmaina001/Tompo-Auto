"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Link, X } from "lucide-react";

interface BulkImageInputProps {
  currentImages: string[];
  onUpdate: (urls: string[]) => void;
  onRemove: (index: number) => void;
}

export function BulkImageInput({
  currentImages,
  onUpdate,
  onRemove,
}: BulkImageInputProps) {
  const [urlInput, setUrlInput] = useState("");

  const handleAddUrls = () => {
    if (!urlInput.trim()) return;

    // Split by newlines or commas, trim, and filter empty
    const urls = urlInput
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length > 0) {
      onUpdate([...currentImages, ...urls]);
      setUrlInput("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bulk-urls">
          Paste Image URLs (one per line or comma-separated)
        </Label>
        <Textarea
          id="bulk-urls"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg
https://example.com/image3.jpg"
          rows={5}
          className="font-mono text-sm"
        />
      </div>

      <Button type="button" onClick={handleAddUrls} variant="secondary">
        <Link className="mr-2 h-4 w-4" />
        Add URLs to Images
      </Button>

      {/* Preview current images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {currentImages.map((url, idx) => (
            <div key={idx} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                <img
                  src={url}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='14'%3EInvalid%3C/text%3E%3C/svg%3E";
                  }}
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
        💡 <strong>Pro tip for 100+ images:</strong> Upload your images to any hosting service
        (Google Drive, Imgur, your own server), then paste the URLs here. This is much faster
        than uploading one by one!
      </p>
    </div>
  );
}
