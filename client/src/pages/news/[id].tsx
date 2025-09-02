import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { NewsArticle } from '@shared/schema';

export default function NewsDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const articleId = params.id;

  const { data: article, isLoading, error } = useQuery<NewsArticle>({
    queryKey: [`/api/news/${articleId}`],
    enabled: !!articleId
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen py-16" data-testid="news-detail-loading">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded-lg mb-8 w-32"></div>
              <div className="h-12 bg-muted rounded-lg mb-4"></div>
              <div className="h-6 bg-muted rounded-lg mb-8 w-64"></div>
              <div className="h-64 bg-muted rounded-xl mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-16" data-testid="news-detail-error">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The news article you're looking for doesn't exist or has been removed.</p>
            <Link href="/news">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16" data-testid="news-detail-page">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/news">
              <Button variant="outline" data-testid="back-to-news">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('news.back_to_news')}
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <Card className="glass-card mb-8">
            <CardContent className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className={getCategoryColor(article.category)} data-testid="article-category">
                  <Tag className="w-3 h-3 mr-1" />
                  {t(`news.category.${article.category}`)}
                </Badge>
                {article.isFeatured && (
                  <Badge className="bg-primary text-primary-foreground" data-testid="featured-badge">
                    {t('news.featured')}
                  </Badge>
                )}
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span data-testid="article-date">
                    {article.publishedAt && formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <h1 className="font-gaming text-3xl md:text-4xl font-bold text-primary mb-4" data-testid="article-title">
                {article.title}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="article-excerpt">
                {article.excerpt}
              </p>
            </CardContent>
          </Card>

          {/* Article Image */}
          {article.imageUrl && (
            <div className="mb-8">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover"
                  data-testid="article-image"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <Card className="glass-card">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-line"
                data-testid="article-content"
              >
                {article.content}
              </div>
            </CardContent>
          </Card>

          {/* Back Button (bottom) */}
          <div className="mt-8 text-center">
            <Link href="/news">
              <Button variant="outline" data-testid="back-to-news-bottom">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('news.back_to_news')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}