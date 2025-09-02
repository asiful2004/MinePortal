import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Gem, Star, Gift, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import VoteSiteCard from '@/components/voting/vote-site-card';
import type { VotingSite } from '@shared/schema';

export default function Vote() {
  const { t } = useTranslation();
  
  const { data: votingSites, isLoading } = useQuery<VotingSite[]>({
    queryKey: ['/api/voting-sites'],
  });

  const benefits = [
    {
      icon: Gem,
      title: t('vote.benefits.diamonds'),
      description: t('vote.benefits.diamonds.desc'),
      color: 'text-primary'
    },
    {
      icon: Star,
      title: t('vote.benefits.exp'),
      description: t('vote.benefits.exp.desc'),
      color: 'text-secondary'
    },
    {
      icon: Gift,
      title: t('vote.benefits.crate'),
      description: t('vote.benefits.crate.desc'),
      color: 'text-accent'
    }
  ];

  return (
    <div className="min-h-screen py-16" data-testid="vote-page">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-gaming text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('vote.title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('vote.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Benefits Section */}
          <div>
            <h2 className="font-gaming text-2xl font-bold mb-6">{t('vote.benefits.title')}</h2>
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${benefit.color === 'text-primary' ? 'bg-primary/20' : benefit.color === 'text-secondary' ? 'bg-secondary/20' : 'bg-accent/20'}`}>
                    <benefit.icon size={16} className={benefit.color} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{benefit.title}</h4>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vote Tutorial Video */}
            <div>
              <h3 className="font-medium mb-4">{t('vote.tutorial.title')}</h3>
              <Card className="glass-card">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Play className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <p className="font-medium">{t('vote.tutorial.watch')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Voting Sites */}
          <div>
            <h2 className="font-gaming text-2xl font-bold mb-6">{t('vote.sites.title')}</h2>
            {isLoading ? (
              <div className="space-y-4" data-testid="voting-sites-loading">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="glass-card rounded-xl p-6">
                    <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-3/4 mb-4 animate-pulse" />
                    <div className="h-10 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : votingSites && votingSites.length > 0 ? (
              <div className="space-y-4">
                {votingSites.map((site) => (
                  <VoteSiteCard key={site.id} site={site} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12" data-testid="voting-sites-empty">
                <p className="text-muted-foreground">{t('vote.sites.empty')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
