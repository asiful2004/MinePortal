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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Advanced Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Main floating orbs */}
          <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-secondary/20 to-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-accent/15 to-secondary/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          
          {/* Rotating background */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/8 via-transparent to-secondary/8 rounded-full blur-3xl animate-spin-slow"></div>
          
          {/* Particle effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full animate-ping delay-200"></div>
            <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-secondary/60 rounded-full animate-ping delay-700"></div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-accent/40 rounded-full animate-ping delay-1200"></div>
            <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-primary/50 rounded-full animate-ping delay-300"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Server Logo */}
            <div className="mb-16 flex justify-center">
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute -inset-8 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                {/* Middle glow ring */}
                <div className="absolute -inset-6 bg-gradient-to-r from-secondary via-primary to-accent rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse delay-300"></div>
                {/* Main logo container */}
                <div className="relative w-48 h-48 bg-gradient-to-br from-primary via-accent/80 to-secondary rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-primary/30">
                  <span className="text-white font-gaming text-6xl font-bold drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-500">SL</span>
                  {/* Inner shine effect */}
                  <div className="absolute inset-2 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                {/* Floating particles around logo */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full animate-ping opacity-60"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-secondary rounded-full animate-ping delay-500 opacity-60"></div>
                <div className="absolute top-1/2 -right-4 w-2 h-2 bg-accent rounded-full animate-ping delay-1000 opacity-60"></div>
              </div>
            </div>
            
            <h1 className="font-gaming text-6xl md:text-9xl font-bold mb-10 bg-gradient-to-r from-primary via-purple-400 via-accent to-secondary bg-clip-text text-transparent leading-tight animate-gradient bg-300% hover:scale-105 transition-all duration-700">
              {t('server.name')}
            </h1>
            
            <p className="text-xl md:text-4xl text-muted-foreground/90 mb-16 max-w-5xl mx-auto leading-relaxed font-light hover:text-muted-foreground transition-colors duration-500">
              {t('server.description')}
            </p>
            
            {/* Enhanced Server Info Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
              {/* Server IP */}
              <Card className="glass-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="font-gaming text-lg font-bold text-primary mb-4">{t('server.ip.label')}</h3>
                  <div className="bg-muted/30 rounded-xl p-4 border border-primary/20">
                    <IpCopy />
                  </div>
                </CardContent>
              </Card>
              
              {/* Player Count */}
              <Card className="glass-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/60 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-gaming text-lg font-bold text-primary mb-4">{t('server.players.label')}</h3>
                  <div className="text-4xl font-bold text-secondary mb-2" data-testid="player-count">
                    {serverConfig?.playerCount || 0}
                  </div>
                  <p className="text-muted-foreground">
                    / {serverConfig?.maxPlayers || 2000} max
                  </p>
                </CardContent>
              </Card>
              
              {/* Server Status */}
              <Card className="glass-card group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/60 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="font-gaming text-lg font-bold text-primary mb-4">{t('server.status.label')}</h3>
                  <ServerStatus />
                  <p className="text-sm text-muted-foreground mt-3">Uptime: 99.9%</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="btn-gaming px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-primary/50 transform hover:scale-110 transition-all duration-300"
                data-testid="join-server-button"
              >
                <Play className="mr-3" size={24} />
                {t('cta.join')}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:animate-ping"></div>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-12 py-6 text-xl font-bold border-3 border-secondary/50 text-secondary hover:bg-secondary hover:text-white hover:border-secondary hover:shadow-2xl hover:shadow-secondary/50 transform hover:scale-110 transition-all duration-300"
                data-testid="join-discord-button"
              >
                <MessageCircle className="mr-3" size={24} />
                {t('cta.discord')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
