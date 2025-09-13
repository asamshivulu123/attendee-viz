import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoUploader } from "./PhotoUploader";
import { PosterPreview } from "./PosterPreview";
import { PosterCanvas } from "./PosterCanvas";
import { NameInput } from "./NameInput";
import { GenerateButton } from "./GenerateButton";
import { toast } from "sonner";

export interface PosterData {
  name: string;
  photo: string | null;
  photoFile: File | null;
}

export const PosterGenerator = () => {
  const [posterData, setPosterData] = useState<PosterData>({
    name: "",
    photo: null,
    photoFile: null,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalPoster, setFinalPoster] = useState<string | null>(null);

  const handlePhotoUpload = useCallback((file: File, dataUrl: string) => {
    setPosterData(prev => ({
      ...prev,
      photo: dataUrl,
      photoFile: file,
    }));
    toast.success("Photo uploaded successfully!");
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setPosterData(prev => ({
      ...prev,
      name,
    }));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!posterData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!posterData.photo) {
      toast.error("Please upload a photo");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate the final poster using canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas not supported');
      }

      // Set canvas size for the poster
      canvas.width = 800;
      canvas.height = 1000;

      // Create poster background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'hsl(200, 95%, 45%)');
      gradient.addColorStop(1, 'hsl(185, 85%, 50%)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add workshop title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('N8N WORKSHOP', canvas.width / 2, 100);
      
      // Add "I'm Attending" text
      ctx.font = '32px Inter, sans-serif';
      ctx.fillText("I'm Attending", canvas.width / 2, 160);

      // Load and draw user photo
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = posterData.photo!;
      });

      // Draw photo in a circle
      const photoSize = 300;
      const photoX = (canvas.width - photoSize) / 2;
      const photoY = 220;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      // Add user name
      ctx.fillStyle = 'white';
      ctx.font = 'bold 42px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(posterData.name, canvas.width / 2, 600);

      // Add event details
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText('The Student Spot & Founders Hub', canvas.width / 2, 750);
      
      ctx.font = '20px Inter, sans-serif';
      ctx.fillStyle = 'hsl(45, 95%, 55%)';
      ctx.fillText('Join us for an amazing workshop!', canvas.width / 2, 800);

      // Convert to blob and create download URL
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
      });
      
      const url = URL.createObjectURL(blob);
      setFinalPoster(url);
      
      toast.success("Poster generated successfully!");
    } catch (error) {
      console.error('Error generating poster:', error);
      toast.error("Failed to generate poster. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [posterData]);

  const handleDownload = useCallback(() => {
    if (!finalPoster) return;
    
    const link = document.createElement('a');
    link.href = finalPoster;
    link.download = `${posterData.name}-n8n-workshop-poster.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Poster downloaded!");
  }, [finalPoster, posterData.name]);

  const handleReset = useCallback(() => {
    setPosterData({
      name: "",
      photo: null,
      photoFile: null,
    });
    setFinalPoster(null);
    if (finalPoster) {
      URL.revokeObjectURL(finalPoster);
    }
  }, [finalPoster]);

  return (
    <div className="min-h-screen bg-workshop-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-workshop-gradient bg-clip-text text-transparent mb-4">
            N8N Workshop Poster Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your personalized "I'm Attending" poster for the N8N Workshop hosted by The Student Spot & Founders Hub
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Input Controls */}
          <div className="space-y-8">
            <Card className="shadow-hover-lift transition-all duration-300 hover:shadow-hover-glow">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Upload Your Photo</h2>
                <PhotoUploader onPhotoUpload={handlePhotoUpload} currentPhoto={posterData.photo} />
              </CardContent>
            </Card>

            <Card className="shadow-hover-lift transition-all duration-300 hover:shadow-hover-glow">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Enter Your Name</h2>
                <NameInput value={posterData.name} onChange={handleNameChange} />
              </CardContent>
            </Card>

            <GenerateButton 
              onClick={handleGenerate}
              onDownload={handleDownload}
              onReset={handleReset}
              isGenerating={isGenerating}
              finalPoster={finalPoster}
              canGenerate={Boolean(posterData.name.trim() && posterData.photo)}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8">
            <Card className="shadow-hover-lift">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Live Preview</h2>
                {finalPoster ? (
                  <div className="text-center">
                    <img 
                      src={finalPoster} 
                      alt="Generated poster" 
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                    />
                  </div>
                ) : (
                  <PosterPreview posterData={posterData} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};