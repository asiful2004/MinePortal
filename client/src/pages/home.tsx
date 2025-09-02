import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Play, MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ServerStatus from '@/components/server/server-status';
import IpCopy from '@/components/server/ip-copy';
import NewsCard from '@/components/news/news-card';
import GalleryGrid from '@/components/gallery/gallery-grid';
import TeamCard from '@/components/team/team-card';
import { useServerStatus } from '@/hooks/use-server-status';
import type { NewsArticle, Season, TeamMember } from '@shared/schema';

export default function Home() {
  const { t } = useTranslation();
  const { data: serverConfig } = useServerStatus();
  
  const { data: recentNews } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news', { limit: 3 }],
  });

  const { data: currentSeason } = useQuery<Season>({
    queryKey: ['/api/seasons/current'],
  });

  const { data: teamMembers } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
  });

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Server Logo */}
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center animate-float shadow-2xl">
                <span className="text-white font-gaming text-4xl font-bold">SL</span>
              </div>
            </div>
            
            <h1 className="font-gaming text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent neon-text">
              {t('server.name')}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t('server.description')}
            </p>
            
            {/* Server Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              {/* Server IP */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary mb-3">{t('server.ip.label')}</h3>
                  <IpCopy />
                </CardContent>
              </Card>
              
              {/* Player Count */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary mb-3">{t('server.players.label')}</h3>
                  <div className="text-3xl font-bold text-secondary" data-testid="player-count">
                    {serverConfig?.playerCount || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    / {serverConfig?.maxPlayers || 2000} max
                  </p>
                </CardContent>
              </Card>
              
              {/* Server Status */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary mb-3">{t('server.status.label')}</h3>
                  <ServerStatus />
                  <p className="text-sm text-muted-foreground mt-1">Uptime: 99.9%</p>
                </CardContent>
              </Card>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-gaming px-8 py-4 text-lg"
                data-testid="join-server-button"
              >
                <Play className="mr-2" size={20} />
                {t('cta.join')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                data-testid="join-discord-button"
              >
                <MessageCircle className="mr-2" size={20} />
                {t('cta.discord')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent News Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-gaming text-3xl md:text-4xl font-bold text-primary mb-4">
              {t('news.title')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('news.subtitle')}
            </p>
          </div>
          
          {recentNews && recentNews.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
              {recentNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="news-empty">
              <p className="text-muted-foreground">{t('news.empty')}</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/news">
              <Button variant="outline" data-testid="view-all-news">
                {t('news.viewall')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Current Season Section */}
      {currentSeason && (
        <section className="py-16 bg-gradient-to-r from-muted/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-gaming text-3xl md:text-4xl font-bold text-primary mb-6">
                    {currentSeason.name}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {currentSeason.description}
                  </p>
                  
                  {currentSeason.features && Array.isArray(currentSeason.features) && (
                    <div className="space-y-4 mb-8">
                      {(currentSeason.features as string[]).slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span>{String(feature)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Link href="/season">
                    <Button className="btn-gaming" data-testid="explore-season">
                      {t('season.explore')}
                    </Button>
                  </Link>
                </div>
                
                <div>
                  {currentSeason.videoUrl ? (
                    <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-video">
                      <iframe
                        src={currentSeason.videoUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        data-testid="season-video"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden shadow-2xl">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play className="w-8 h-8 text-primary-foreground" />
                          </div>
                          <p className="text-foreground font-semibold">{t('season.video.placeholder')}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-gaming text-3xl md:text-4xl font-bold text-primary mb-4">
              {t('gallery.title')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('gallery.subtitle')}
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <GalleryGrid />
          </div>
        </div>
      </section>

      {/* Team Preview Section */}
      {teamMembers && teamMembers.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-muted/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="font-gaming text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('team.title')}
              </h2>
              <p className="text-muted-foreground text-lg mb-12">
                {t('team.subtitle')}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                {teamMembers.slice(0, 4).map((member) => (
                  <TeamCard key={member.id} member={member} size="small" />
                ))}
              </div>
              
              <Link href="/about">
                <Button className="btn-gaming" data-testid="meet-full-team">
                  <Users className="mr-2" size={20} />
                  {t('team.meetfull')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
