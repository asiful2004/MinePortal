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
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/3 via-background to-secondary/3">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-3xl animate-spin-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Professional Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg border border-primary/20 group-hover:scale-105 transition-all duration-300">
                  <span className="text-white font-gaming text-2xl font-bold">SL</span>
                </div>
              </div>
            </div>
            
            <h1 className="font-gaming text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
              {t('server.name')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('server.description')}
            </p>
            
            {/* Unified Server Info Block */}
            <Card className="glass-card max-w-4xl mx-auto mb-16 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  {/* Server IP Section */}
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="font-gaming font-semibold text-primary">{t('server.ip.label')}</h3>
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <IpCopy />
                    </div>
                  </div>
                  
                  {/* Player Count Section */}
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/60 rounded-xl flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-gaming font-semibold text-primary">{t('server.players.label')}</h3>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-secondary" data-testid="player-count">
                        {serverConfig?.playerCount || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        / {serverConfig?.maxPlayers || 2000} max
                      </p>
                    </div>
                  </div>
                  
                  {/* Server Status Section */}
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/60 rounded-xl flex items-center justify-center mx-auto">
                      <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="font-gaming font-semibold text-primary">{t('server.status.label')}</h3>
                    <div className="space-y-1 flex flex-col items-center">
                      <ServerStatus />
                      <p className="text-sm text-muted-foreground">Uptime: 99.9%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Professional CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-gaming px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300"
                data-testid="join-server-button"
              >
                <Play className="mr-2" size={20} />
                {t('cta.join')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg font-semibold border-2 border-secondary/60 text-secondary hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300"
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
                      {currentSeason.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span>{typeof feature === 'string' ? feature : JSON.stringify(feature)}</span>
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
