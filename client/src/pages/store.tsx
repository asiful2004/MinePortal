import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Star, Crown, Gem, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StoreItem } from '@shared/schema';

export default function Store() {
  const { t } = useTranslation();
  
  const { data: storeItems, isLoading } = useQuery<StoreItem[]>({
    queryKey: ['/api/store/items'],
  });

  const rankItems = storeItems?.filter(item => item.category === 'rank') || [];
  const otherItems = storeItems?.filter(item => item.category !== 'rank') || [];

  const getRankIcon = (name: string) => {
    if (name.toLowerCase().includes('vip')) return Star;
    if (name.toLowerCase().includes('mvp')) return Crown;
    if (name.toLowerCase().includes('legend')) return Gem;
    return Zap;
  };

  const getRankColor = (name: string) => {
    if (name.toLowerCase().includes('vip')) return 'from-secondary to-accent';
    if (name.toLowerCase().includes('mvp')) return 'from-primary to-accent';
    if (name.toLowerCase().includes('legend')) return 'from-accent to-primary';
    return 'from-primary to-secondary';
  };

  return (
    <div className="min-h-screen py-16" data-testid="store-page">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-gaming text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('store.title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('store.subtitle')}
          </p>
        </div>

        {/* VIP Ranks Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="font-gaming text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            {t('store.ranks.title')}
          </h2>
          
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8" data-testid="ranks-loading">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="glass-card rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-muted rounded-xl mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                    <div className="h-8 bg-muted rounded mb-1 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/3 mx-auto animate-pulse" />
                  </div>
                  <div className="space-y-3 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="h-12 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : rankItems.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {rankItems.map((rank, index) => {
                const Icon = getRankIcon(rank.name);
                const isPopular = rank.isPopular;
                
                return (
                  <Card 
                    key={rank.id} 
                    className={`card-hover overflow-hidden ${isPopular ? 'border-2 border-primary/50' : ''}`}
                    data-testid={`rank-card-${rank.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        {isPopular && (
                          <div className="flex justify-center mb-4">
                            <Badge className="bg-primary text-primary-foreground" data-testid="popular-badge">
                              {t('store.popular')}
                            </Badge>
                          </div>
                        )}
                        <div className={`w-16 h-16 bg-gradient-to-br ${getRankColor(rank.name)} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-gaming text-xl font-bold mb-2" data-testid="rank-name">
                          {rank.name}
                        </h3>
                        <p className="text-3xl font-bold text-foreground" data-testid="rank-price">
                          {rank.price}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {t('store.onetime')}
                        </p>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        {rank.features && Array.isArray(rank.features) && (rank.features as string[]).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 bg-secondary-foreground rounded-full" />
                            </div>
                            <span className="text-sm" data-testid={`feature-${index}`}>{String(feature)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full btn-gaming`}
                        data-testid={`purchase-rank-${rank.id}`}
                      >
                        {t('store.purchase')} {rank.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="ranks-empty">
              <p className="text-muted-foreground">{t('store.ranks.empty')}</p>
            </div>
          )}
        </div>

        {/* Items & Cosmetics Section */}
        {otherItems.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="font-gaming text-2xl md:text-3xl font-bold text-center text-primary mb-8">
              {t('store.items.title')}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="card-hover text-center"
                  data-testid={`item-card-${item.id}`}
                >
                  <CardContent className="p-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
                      {item.category === 'cosmetic' && <Star className="w-8 h-8 text-white" />}
                      {item.category === 'item' && <Gem className="w-8 h-8 text-white" />}
                      {item.category !== 'cosmetic' && item.category !== 'item' && <Zap className="w-8 h-8 text-white" />}
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2" data-testid="item-name">
                      {item.name}
                    </h3>
                    
                    {item.description && (
                      <p className="text-muted-foreground text-sm mb-3" data-testid="item-description">
                        {item.description}
                      </p>
                    )}
                    
                    <p className="text-primary font-bold text-lg mb-3" data-testid="item-price">
                      {item.price}
                    </p>
                    
                    <Button 
                      className="w-full btn-gaming text-sm"
                      data-testid={`purchase-item-${item.id}`}
                    >
                      {t('store.buy_now')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Notice */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <h3 className="font-gaming text-xl font-bold text-primary mb-4">
                {t('store.notice.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('store.notice.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
