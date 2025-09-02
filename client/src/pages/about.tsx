import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import TeamCard from '@/components/team/team-card';
import { useServerStatus } from '@/hooks/use-server-status';
import type { TeamMember } from '@shared/schema';

export default function About() {
  const { t } = useTranslation();
  const { data: serverConfig } = useServerStatus();
  
  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
  });

  const groupMembersByRole = (members: TeamMember[]) => {
    const groups: Record<string, TeamMember[]> = {};
    members.forEach(member => {
      if (!groups[member.role]) {
        groups[member.role] = [];
      }
      groups[member.role].push(member);
    });
    return groups;
  };

  const roleOrder = ['founder', 'admin', 'developer', 'moderator', 'builder', 'supporter'];

  return (
    <div className="min-h-screen py-16" data-testid="about-page">
      <div className="container mx-auto px-4">
        {/* Server Information Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-white font-gaming text-4xl font-bold">SL</span>
            </div>
            <h1 className="font-gaming text-4xl md:text-5xl font-bold text-primary mb-4">
              {serverConfig?.name || t('server.name')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('about.tagline')}
            </p>
          </div>
          
          <Card className="glass-card">
            <CardContent className="p-8">
              <h2 className="font-gaming text-2xl font-bold text-foreground mb-6">
                {t('about.story.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('about.story.part1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.story.part2')}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Team Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="font-gaming text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {t('team.title')}
          </h2>
          
          {isLoading ? (
            <div className="space-y-16" data-testid="team-loading">
              {Array.from({ length: 3 }).map((_, groupIndex) => (
                <div key={groupIndex}>
                  <div className="h-8 bg-muted rounded w-48 mx-auto mb-8 animate-pulse" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="glass-card rounded-xl p-6">
                        <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
                        <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-3 animate-pulse" />
                        <div className="h-3 bg-muted rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="space-y-16">
              {Object.entries(groupMembersByRole(teamMembers))
                .sort(([a], [b]) => {
                  const aIndex = roleOrder.indexOf(a);
                  const bIndex = roleOrder.indexOf(b);
                  if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
                  if (aIndex === -1) return 1;
                  if (bIndex === -1) return -1;
                  return aIndex - bIndex;
                })
                .map(([role, members]) => (
                  <div key={role}>
                    <h3 className="font-gaming text-xl font-bold text-secondary mb-8 text-center">
                      {t(`team.roles.${role}`, role.charAt(0).toUpperCase() + role.slice(1))}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {members.map((member) => (
                        <TeamCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="team-empty">
              <p className="text-muted-foreground">{t('team.empty')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
