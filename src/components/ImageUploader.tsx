import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full max-w-md p-8 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all cursor-pointer group"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="flex flex-col items-center justify-center gap-4 cursor-pointer"
      >
        <Upload className="w-12 h-12 text-purple-500 group-hover:scale-110 transition-transform" />
        <div className="text-center">
          <p className="text-lg font-medium text-purple-700">Drop your image here</p>
          <p className="text-sm text-purple-500">or click to upload</p>
        </div>
      </label>
    </div>
  );
};