interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
}

const OptimizedImage = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  sizes = "100vw",
}: OptimizedImageProps) => {
  // Generate WebP and different sizes for Unsplash images
  const getOptimizedUrl = (url: string, width: number, format: string = "auto") => {
    if (url.includes("unsplash.com")) {
      return `${url}&w=${width}&fm=${format}&q=80`;
    }
    return url;
  };

  const isUnsplashImage = src.includes("unsplash.com");

  if (isUnsplashImage) {
    return (
      <picture>
        {/* WebP format for modern browsers */}
        <source
          type="image/webp"
          srcSet={`
            ${getOptimizedUrl(src, 400, "webp")} 400w,
            ${getOptimizedUrl(src, 800, "webp")} 800w,
            ${getOptimizedUrl(src, 1200, "webp")} 1200w,
            ${getOptimizedUrl(src, 1600, "webp")} 1600w
          `}
          sizes={sizes}
        />
        {/* Fallback JPEG for older browsers */}
        <source
          type="image/jpeg"
          srcSet={`
            ${getOptimizedUrl(src, 400, "jpg")} 400w,
            ${getOptimizedUrl(src, 800, "jpg")} 800w,
            ${getOptimizedUrl(src, 1200, "jpg")} 1200w,
            ${getOptimizedUrl(src, 1600, "jpg")} 1600w
          `}
          sizes={sizes}
        />
        <img
          src={getOptimizedUrl(src, 800, "jpg")}
          alt={alt}
          className={className}
          loading={loading}
          decoding="async"
        />
      </picture>
    );
  }

  // For non-Unsplash images, use regular img with lazy loading
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
};

export default OptimizedImage;
