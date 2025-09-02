import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import NewsCard from '@/components/news/news-card';
import type { NewsArticle } from '@shared/schema';

export default function News() {
  const { t } = useTranslation();
  
  const { data: featuredNews } = useQuery<NewsArticle>({
    queryKey: ['/api/news/featured'],
  });

  const { data: allNews, isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
  });

  return (
    <div className="min-h-screen py-16" data-testid="news-page">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-gaming text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('news.title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('news.page_subtitle')}
          </p>
        </div>
        
        {/* Featured Article */}
        {featuredNews && (
          <div className="max-w-4xl mx-auto mb-16">
            <NewsCard article={featuredNews} featured />
          </div>
        )}
        
        {/* News Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" data-testid="news-loading">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glass-card rounded-xl p-6">
                <div className="w-full h-48 bg-muted rounded-lg mb-4 animate-pulse" />
                <div className="h-4 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/4 mb-4 animate-pulse" />
                <div className="h-3 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : allNews && allNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {allNews
              .filter(article => !article.isFeatured) // Exclude featured article from grid
              .map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="news-empty">
            <p className="text-muted-foreground">{t('news.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
