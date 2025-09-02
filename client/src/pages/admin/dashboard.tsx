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
  X,
  Server,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { NewsArticle, Season, TeamMember, VotingSite, GalleryImage, StoreItem, ServerConfig } from '@shared/schema';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

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

  // Data queries with proper auth headers
  const { data: newsArticles = [], isLoading: newsLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/admin/news'],
    queryFn: async () => {
      const res = await fetch('/api/admin/news', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    },
    enabled: !!user
  });

  const { data: seasons = [] } = useQuery<Season[]>({
    queryKey: ['/api/seasons'],
    queryFn: async () => {
      const res = await fetch('/api/seasons');
      if (!res.ok) throw new Error('Failed to fetch seasons');
      return res.json();
    },
    enabled: !!user
  });

  const { data: team = [] } = useQuery<TeamMember[]>({
    queryKey: ['/api/admin/team'],
    queryFn: async () => {
      const res = await fetch('/api/admin/team', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch team');
      return res.json();
    },
    enabled: !!user
  });

  const { data: votingSites = [] } = useQuery<VotingSite[]>({
    queryKey: ['/api/admin/voting-sites'],
    queryFn: async () => {
      const res = await fetch('/api/admin/voting-sites', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch voting sites');
      return res.json();
    },
    enabled: !!user
  });

  const { data: gallery = [] } = useQuery<GalleryImage[]>({
    queryKey: ['/api/admin/gallery'],
    queryFn: async () => {
      const res = await fetch('/api/admin/gallery', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch gallery');
      return res.json();
    },
    enabled: !!user
  });

  const { data: store = [] } = useQuery<StoreItem[]>({
    queryKey: ['/api/admin/store'],
    queryFn: async () => {
      const res = await fetch('/api/admin/store', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch store');
      return res.json();
    },
    enabled: !!user
  });

  const { data: serverConfig } = useQuery<ServerConfig>({
    queryKey: ['/api/admin/server/config'],
    queryFn: async () => {
      const res = await fetch('/api/admin/server/config', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch server config');
      return res.json();
    },
    enabled: !!user
  });

  // Mutations
  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...data,
          publishedAt: data.isPublished ? new Date().toISOString() : null,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create news');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      setShowCreateDialog(false);
      toast({ title: 'Success', description: 'News article created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...data,
          publishedAt: data.isPublished ? new Date().toISOString() : null,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update news');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      setEditingItem(null);
      toast({ title: 'Success', description: 'News article updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
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
      toast({ title: 'Success', description: 'News article deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="admin-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total News</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{newsArticles.length}</div>
          <p className="text-xs text-muted-foreground">
            {newsArticles.filter(n => n.isPublished).length} published
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Seasons</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{seasons.length}</div>
          <p className="text-xs text-muted-foreground">
            {seasons.filter(s => s.isActive).length} active
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{team.length}</div>
          <p className="text-xs text-muted-foreground">
            {team.filter(t => t.isActive).length} active
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
          <Image className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{gallery.length}</div>
          <p className="text-xs text-muted-foreground">
            {gallery.filter(g => g.isVisible).length} visible
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Store Items</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{store.length}</div>
          <p className="text-xs text-muted-foreground">
            {store.filter(s => s.isActive).length} active
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Server Status</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {serverConfig?.isOnline ? 'Online' : 'Offline'}
          </div>
          <p className="text-xs text-muted-foreground">
            {serverConfig?.playerCount || 0} / {serverConfig?.maxPlayers || 0} players
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderNewsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">News Management</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="btn-gaming" data-testid="create-news">
              <Plus className="w-4 h-4 mr-2" />
              Create Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create News Article</DialogTitle>
              <DialogDescription>Add a new news article to your website.</DialogDescription>
            </DialogHeader>
            <NewsCreateForm onSubmit={createNewsMutation.mutate} />
          </DialogContent>
        </Dialog>
      </div>
      
      {newsLoading ? (
        <div className="text-center py-8">Loading news articles...</div>
      ) : (
        <div className="grid gap-4">
          {newsArticles.map((article) => (
            <Card key={article.id} className="glass-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription>{article.excerpt}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={article.isPublished ? 'default' : 'secondary'}>
                        {article.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      {article.isFeatured && <Badge variant="destructive">Featured</Badge>}
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingItem(article)}
                      data-testid={`edit-news-${article.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteNewsMutation.mutate(article.id)}
                      data-testid={`delete-news-${article.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit News Article</DialogTitle>
            <DialogDescription>Update your news article.</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <NewsEditForm 
              article={editingItem} 
              onSubmit={updateNewsMutation.mutate}
              onCancel={() => setEditingItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-gaming text-primary">Admin Dashboard</h1>
            <Badge variant="outline">Welcome, {user.username}</Badge>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="news" data-testid="tab-news">News</TabsTrigger>
            <TabsTrigger value="seasons" data-testid="tab-seasons">Seasons</TabsTrigger>
            <TabsTrigger value="team" data-testid="tab-team">Team</TabsTrigger>
            <TabsTrigger value="voting" data-testid="tab-voting">Voting</TabsTrigger>
            <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
            <TabsTrigger value="store" data-testid="tab-store">Store</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            {renderNewsTab()}
          </TabsContent>

          <TabsContent value="seasons" className="space-y-6">
            <div className="text-center text-muted-foreground py-8">
              Season management functionality coming soon...
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="text-center text-muted-foreground py-8">
              Team management functionality coming soon...
            </div>
          </TabsContent>

          <TabsContent value="voting" className="space-y-6">
            <div className="text-center text-muted-foreground py-8">
              Voting sites management functionality coming soon...
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <div className="text-center text-muted-foreground py-8">
              Gallery management functionality coming soon...
            </div>
          </TabsContent>

          <TabsContent value="store" className="space-y-6">
            <div className="text-center text-muted-foreground py-8">
              Store management functionality coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// News Create Form Component
function NewsCreateForm({ onSubmit }: { onSubmit: (data: any) => void }) {
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
    onSubmit(formData);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'update',
      imageUrl: '',
      isPublished: false,
      isFeatured: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          data-testid="news-title-input"
        />
      </div>
      
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          required
          data-testid="news-excerpt-input"
        />
      </div>
      
      <div>
        <Label htmlFor="content">Content</Label>
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
        <Label htmlFor="category">Category</Label>
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
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
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
          <Label htmlFor="isPublished">Published</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
            data-testid="news-featured-switch"
          />
          <Label htmlFor="isFeatured">Featured</Label>
        </div>
      </div>
      
      <Button type="submit" className="btn-gaming" data-testid="save-news-button">
        <Save className="mr-2" size={16} />
        Create Article
      </Button>
    </form>
  );
}

// News Edit Form Component
function NewsEditForm({ 
  article, 
  onSubmit, 
  onCancel 
}: { 
  article: NewsArticle; 
  onSubmit: (data: any) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    imageUrl: article.imageUrl || '',
    isPublished: article.isPublished,
    isFeatured: article.isFeatured,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: article.id, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-title">Title</Label>
        <Input
          id="edit-title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          data-testid="edit-news-title-input"
        />
      </div>
      
      <div>
        <Label htmlFor="edit-excerpt">Excerpt</Label>
        <Textarea
          id="edit-excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          required
          data-testid="edit-news-excerpt-input"
        />
      </div>
      
      <div>
        <Label htmlFor="edit-content">Content</Label>
        <Textarea
          id="edit-content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
          rows={6}
          data-testid="edit-news-content-input"
        />
      </div>
      
      <div>
        <Label htmlFor="edit-category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger data-testid="edit-news-category-select">
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
        <Label htmlFor="edit-imageUrl">Image URL (optional)</Label>
        <Input
          id="edit-imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://example.com/image.jpg"
          data-testid="edit-news-image-input"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="edit-isPublished"
            checked={formData.isPublished}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
            data-testid="edit-news-published-switch"
          />
          <Label htmlFor="edit-isPublished">Published</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="edit-isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
            data-testid="edit-news-featured-switch"
          />
          <Label htmlFor="edit-isFeatured">Featured</Label>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit" className="btn-gaming" data-testid="update-news-button">
          <Save className="mr-2" size={16} />
          Update Article
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}