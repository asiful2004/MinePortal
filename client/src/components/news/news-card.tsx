import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { NewsArticle } from '@shared/schema';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const { t } = useTranslation();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'update':
        return 'bg-primary text-primary-foreground';
      case 'event':
        return 'bg-accent text-accent-foreground';
      case 'community':
        return 'bg-secondary text-secondary-foreground';
      case 'tournament':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Link href={`/news/${article.id}`}>
      <Card 
        className={`card-hover overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] ${featured ? 'md:col-span-2 lg:col-span-3' : ''}`}
        data-testid={`news-card-${article.id}`}
      >
        {article.imageUrl && (
          <div className={`w-full object-cover ${featured ? 'h-64 md:h-80' : 'h-48'}`}>
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              data-testid="news-image"
            />
          </div>
        )}
        <CardContent className={featured ? 'p-8' : 'p-6'}>
          <div className="flex items-center space-x-3 mb-4">
            {featured && (
              <Badge className="bg-primary text-primary-foreground" data-testid="featured-badge">
                {t('news.featured')}
              </Badge>
            )}
            <Badge className={getCategoryColor(article.category)} data-testid="category-badge">
              {t(`news.category.${article.category}`)}
            </Badge>
            <span className="text-muted-foreground text-sm" data-testid="article-date">
              {article.publishedAt && formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
            </span>
          </div>
          
          <h3 
            className={`font-bold mb-3 text-foreground hover:text-primary transition-colors duration-200 ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}
            data-testid="article-title"
          >
            {article.title}
          </h3>
          
          <p 
            className={`text-muted-foreground mb-4 ${featured ? 'text-lg leading-relaxed' : 'text-sm'}`}
            data-testid="article-excerpt"
          >
            {article.excerpt}
          </p>
          
          <div 
            className="text-secondary hover:text-primary transition-colors duration-200 font-semibold text-sm"
            data-testid="read-more-button"
          >
            {t('news.readmore')} →
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
