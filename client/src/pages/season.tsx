import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SeasonCard from '@/components/season/season-card';
import type { Season } from '@shared/schema';

export default function Season() {
  const { t } = useTranslation();
  
  const { data: currentSeason } = useQuery<Season>({
    queryKey: ['/api/seasons/current'],
  });

  const { data: allSeasons, isLoading } = useQuery<Season[]>({
    queryKey: ['/api/seasons'],
  });

  return (
    <div className="min-h-screen py-16" data-testid="season-page">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-gaming text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('season.title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('season.subtitle')}
          </p>
        </div>
        
        {/* Current Season Highlight */}
        {currentSeason && (
          <div className="max-w-6xl mx-auto mb-16">
            <Card className="glass-card border-2 border-primary/50">
              <CardContent className="p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {t('season.current.label')}
                      </span>
                      <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {t('season.active')}
                      </span>
                    </div>
                    <h2 className="font-gaming text-3xl md:text-4xl font-bold text-primary mb-6">
                      {currentSeason.name}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                      {currentSeason.description}
                    </p>
                    
                    {currentSeason.features && Array.isArray(currentSeason.features) && (
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        {(currentSeason.features as string[]).slice(0, 4).map((feature, index) => (
                          <div key={index} className="text-center">
                            <div className="text-2xl font-bold text-secondary">{index + 1}</div>
                            <p className="text-muted-foreground text-sm">{String(feature)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="btn-gaming" data-testid="start-playing">
                        <Play className="mr-2" size={20} />
                        {t('season.start_playing')}
                      </Button>
                      <Button variant="outline" className="border-2 border-secondary text-secondary">
                        {t('season.guide')}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    {currentSeason.imageUrl && (
                      <img
                        src={currentSeason.imageUrl}
                        alt={currentSeason.name}
                        className="w-full rounded-xl shadow-2xl"
                        data-testid="current-season-image"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Season History */}
        <div className="max-w-6xl mx-auto">
          <h2 className="font-gaming text-2xl md:text-3xl font-bold text-center text-primary mb-12">
            {t('season.history')}
          </h2>
          
          {isLoading ? (
            <div className="space-y-8" data-testid="seasons-loading">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="glass-card rounded-xl p-6 md:p-8">
                  <div className="grid md:grid-cols-4 gap-6 items-center">
                    <div className="text-center md:text-left">
                      <div className="w-12 h-8 bg-muted rounded mb-2 animate-pulse" />
                      <div className="w-16 h-6 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="md:col-span-2">
                      <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                      <div className="h-4 bg-muted rounded mb-3 animate-pulse" />
                      <div className="flex gap-2">
                        <div className="w-16 h-6 bg-muted rounded animate-pulse" />
                        <div className="w-20 h-6 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-muted rounded mb-1 animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : allSeasons && allSeasons.length > 0 ? (
            <div className="space-y-8">
              {allSeasons.map((season) => (
                <SeasonCard 
                  key={season.id} 
                  season={season} 
                  current={season.id === currentSeason?.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="seasons-empty">
              <p className="text-muted-foreground">{t('season.empty')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
