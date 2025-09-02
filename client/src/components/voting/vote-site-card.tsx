import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { VotingSite } from '@shared/schema';

interface VoteSiteCardProps {
  site: VotingSite;
}

export default function VoteSiteCard({ site }: VoteSiteCardProps) {
  const handleVoteClick = () => {
    window.open(site.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="card-hover" 
      data-testid={`vote-site-${site.id}`}
    >
      <CardContent className="p-6 text-center">
        <h3 className="font-bold text-lg text-foreground mb-3" data-testid="site-name">
          {site.name}
        </h3>
        {site.description && (
          <p className="text-muted-foreground text-sm mb-4" data-testid="site-description">
            {site.description}
          </p>
        )}
        <div className="mb-4">
          <span className="text-primary font-semibold" data-testid="site-reward">
            {site.reward}
          </span>
        </div>
        <Button 
          onClick={handleVoteClick}
          className="w-full btn-gaming"
          data-testid="vote-button"
        >
          Vote Now
          <ExternalLink size={16} className="ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
