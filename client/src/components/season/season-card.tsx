import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import type { Season } from '@shared/schema';

interface SeasonCardProps {
  season: Season;
  current?: boolean;
}

export default function SeasonCard({ season, current = false }: SeasonCardProps) {
  const getStatusBadge = () => {
    if (current) {
      return <Badge className="bg-secondary text-secondary-foreground">Current</Badge>;
    }
    
    const now = new Date();
    const endDate = season.endDate ? new Date(season.endDate) : null;
    
    if (!endDate || now > endDate) {
      return <Badge variant="outline" className="text-muted-foreground">Ended</Badge>;
    }
    
    return <Badge className="bg-primary text-primary-foreground">Active</Badge>;
  };

  return (
    <Card 
      className={`card-hover ${current ? 'border-2 border-primary/50' : ''}`}
      data-testid={`season-card-${season.id}`}
    >
      {season.imageUrl && (
        <div className="w-full h-48 overflow-hidden rounded-t-xl">
          <img
            src={season.imageUrl}
            alt={season.name}
            className="w-full h-full object-cover"
            data-testid="season-image"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl font-bold text-muted-foreground" data-testid="season-version">
            {season.version}
          </div>
          {getStatusBadge()}
        </div>
        
        <h3 className="font-gaming text-xl font-bold text-foreground mb-2" data-testid="season-name">
          {season.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3" data-testid="season-description">
          {season.description}
        </p>
        
        {season.features && Array.isArray(season.features) && season.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4" data-testid="season-features">
            {(season.features as string[]).map((feature, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs"
                data-testid={`feature-${index}`}
              >
                {String(feature)}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground" data-testid="season-duration">
            {formatDistanceToNow(new Date(season.startDate), { addSuffix: false })}
          </div>
          <p className="text-muted-foreground text-xs" data-testid="season-dates">
            {new Date(season.startDate).toLocaleDateString()} - {
              season.endDate 
                ? new Date(season.endDate).toLocaleDateString()
                : 'Ongoing'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
