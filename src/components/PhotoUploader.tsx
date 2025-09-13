import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploaderProps {
  onPhotoUpload: (file: File, dataUrl: string) => void;
  currentPhoto: string | null;
}

export const PhotoUploader = ({ onPhotoUpload, currentPhoto }: PhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onPhotoUpload(file, dataUrl);
    };
    reader.readAsDataURL(file);
  }, [onPhotoUpload]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleRemovePhoto = useCallback(() => {
    // Reset photo by creating empty file and data
    const emptyFile = new File([], '', { type: 'image/jpeg' });
    onPhotoUpload(emptyFile, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onPhotoUpload]);

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {currentPhoto ? (
        <div className="relative">
          <div className="aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden border-4 border-workshop-primary/20">
            <img 
              src={currentPhoto} 
              alt="Uploaded photo" 
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemovePhoto}
            className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-workshop-primary/30 rounded-lg p-8 text-center hover:border-workshop-primary/50 transition-colors cursor-pointer"
          onClick={handleButtonClick}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-workshop-primary" />
          <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop your photo here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supports JPG, PNG, WEBP (max 10MB)
          </p>
        </div>
      )}
      
      {!currentPhoto && (
        <Button 
          onClick={handleButtonClick}
          className="w-full bg-workshop-gradient hover:opacity-90 transition-opacity"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Photo
        </Button>
      )}
    </div>
  );
};