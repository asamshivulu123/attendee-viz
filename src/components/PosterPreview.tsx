import { PosterData } from "./PosterGenerator";
import posterTemplate from "@/assets/poster-template.jpg";

interface PosterPreviewProps {
  posterData: PosterData;
}

export const PosterPreview = ({ posterData }: PosterPreviewProps) => {
  return (
    <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg">
      {/* Template Background */}
      <img 
        src={posterTemplate} 
        alt="Poster template" 
        className="w-full h-full object-cover"
      />
      
      {/* Top Box - Photo Overlay */}
      <div className="absolute top-[10.6%] left-[10%] w-[39.8%] h-[39.8%] rounded-[20px] overflow-hidden">
        {posterData.photo ? (
          <img 
            src={posterData.photo} 
            alt="User photo" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-black/20 flex items-center justify-center">
            <div className="text-white/80 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">Upload Photo</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Box - Name Overlay */}
      <div className="absolute top-[52.8%] left-[10%] w-[39.8%] h-[16.7%] flex items-center justify-center">
        <div className="text-center px-4">
          {posterData.name ? (
            <h2 className="text-white text-sm font-bold break-words leading-tight">
              {posterData.name}
            </h2>
          ) : (
            <span className="text-white/60 text-xs">Enter Your Name</span>
          )}
        </div>
      </div>
    </div>
  );
};