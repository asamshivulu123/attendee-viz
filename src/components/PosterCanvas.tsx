// Utility component for canvas-based poster generation
// This could be expanded for more complex poster layouts

interface PosterCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export const PosterCanvas = ({ 
  width = 800, 
  height = 1000, 
  className = "" 
}: PosterCanvasProps) => {
  return (
    <canvas 
      width={width} 
      height={height} 
      className={`hidden ${className}`}
      id="poster-canvas"
    />
  );
};