import React, { useState, useCallback } from 'react';
import './OptimizedImage.css';

const WRAPPER_BASE_STYLE = {
  position: 'relative',
  display: 'inline-block',
  overflow: 'hidden',
  lineHeight: 0,
};

const IMG_BASE_STYLE = {
  display: 'block',
  width: '100%',
  height: '100%',
};

const PLACEHOLDER_STYLE = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(90deg, #eeeeee 25%, #f5f5f5 50%, #eeeeee 75%)',
  backgroundSize: '200% 100%',
  animation: 'optimized-image-shimmer 1.2s infinite linear',
  borderRadius: 'inherit',
};

const IMG_HIDDEN = { opacity: 0 };
const IMG_VISIBLE = { opacity: 1, transition: 'opacity 200ms ease-in' };

const mergeStyles = (...parts) => {
  const result = {};
  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) Object.assign(result, parts[i]);
  }
  return result;
};

const shallowEqualStyle = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (let i = 0; i < ak.length; i++) {
    const k = ak[i];
    if (a[k] !== b[k]) return false;
  }
  return true;
};

const OptimizedImage = ({ src, alt = '', className, style, fallbackSrc }) => {
  const [hadError, setHadError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trackedSrc, setTrackedSrc] = useState(src);

  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setHadError(false);
    setIsLoaded(false);
  }

  const handleLoad = useCallback(() => setIsLoaded(true), []);
  const handleError = useCallback(() => setHadError(true), []);

  const useFallback = !src || hadError;

  if (useFallback && !fallbackSrc) {
    return null;
  }

  const currentSrc = useFallback ? fallbackSrc : src;
  const showPlaceholder = !useFallback && !isLoaded;
  const imgVisibility = showPlaceholder ? IMG_HIDDEN : IMG_VISIBLE;

  return (
    <span className={className} style={mergeStyles(WRAPPER_BASE_STYLE, style)}>
      {showPlaceholder && (
        <span style={PLACEHOLDER_STYLE} aria-hidden="true" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={mergeStyles(IMG_BASE_STYLE, style, imgVisibility)}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
};

const arePropsEqual = (prev, next) =>
  prev.src === next.src &&
  prev.alt === next.alt &&
  prev.className === next.className &&
  prev.fallbackSrc === next.fallbackSrc &&
  shallowEqualStyle(prev.style, next.style);

export default React.memo(OptimizedImage, arePropsEqual);
