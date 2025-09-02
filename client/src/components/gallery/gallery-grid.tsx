import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { GalleryImage } from '@shared/schema';

export default function GalleryGrid() {
  const { t } = useTranslation();
  const { data: images, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="gallery-loading">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-square bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!images?.length) {
    return (
      <div className="text-center py-12" data-testid="gallery-empty">
        <p className="text-muted-foreground">{t('gallery.empty')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="gallery-grid">
      {images.map((image) => (
        <div 
          key={image.id} 
          className="gallery-item cursor-pointer"
          data-testid={`gallery-item-${image.id}`}
        >
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full aspect-square object-cover"
            data-testid="gallery-image"
          />
          <div className="gallery-overlay">
            <div>
              <h3 className="text-white font-bold" data-testid="image-title">
                {image.title}
              </h3>
              {image.author && (
                <p className="text-white/80 text-sm" data-testid="image-author">
                  by {image.author}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
