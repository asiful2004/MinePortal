import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, 
  FileText, 
  Users, 
  Calendar, 
  Image, 
  Store, 
  Vote, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { NewsArticle, Season, TeamMember, VotingSite, GalleryImage, StoreItem } from '@shared/schema';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (!token || !userData) {
      setLocation('/admin/login');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setLocation('/admin/login');
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // News Management
  const { data: newsArticles } = useQuery<NewsArticle[]>({
    queryKey: ['/api/admin/news'],
    meta: {
      headers: getAuthHeaders(),
    },
  });

  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create news');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: t('admin.news.created') });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update news');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: t('admin.news.updated') });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete news');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: t('admin.news.deleted') });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="admin-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('admin.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16" data-testid="admin-dashboard">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-gaming text-3xl font-bold text-primary">
              {t('admin.dashboard.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('admin.dashboard.welcome', { name: user.username })}
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <LogOut className="mr-2" size={16} />
            {t('admin.logout')}
          </Button>
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="news" data-testid="tab-news">
              <FileText className="mr-2" size={16} />
              {t('admin.tabs.news')}
            </TabsTrigger>
            <TabsTrigger value="seasons" data-testid="tab-seasons">
              <Calendar className="mr-2" size={16} />
              {t('admin.tabs.seasons')}
            </TabsTrigger>
            <TabsTrigger value="team" data-testid="tab-team">
              <Users className="mr-2" size={16} />
              {t('admin.tabs.team')}
            </TabsTrigger>
            <TabsTrigger value="voting" data-testid="tab-voting">
              <Vote className="mr-2" size={16} />
              {t('admin.tabs.voting')}
            </TabsTrigger>
            <TabsTrigger value="gallery" data-testid="tab-gallery">
              <Image className="mr-2" size={16} />
              {t('admin.tabs.gallery')}
            </TabsTrigger>
            <TabsTrigger value="store" data-testid="tab-store">
              <Store className="mr-2" size={16} />
              {t('admin.tabs.store')}
            </TabsTrigger>
          </TabsList>

          {/* News Management */}
          <TabsContent value="news" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-gaming text-xl text-primary">{t('admin.news.title')}</h2>
              <NewsCreateForm onSubmit={createNewsMutation.mutate} />
            </div>
            
            <div className="grid gap-4">
              {newsArticles?.map((article) => (
                <NewsEditCard
                  key={article.id}
                  article={article}
                  onUpdate={updateNewsMutation.mutate}
                  onDelete={deleteNewsMutation.mutate}
                />
              ))}
            </div>
          </TabsContent>

          {/* Seasons Management */}
          <TabsContent value="seasons" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-gaming text-xl text-primary">{t('admin.seasons.title')}</h2>
              <Button data-testid="create-season-button">
                <Plus className="mr-2" size={16} />
                {t('admin.seasons.create')}
              </Button>
            </div>
            
            <div className="text-center py-12 text-muted-foreground">
              {t('admin.coming_soon')}
            </div>
          </TabsContent>

          {/* Team Management */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-gaming text-xl text-primary">{t('admin.team.title')}</h2>
              <Button data-testid="create-team-member-button">
                <Plus className="mr-2" size={16} />
                {t('admin.team.create')}
              </Button>
            </div>
            
            <div className="text-center py-12 text-muted-foreground">
              {t('admin.coming_soon')}
            </div>
          </TabsContent>

          {/* Voting Management */}
          <TabsContent value="voting" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-gaming text-xl text-primary">{t('admin.voting.title')}</h2>
              <Button data-testid="create-voting-site-button">
                <Plus className="mr-2" size={16} />
                {t('admin.voting.create')}
              </Button>
            </div>
            
            <div className="text-center py-12 text-muted-foreground">
              {t('admin.coming_soon')}
            </div>
          </TabsContent>

          {/* Gallery Management */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-gaming text-xl text-primary">{t('admin.gallery.title')}</h2>
              <Button data-testid="create-gallery-image-button">
                <Plus className="mr-2" size={16} />
                {t('admin.gallery.create')}
              </Button>
            </div>
            
            <div className="text-center py-12 text-muted-foreground">
              {t('admin.coming_soon')}
            </div>
          </TabsContent>

          {/* Store Management */}
          <TabsContent value="store" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-gaming text-xl text-primary">{t('admin.store.title')}</h2>
              <Button data-testid="create-store-item-button">
                <Plus className="mr-2" size={16} />
                {t('admin.store.create')}
              </Button>
            </div>
            
            <div className="text-center py-12 text-muted-foreground">
              {t('admin.coming_soon')}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// News Create Form Component
function NewsCreateForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'update',
    imageUrl: '',
    isPublished: false,
    isFeatured: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      publishedAt: formData.isPublished ? new Date().toISOString() : null,
    });
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'update',
      imageUrl: '',
      isPublished: false,
      isFeatured: false,
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} data-testid="create-news-button">
        <Plus className="mr-2" size={16} />
        {t('admin.news.create')}
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t('admin.news.create')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{t('admin.news.form.title')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              data-testid="news-title-input"
            />
          </div>
          
          <div>
            <Label htmlFor="excerpt">{t('admin.news.form.excerpt')}</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              required
              data-testid="news-excerpt-input"
            />
          </div>
          
          <div>
            <Label htmlFor="content">{t('admin.news.form.content')}</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={6}
              data-testid="news-content-input"
            />
          </div>
          
          <div>
            <Label htmlFor="category">{t('admin.news.form.category')}</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger data-testid="news-category-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="tournament">Tournament</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="imageUrl">{t('admin.news.form.image_url')}</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              data-testid="news-image-input"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                data-testid="news-published-switch"
              />
              <Label htmlFor="isPublished">{t('admin.news.form.published')}</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                data-testid="news-featured-switch"
              />
              <Label htmlFor="isFeatured">{t('admin.news.form.featured')}</Label>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" className="btn-gaming" data-testid="save-news-button">
              <Save className="mr-2" size={16} />
              {t('admin.save')}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {t('admin.cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// News Edit Card Component
function NewsEditCard({ 
  article, 
  onUpdate, 
  onDelete 
}: { 
  article: NewsArticle; 
  onUpdate: (data: any) => void; 
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    // Edit form would go here - simplified for brevity
    return (
      <Card data-testid={`news-edit-${article.id}`}>
        <CardContent className="p-4">
          <div className="text-center py-8 text-muted-foreground">
            {t('admin.edit_form_placeholder')}
          </div>
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => setIsEditing(false)}>
              {t('admin.cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid={`news-card-${article.id}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-bold text-lg">{article.title}</h3>
              <Badge variant={article.isPublished ? 'default' : 'secondary'}>
                {article.isPublished ? t('admin.published') : t('admin.draft')}
              </Badge>
              {article.isFeatured && (
                <Badge className="bg-primary text-primary-foreground">
                  {t('admin.featured')}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-2">{article.excerpt}</p>
            <p className="text-xs text-muted-foreground">
              {t('admin.category')}: {article.category} | {t('admin.created')}: {
                article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'N/A'
              }
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              data-testid={`edit-news-${article.id}`}
            >
              <Edit size={16} />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(article.id)}
              data-testid={`delete-news-${article.id}`}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
