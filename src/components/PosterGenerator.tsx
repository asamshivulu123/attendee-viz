import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoUploader } from "./PhotoUploader";
import { PosterPreview } from "./PosterPreview";
import { PosterCanvas } from "./PosterCanvas";
import { NameInput } from "./NameInput";
import { GenerateButton } from "./GenerateButton";
import { toast } from "sonner";
import posterTemplate from "@/assets/poster-template.jpg";

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

      // Set canvas size to match template
      canvas.width = 1080;
      canvas.height = 1080;

      // Load the template image
      const templateImg = new Image();
      await new Promise((resolve, reject) => {
        templateImg.onload = resolve;
        templateImg.onerror = reject;
        templateImg.src = posterTemplate;
      });

      // Draw the template as background
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

      // Load and draw user photo in the top left box
      const userImg = new Image();
      await new Promise((resolve, reject) => {
        userImg.onload = resolve;
        userImg.onerror = reject;
        userImg.src = posterData.photo!;
      });

      // Top box coordinates (based on template layout)
      const topBoxX = 108;
      const topBoxY = 115;
      const topBoxWidth = 430;
      const topBoxHeight = 430;

      // Create rounded rectangle mask for top box
      ctx.save();
      const radius = 20;
      ctx.beginPath();
      ctx.roundRect(topBoxX, topBoxY, topBoxWidth, topBoxHeight, radius);
      ctx.clip();
      
      // Draw user photo to fill the top box
      ctx.drawImage(userImg, topBoxX, topBoxY, topBoxWidth, topBoxHeight);
      ctx.restore();

      // Add user name in the bottom left box
      const nameBoxX = 108;
      const nameBoxY = 570;
      const nameBoxWidth = 430;
      const nameBoxHeight = 180;

      // Set text properties for name
      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Calculate text position (center of bottom box)
      const textX = nameBoxX + nameBoxWidth / 2;
      const textY = nameBoxY + nameBoxHeight / 2;
      
      // Draw name with text wrapping if needed
      const maxWidth = nameBoxWidth - 40; // Some padding
      const words = posterData.name.split(' ');
      let line = '';
      let y = textY;
      
      if (words.length === 1 || ctx.measureText(posterData.name).width <= maxWidth) {
        // Single line
        ctx.fillText(posterData.name, textX, y);
      } else {
        // Multi-line text
        const lineHeight = 45;
        const lines: string[] = [];
        
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line.trim());
        
        // Draw lines centered
        const startY = textY - ((lines.length - 1) * lineHeight) / 2;
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], textX, startY + (i * lineHeight));
        }
      }

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
    link.download = `${posterData.name.replace(/\s+/g, '_')}-N8N-Workshop-Sept14.png`;
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
            Upload your photo and name to create your official "I'm Attending" poster for the N8N Workshop on September 14th
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