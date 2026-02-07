import { useState } from "react";
import "./ProgressiveImage.css";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProgressiveImage({
  src,
  alt,
  className = "",
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`progressive-image-container ${className}`}>
      {/* Placeholder/blur background */}
      <div className={`progressive-placeholder ${isLoaded ? "hidden" : ""}`} />

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`progressive-image ${isLoaded ? "loaded" : ""}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}
