import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Star, Crown, Gem, Zap, Key, Palette, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import type { StoreItem } from '@shared/schema';

export default function Store() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { data: storeItems, isLoading } = useQuery<StoreItem[]>({
    queryKey: ['/api/store/items'],
  });

  const rankItems = storeItems?.filter(item => item.category === 'ranks') || [];
  const itemItems = storeItems?.filter(item => item.category === 'items') || [];
  const keyItems = storeItems?.filter(item => item.category === 'keys') || [];
  const cosmeticItems = storeItems?.filter(item => item.category === 'cosmetics') || [];
  
  const getAllItems = () => {
    if (!storeItems) return [];
    if (activeCategory === 'all') return storeItems;
    return storeItems.filter(item => item.category === activeCategory);
  };

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ranks': return Crown;
      case 'items': return Gem;
      case 'keys': return Key;
      case 'cosmetics': return Palette;
      default: return Zap;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ranks': return 'from-primary to-accent';
      case 'items': return 'from-secondary to-primary';
      case 'keys': return 'from-accent to-secondary';
      case 'cosmetics': return 'from-purple-500 to-pink-500';
      default: return 'from-primary to-secondary';
    }
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

        {/* Category Filter Tabs */}
        <div className="max-w-4xl mx-auto mb-12">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 glass-card">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                All Items
              </TabsTrigger>
              <TabsTrigger value="ranks" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Ranks
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center gap-2">
                <Gem className="w-4 h-4" />
                Items
              </TabsTrigger>
              <TabsTrigger value="keys" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Keys
              </TabsTrigger>
              <TabsTrigger value="cosmetics" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Cosmetics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Store Items Grid */}
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="store-loading">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="glass-card rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-muted rounded-xl mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                    <div className="h-8 bg-muted rounded mb-1 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/3 mx-auto animate-pulse" />
                  </div>
                  <div className="h-12 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : getAllItems().length > 0 ? (
            <div>
              {/* Ranks Section */}
              {(activeCategory === 'all' || activeCategory === 'ranks') && rankItems.length > 0 && (
                <div className="mb-16">
                  <h2 className="font-gaming text-2xl md:text-3xl font-bold text-center text-primary mb-8">
                    VIP Ranks
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {rankItems.map((rank) => {
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
                </div>
              )}

              {/* Items Section */}
              {(activeCategory === 'all' || activeCategory === 'items') && itemItems.length > 0 && (
                <div className="mb-16">
                  <h2 className="font-gaming text-2xl md:text-3xl font-bold text-center text-primary mb-8">
                    Items
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {itemItems.map((item) => {
                      const Icon = getCategoryIcon(item.category);
                      return (
                        <Card 
                          key={item.id} 
                          className="card-hover text-center"
                          data-testid={`item-card-${item.id}`}
                        >
                          <CardContent className="p-4">
                            <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(item.category)} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                              <Icon className="w-8 h-8 text-white" />
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
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Keys Section */}
              {(activeCategory === 'all' || activeCategory === 'keys') && keyItems.length > 0 && (
                <div className="mb-16">
                  <h2 className="font-gaming text-2xl md:text-3xl font-bold text-center text-primary mb-8">
                    Keys
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {keyItems.map((item) => {
                      const Icon = getCategoryIcon(item.category);
                      return (
                        <Card 
                          key={item.id} 
                          className="card-hover text-center"
                          data-testid={`key-card-${item.id}`}
                        >
                          <CardContent className="p-4">
                            <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(item.category)} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            
                            <h3 className="font-semibold text-foreground mb-2" data-testid="key-name">
                              {item.name}
                            </h3>
                            
                            {item.description && (
                              <p className="text-muted-foreground text-sm mb-3" data-testid="key-description">
                                {item.description}
                              </p>
                            )}
                            
                            <p className="text-primary font-bold text-lg mb-3" data-testid="key-price">
                              {item.price}
                            </p>
                            
                            <Button 
                              className="w-full btn-gaming text-sm"
                              data-testid={`purchase-key-${item.id}`}
                            >
                              {t('store.buy_now')}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cosmetics Section */}
              {(activeCategory === 'all' || activeCategory === 'cosmetics') && cosmeticItems.length > 0 && (
                <div className="mb-16">
                  <h2 className="font-gaming text-2xl md:text-3xl font-bold text-center text-primary mb-8">
                    Cosmetics
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cosmeticItems.map((item) => {
                      const Icon = getCategoryIcon(item.category);
                      return (
                        <Card 
                          key={item.id} 
                          className="card-hover text-center"
                          data-testid={`cosmetic-card-${item.id}`}
                        >
                          <CardContent className="p-4">
                            <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(item.category)} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            
                            <h3 className="font-semibold text-foreground mb-2" data-testid="cosmetic-name">
                              {item.name}
                            </h3>
                            
                            {item.description && (
                              <p className="text-muted-foreground text-sm mb-3" data-testid="cosmetic-description">
                                {item.description}
                              </p>
                            )}
                            
                            <p className="text-primary font-bold text-lg mb-3" data-testid="cosmetic-price">
                              {item.price}
                            </p>
                            
                            <Button 
                              className="w-full btn-gaming text-sm"
                              data-testid={`purchase-cosmetic-${item.id}`}
                            >
                              {t('store.buy_now')}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="store-empty">
              <p className="text-muted-foreground">No items available in this category.</p>
            </div>
          )}
        </div>

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
