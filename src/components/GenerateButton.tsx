import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  onDownload: () => void;
  onReset: () => void;
  isGenerating: boolean;
  finalPoster: string | null;
  canGenerate: boolean;
}

export const GenerateButton = ({ 
  onClick, 
  onDownload, 
  onReset, 
  isGenerating, 
  finalPoster, 
  canGenerate 
}: GenerateButtonProps) => {
  if (finalPoster) {
    return (
      <div className="space-y-4">
        <Button 
          onClick={onDownload}
          className="w-full bg-workshop-gradient hover:opacity-90 transition-opacity text-lg py-3"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Poster
        </Button>
        
        <Button 
          onClick={onReset}
          variant="outline"
          className="w-full border-workshop-primary text-workshop-primary hover:bg-workshop-primary hover:text-white transition-colors"
          size="lg"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Create Another
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={onClick}
      disabled={!canGenerate || isGenerating}
      className="w-full bg-workshop-gradient hover:opacity-90 transition-opacity text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      size="lg"
    >
      {isGenerating ? (
        <>
          <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Poster
        </>
      )}
    </Button>
  );
};