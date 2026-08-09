import React, { useState } from 'react';

export default function ImageWithFallback({ src, alt, className, fallbackSrc }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const defaultPlaceholder = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80";

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc || defaultPlaceholder);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || "Atelier Reference Asset"}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}