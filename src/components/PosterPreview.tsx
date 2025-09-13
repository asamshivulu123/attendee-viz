import { PosterData } from "./PosterGenerator";

interface PosterPreviewProps {
  posterData: PosterData;
}

export const PosterPreview = ({ posterData }: PosterPreviewProps) => {
  return (
    <div className="relative aspect-[4/5] max-w-sm mx-auto bg-poster-bg rounded-lg overflow-hidden shadow-lg">
      {/* Workshop Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-white text-2xl font-bold mb-2">N8N WORKSHOP</h1>
        <p className="text-white text-base opacity-90">I'm Attending</p>
      </div>
      
      {/* Photo Section */}
      <div className="flex justify-center py-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 bg-white/10 flex items-center justify-center">
          {posterData.photo ? (
            <img 
              src={posterData.photo} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white/60 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">Your Photo</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Name Section */}
      <div className="text-center py-4">
        <h2 className="text-white text-xl font-bold min-h-[28px] flex items-center justify-center">
          {posterData.name || (
            <span className="text-white/60 text-base">Your Name Here</span>
          )}
        </h2>
      </div>
      
      {/* Event Details */}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-6">
        <p className="text-white text-sm mb-2">The Student Spot & Founders Hub</p>
        <p className="text-poster-accent text-xs">Join us for an amazing workshop!</p>
      </div>
    </div>
  );
};