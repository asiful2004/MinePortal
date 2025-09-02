import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { TeamMember } from '@shared/schema';

interface TeamCardProps {
  member: TeamMember;
  size?: 'small' | 'large';
}

export default function TeamCard({ member, size = 'large' }: TeamCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'founder':
        return 'border-primary bg-primary/10 text-primary';
      case 'admin':
        return 'border-destructive bg-destructive/10 text-destructive';
      case 'developer':
        return 'border-accent bg-accent/10 text-accent';
      case 'builder':
        return 'border-secondary bg-secondary/10 text-secondary';
      default:
        return 'border-muted bg-muted/10 text-muted-foreground';
    }
  };

  if (size === 'small') {
    return (
      <Card className="team-card p-4 text-center" data-testid={`team-card-${member.id}`}>
        <CardContent className="p-0">
          {member.avatarUrl && (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-16 h-16 rounded-full mx-auto mb-3 border-2"
              data-testid="member-avatar"
            />
          )}
          <h4 className="font-semibold text-foreground mb-1" data-testid="member-name">
            {member.name}
          </h4>
          <Badge 
            variant="outline" 
            className={getRoleColor(member.role)}
            data-testid="member-role"
          >
            {member.role}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="team-card p-6 text-center" data-testid={`team-card-${member.id}`}>
      <CardContent className="p-0">
        {member.avatarUrl && (
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-3"
            data-testid="member-avatar"
          />
        )}
        <h4 className="font-bold text-lg mb-2" data-testid="member-name">
          {member.name}
        </h4>
        <Badge 
          variant="outline" 
          className={`${getRoleColor(member.role)} mb-3`}
          data-testid="member-role"
        >
          {member.role}
        </Badge>
        {member.description && (
          <p className="text-muted-foreground text-sm leading-relaxed" data-testid="member-description">
            {member.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
