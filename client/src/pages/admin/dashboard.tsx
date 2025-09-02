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
import type { NewsArticle, Season, TeamMember, VotingSite, GalleryImage, StoreItem, ServerConfig, User } from '@shared/schema';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Dialog states for different sections
  const [showSeasonDialog, setShowSeasonDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showVotingDialog, setShowVotingDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);

  // Editing states for different sections
  const [editingSeason, setEditingSeason] = useState<any>(null);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [editingVoting, setEditingVoting] = useState<any>(null);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);

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

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    enabled: !!user
  });

  // Backups Query
  const { data: backups = [], isLoading: backupsLoading } = useQuery({
    queryKey: ['/api/admin/backups'],
    queryFn: async () => {
      const res = await fetch('/api/admin/backups', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch backups');
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

  // Seasons Mutations
  const createSeasonMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/seasons', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create season');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seasons'] });
      toast({ title: 'Success', description: 'Season created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateSeasonMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/seasons/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update season');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seasons'] });
      toast({ title: 'Success', description: 'Season updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteSeasonMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/seasons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete season');
      // For DELETE requests, we don't always need to parse JSON
      try {
        return await response.json();
      } catch {
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seasons'] });
      toast({ title: 'Success', description: 'Season deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Team Mutations
  const createTeamMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/team', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      toast({ title: 'Success', description: 'Team member created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      toast({ title: 'Success', description: 'Team member updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete team member');
      // For DELETE requests, we don't always need to parse JSON
      try {
        return await response.json();
      } catch {
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      toast({ title: 'Success', description: 'Team member deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Voting Sites Mutations
  const createVotingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/voting-sites', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create voting site');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voting-sites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/voting-sites'] });
      toast({ title: 'Success', description: 'Voting site created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateVotingMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/voting-sites/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update voting site');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voting-sites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/voting-sites'] });
      toast({ title: 'Success', description: 'Voting site updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteVotingMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/voting-sites/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete voting site');
      // For DELETE requests, we don't always need to parse JSON
      try {
        return await response.json();
      } catch {
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voting-sites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/voting-sites'] });
      toast({ title: 'Success', description: 'Voting site deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Gallery Mutations
  const createGalleryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create gallery image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: 'Success', description: 'Gallery image created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateGalleryMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update gallery image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: 'Success', description: 'Gallery image updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete gallery image');
      // For DELETE requests, we don't always need to parse JSON
      try {
        return await response.json();
      } catch {
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: 'Success', description: 'Gallery image deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Store Mutations
  const createStoreMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/store', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create store item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/store'] });
      toast({ title: 'Success', description: 'Store item created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateStoreMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/store/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update store item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/store'] });
      toast({ title: 'Success', description: 'Store item updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteStoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/store/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete store item');
      // For DELETE requests, we don't always need to parse JSON
      try {
        return await response.json();
      } catch {
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/store'] });
      toast({ title: 'Success', description: 'Store item deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // User Management Mutations
  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: 'Success', description: 'User created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: 'Success', description: 'User updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete user');
      try {
        return await response.json();
      } catch {
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: 'Success', description: 'User deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Backup Mutation
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to create backup');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/backups'] });
      toast({ title: 'Success', description: 'Database backup created successfully' });
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
          <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{users.length}</div>
          <p className="text-xs text-muted-foreground">
            {users.filter(u => u.isActive).length} active
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

  // Seasons Management
  const renderSeasonsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Seasons Management</h3>
        <Button 
          className="btn-gaming" 
          data-testid="create-season"
          onClick={() => setShowSeasonDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Season
        </Button>
      </div>

      <div className="grid gap-4">
        {seasons.map((season) => (
          <Card key={season.id} className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{season.name}</CardTitle>
                  <CardDescription>{season.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={season.isActive ? 'default' : 'secondary'}>
                      {season.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {season.startDate ? new Date(season.startDate).toLocaleDateString() : 'No start date'} - {season.endDate ? new Date(season.endDate).toLocaleDateString() : 'No end date'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    data-testid={`edit-season-${season.id}`}
                    onClick={() => setEditingSeason(season)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    data-testid={`delete-season-${season.id}`}
                    onClick={() => deleteSeasonMutation.mutate(season.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  // Team Management
  const renderTeamTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Team Management</h3>
        <Button 
          className="btn-gaming" 
          data-testid="create-team"
          onClick={() => setShowTeamDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid gap-4">
        {team.map((member) => (
          <Card key={member.id} className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={member.isActive ? 'default' : 'secondary'}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    data-testid={`edit-team-${member.id}`}
                    onClick={() => setEditingTeam(member)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    data-testid={`delete-team-${member.id}`}
                    onClick={() => deleteTeamMutation.mutate(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  // Voting Sites Management
  const renderVotingTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Voting Sites Management</h3>
        <Button 
          className="btn-gaming" 
          data-testid="create-voting"
          onClick={() => setShowVotingDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Voting Site
        </Button>
      </div>

      <div className="grid gap-4">
        {votingSites.map((site) => (
          <Card key={site.id} className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{site.name}</CardTitle>
                  <CardDescription>{site.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={site.isActive ? 'default' : 'secondary'}>
                      {site.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">Reward: {site.reward}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    data-testid={`edit-voting-${site.id}`}
                    onClick={() => setEditingVoting(site)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    data-testid={`delete-voting-${site.id}`}
                    onClick={() => deleteVotingMutation.mutate(site.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  // Gallery Management
  const renderGalleryTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gallery Management</h3>
        <Button 
          className="btn-gaming" 
          data-testid="create-gallery"
          onClick={() => setShowGalleryDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((image) => (
          <Card key={image.id} className="glass-card">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{image.title}</CardTitle>
                  <CardDescription>{image.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={image.isVisible ? 'default' : 'secondary'}>
                      {image.isVisible ? 'Visible' : 'Hidden'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    data-testid={`edit-gallery-${image.id}`}
                    onClick={() => setEditingGallery(image)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    data-testid={`delete-gallery-${image.id}`}
                    onClick={() => deleteGalleryMutation.mutate(image.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  // Store Management
  const renderStoreTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Store Management</h3>
        <Button 
          className="btn-gaming" 
          data-testid="create-store"
          onClick={() => setShowStoreDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid gap-4">
        {store.map((item) => (
          <Card key={item.id} className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={item.isActive ? 'default' : 'secondary'}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">${item.price}</Badge>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    data-testid={`edit-store-${item.id}`}
                    onClick={() => setEditingStore(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    data-testid={`delete-store-${item.id}`}
                    onClick={() => deleteStoreMutation.mutate(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
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

  // Backups Tab
  const renderBackupsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Database Backups</h2>
        <Button 
          onClick={() => createBackupMutation.mutate()}
          disabled={createBackupMutation.isPending}
        >
          {createBackupMutation.isPending ? 'Creating...' : 'Create New Backup'}
        </Button>
      </div>

      {backupsLoading ? (
        <div>Loading backups...</div>
      ) : (
        <div className="grid gap-4">
          {backups && backups.length > 0 ? (
            backups.map((backup: any) => (
              <Card key={backup.name}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{backup.name}</h3>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(backup.created).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Size: {(backup.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.open(backup.downloadUrl, '_blank')}
                    >
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No backups found. Create your first backup to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
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
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="news" data-testid="tab-news">News</TabsTrigger>
            <TabsTrigger value="seasons" data-testid="tab-seasons">Seasons</TabsTrigger>
            <TabsTrigger value="team" data-testid="tab-team">Team</TabsTrigger>
            <TabsTrigger value="voting" data-testid="tab-voting">Voting</TabsTrigger>
            <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
            <TabsTrigger value="store">Store Items</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            {renderNewsTab()}
          </TabsContent>

          <TabsContent value="seasons" className="space-y-6">
            {renderSeasonsTab()}
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {renderTeamTab()}
          </TabsContent>

          <TabsContent value="voting" className="space-y-6">
            {renderVotingTab()}
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            {renderGalleryTab()}
          </TabsContent>

          <TabsContent value="store" className="space-y-6">
            {renderStoreTab()}
          </TabsContent>

          <TabsContent value="backups" className="space-y-6">
            {renderBackupsTab()}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {renderUsersTab()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Season Dialog */}
      <Dialog open={showSeasonDialog} onOpenChange={setShowSeasonDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Season</DialogTitle>
            <DialogDescription>Add a new season to your server.</DialogDescription>
          </DialogHeader>
          <SeasonForm onSubmit={(data) => {createSeasonMutation.mutate(data); setShowSeasonDialog(false);}} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingSeason} onOpenChange={() => setEditingSeason(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Season</DialogTitle>
            <DialogDescription>Update season information.</DialogDescription>
          </DialogHeader>
          {editingSeason && (
            <SeasonForm 
              initialData={editingSeason}
              onSubmit={(data) => {updateSeasonMutation.mutate({id: editingSeason.id, ...data}); setEditingSeason(null);}} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Team Dialog */}
      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Add a new team member to your staff.</DialogDescription>
          </DialogHeader>
          <TeamForm onSubmit={(data) => {createTeamMutation.mutate(data); setShowTeamDialog(false);}} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTeam} onOpenChange={() => setEditingTeam(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update team member information.</DialogDescription>
          </DialogHeader>
          {editingTeam && (
            <TeamForm 
              initialData={editingTeam}
              onSubmit={(data) => {updateTeamMutation.mutate({id: editingTeam.id, ...data}); setEditingTeam(null);}} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Voting Dialog */}
      <Dialog open={showVotingDialog} onOpenChange={setShowVotingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Voting Site</DialogTitle>
            <DialogDescription>Add a new voting site for players.</DialogDescription>
          </DialogHeader>
          <VotingForm onSubmit={(data) => {createVotingMutation.mutate(data); setShowVotingDialog(false);}} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingVoting} onOpenChange={() => setEditingVoting(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Voting Site</DialogTitle>
            <DialogDescription>Update voting site information.</DialogDescription>
          </DialogHeader>
          {editingVoting && (
            <VotingForm 
              initialData={editingVoting}
              onSubmit={(data) => {updateVotingMutation.mutate({id: editingVoting.id, ...data}); setEditingVoting(null);}} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Gallery Image</DialogTitle>
            <DialogDescription>Add a new image to your gallery.</DialogDescription>
          </DialogHeader>
          <GalleryForm onSubmit={(data) => {createGalleryMutation.mutate(data); setShowGalleryDialog(false);}} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingGallery} onOpenChange={() => setEditingGallery(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Gallery Image</DialogTitle>
            <DialogDescription>Update image information.</DialogDescription>
          </DialogHeader>
          {editingGallery && (
            <GalleryForm 
              initialData={editingGallery}
              onSubmit={(data) => {updateGalleryMutation.mutate({id: editingGallery.id, ...data}); setEditingGallery(null);}} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Store Dialog */}
      <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Store Item</DialogTitle>
            <DialogDescription>Add a new item to your store.</DialogDescription>
          </DialogHeader>
          <StoreForm onSubmit={(data) => {createStoreMutation.mutate(data); setShowStoreDialog(false);}} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingStore} onOpenChange={() => setEditingStore(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Store Item</DialogTitle>
            <DialogDescription>Update store item information.</DialogDescription>
          </DialogHeader>
          {editingStore && (
            <StoreForm 
              initialData={editingStore}
              onSubmit={(data) => {updateStoreMutation.mutate({id: editingStore.id, ...data}); setEditingStore(null);}} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user information' : 'Add a new user.'}
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            initialData={editingUser}
            onSubmit={(data) => {
              if (editingUser) {
                updateUserMutation.mutate({ id: editingUser.id, ...data });
              } else {
                createUserMutation.mutate(data);
              }
              setShowUserDialog(false);
              setEditingUser(null);
            }}
          />
        </DialogContent>
      </Dialog>
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

// Season Form Component
function SeasonForm({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    version: initialData?.version || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    isActive: initialData?.isActive || false,
    features: initialData?.features || [],
    videoUrl: initialData?.videoUrl || '',
    imageUrl: initialData?.imageUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="season-name">Season Name</Label>
        <Input
          id="season-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="season-description">Description</Label>
        <Textarea
          id="season-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="season-version">Version (e.g., S1, S2, S3)</Label>
        <Input
          id="season-version"
          value={formData.version}
          onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
          placeholder="S1"
          required
        />
      </div>
      <div>
        <Label htmlFor="season-start">Start Date</Label>
        <Input
          id="season-start"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="season-end">End Date</Label>
        <Input
          id="season-end"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="season-video">Video URL (YouTube)</Label>
        <Input
          id="season-video"
          type="url"
          value={formData.videoUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
          placeholder="https://youtube.com/..."
        />
      </div>
      <div>
        <Label htmlFor="season-image">Image URL</Label>
        <Input
          id="season-image"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://..."
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="season-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="season-active">Active Season</Label>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Season' : 'Create Season'}
      </Button>
    </form>
  );
}

// Team Form Component
function TeamForm({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    description: initialData?.description || '',
    avatarUrl: initialData?.avatarUrl || '',
    isActive: initialData?.isActive || true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="team-name">Name</Label>
        <Input
          id="team-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="team-role">Role</Label>
        <Input
          id="team-role"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="team-description">Description</Label>
        <Textarea
          id="team-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="team-avatar">Avatar URL</Label>
        <Input
          id="team-avatar"
          type="url"
          value={formData.avatarUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="team-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="team-active">Active Member</Label>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Member' : 'Add Member'}
      </Button>
    </form>
  );
}

// Voting Form Component
function VotingForm({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    url: initialData?.url || '',
    description: initialData?.description || '',
    reward: initialData?.reward || '',
    isActive: initialData?.isActive || true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="voting-name">Site Name</Label>
        <Input
          id="voting-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="voting-url">URL</Label>
        <Input
          id="voting-url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="voting-description">Description</Label>
        <Textarea
          id="voting-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="voting-reward">Reward</Label>
        <Input
          id="voting-reward"
          value={formData.reward}
          onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="voting-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="voting-active">Active Site</Label>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Site' : 'Add Site'}
      </Button>
    </form>
  );
}

// Gallery Form Component
function GalleryForm({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    isVisible: initialData?.isVisible !== undefined ? initialData.isVisible : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="gallery-title">Title</Label>
        <Input
          id="gallery-title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="gallery-description">Description</Label>
        <Textarea
          id="gallery-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="gallery-image">Image URL</Label>
        <Input
          id="gallery-image"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="gallery-visible"
          checked={formData.isVisible}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
        />
        <Label htmlFor="gallery-visible">Visible</Label>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Image' : 'Add Image'}
      </Button>
    </form>
  );
}

// Store Form Component
function StoreForm({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price ? initialData.price.replace('$', '') : '',
    category: initialData?.category || 'ranks',
    imageUrl: initialData?.imageUrl || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    isFeatured: initialData?.isFeatured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: `$${formData.price}`,
      features: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="store-name">Item Name</Label>
        <Input
          id="store-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="store-description">Description</Label>
        <Textarea
          id="store-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="store-price">Price ($)</Label>
        <Input
          id="store-price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="store-category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ranks">Ranks</SelectItem>
            <SelectItem value="items">Items</SelectItem>
            <SelectItem value="keys">Keys</SelectItem>
            <SelectItem value="cosmetics">Cosmetics</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="store-image">Image URL</Label>
        <Input
          id="store-image"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="store-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="store-active">Active</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="store-featured"
          checked={formData.isFeatured}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
        />
        <Label htmlFor="store-featured">Featured</Label>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Item' : 'Add Item'}
      </Button>
    </form>
  );
};

// Users Management
const renderUsersTab = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">User Management</h3>
      <Button 
        onClick={() => {
          setEditingUser(null);
          setShowUserDialog(true);
        }}
        data-testid="button-add-user"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </div>

    <div className="grid gap-4">
      {users.map((user) => (
        <Card key={user.id} className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Users className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-primary">{user.username}</h4>
                  <p className="text-sm text-muted-foreground">{user.email || 'No email'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingUser(user);
                    setShowUserDialog(true);
                  }}
                  data-testid={`button-edit-user-${user.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this user?')) {
                      deleteUserMutation.mutate(user.id);
                    }
                  }}
                  data-testid={`button-delete-user-${user.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// User Form Component
const UserForm = ({ initialData, onSubmit }: { initialData?: any, onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'player',
    avatarUrl: initialData?.avatarUrl || '',
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Don't send password if empty on edit
    const submitData = { ...formData };
    if (initialData && !submitData.password) {
      delete submitData.password;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="user-username">Username</Label>
        <Input
          id="user-username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="user-email">Email</Label>
        <Input
          id="user-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="user-password">
          Password {initialData ? '(leave empty to keep current)' : ''}
        </Label>
        <Input
          id="user-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          required={!initialData}
        />
      </div>
      <div>
        <Label htmlFor="user-role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="player">Player</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="user-avatar">Avatar URL</Label>
        <Input
          id="user-avatar"
          type="url"
          value={formData.avatarUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="user-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="user-active">Active</Label>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update User' : 'Add User'}
      </Button>
    </form>
  );
};