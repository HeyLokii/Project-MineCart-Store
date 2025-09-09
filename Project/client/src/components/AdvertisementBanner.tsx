import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Advertisement } from '@/types';

interface AdvertisementBannerProps {
  position: 'header' | 'sidebar' | 'footer' | 'between-products';
  className?: string;
}

export default function AdvertisementBanner({ position, className = '' }: AdvertisementBannerProps) {
  const [closedAds, setClosedAds] = useState<number[]>([]);

  const { data: advertisements = [] } = useQuery({
    queryKey: ['/api/advertisements', { position }],
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data: Advertisement[]) => data.filter(ad => 
      ad.isActive && 
      !closedAds.includes(ad.id) &&
      (!ad.startDate || new Date(ad.startDate) <= new Date()) &&
      (!ad.endDate || new Date(ad.endDate) >= new Date())
    ).sort((a, b) => (b.priority || 0) - (a.priority || 0))
  });

  const handleClose = (adId: number) => {
    setClosedAds(prev => [...prev, adId]);
  };

  const handleAdClick = (ad: Advertisement) => {
    // Track click if needed
    window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
  };

  if (advertisements.length === 0) {
    return null;
  }

  // Show only the highest priority ad
  const ad = advertisements[0];

  const renderHeaderAd = () => (
    <div className={`bg-gradient-to-r from-primary to-secondary text-white ${className}`}>
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src={ad.imageUrl} 
            alt={ad.title}
            className="w-8 h-8 rounded object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="flex items-center space-x-2">
            <span className="font-medium">{ad.title}</span>
            {ad.description && (
              <span className="text-sm opacity-90 hidden sm:inline">
                {ad.description}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAdClick(ad)}
            className="text-white hover:bg-white/20 text-sm"
          >
            Ver Oferta
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleClose(ad.id)}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSidebarAd = () => (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div 
          className="cursor-pointer group"
          onClick={() => handleAdClick(ad)}
        >
          <div className="relative">
            <img 
              src={ad.imageUrl} 
              alt={ad.title}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClose(ad.id);
              }}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-1">{ad.title}</h3>
            {ad.description && (
              <p className="text-xs text-muted-foreground mb-3">{ad.description}</p>
            )}
            <Button size="sm" className="w-full">
              Saiba Mais
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBetweenProductsAd = () => (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div 
          className="cursor-pointer group flex items-center"
          onClick={() => handleAdClick(ad)}
        >
          <img 
            src={ad.imageUrl} 
            alt={ad.title}
            className="w-24 h-24 object-cover flex-shrink-0"
          />
          <div className="p-4 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold mb-1">{ad.title}</h3>
                {ad.description && (
                  <p className="text-sm text-muted-foreground mb-2">{ad.description}</p>
                )}
                <Button size="sm" variant="outline">
                  Ver Oferta
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose(ad.id);
                }}
                className="p-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFooterAd = () => (
    <div className={`bg-muted/30 border-t ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={ad.imageUrl} 
              alt={ad.title}
              className="w-12 h-12 rounded object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <h3 className="font-semibold">{ad.title}</h3>
              {ad.description && (
                <p className="text-sm text-muted-foreground">{ad.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => handleAdClick(ad)}
              className="bg-primary hover:bg-primary/90"
            >
              Conferir
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClose(ad.id)}
              className="p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (position) {
    case 'header':
      return renderHeaderAd();
    case 'sidebar':
      return renderSidebarAd();
    case 'between-products':
      return renderBetweenProductsAd();
    case 'footer':
      return renderFooterAd();
    default:
      return null;
  }
}