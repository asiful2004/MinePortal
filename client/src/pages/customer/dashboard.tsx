import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Crown, 
  User, 
  ShoppingBag, 
  Award, 
  Star, 
  Gift, 
  Sparkles, 
  LogOut,
  Gamepad2,
  TrendingUp,
  Heart,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    const userData = localStorage.getItem('customer_user');

    if (!token || !userData) {
      setLocation('/customer/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'player') {
        toast({
          title: 'Access Denied',
          description: 'Customer panel is only for player accounts',
          variant: 'destructive',
        });
        setLocation('/');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      setLocation('/customer/login');
    }
  }, [setLocation, toast]);

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    setLocation('/');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('customer_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Mock VIP data for demonstration
  const vipData = {
    level: 'Diamond VIP',
    points: 2850,
    nextLevelPoints: 3000,
    purchases: 12,
    totalSpent: '$157.99',
    achievements: ['First Purchase', 'Loyal Customer', 'VIP Member', 'Diamond Tier'],
    rewards: ['10% Extra Money', 'Priority Support', 'Exclusive Items', 'Special Crates'],
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">Loading your VIP experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-purple-300/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-yellow-400" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                    VIP Dashboard
                  </h1>
                  <p className="text-xs text-purple-200">SkyBlock Legends</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.username}</p>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                    {vipData.level}
                  </Badge>
                </div>
                <Link href="/customer/profile">
                  <Button
                    variant="outline"
                    className="border-purple-300/50 text-purple-200 hover:bg-purple-600/20"
                    data-testid="button-customer-profile"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-purple-300/50 text-purple-200 hover:bg-purple-600/20"
                  data-testid="button-customer-logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">{user.username}</span>!
              </h2>
              <p className="text-purple-200">Your exclusive VIP experience awaits</p>
            </div>

            {/* VIP Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
                <CardContent className="p-4 text-center">
                  <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-yellow-200">VIP Level</p>
                  <p className="text-xl font-bold text-white">{vipData.level}</p>
                </CardContent>
              </Card>

              <Card className="glass-card bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-400/30">
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-purple-200">VIP Points</p>
                  <p className="text-xl font-bold text-white">{vipData.points.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card className="glass-card bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30">
                <CardContent className="p-4 text-center">
                  <ShoppingBag className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-green-200">Total Spent</p>
                  <p className="text-xl font-bold text-white">{vipData.totalSpent}</p>
                </CardContent>
              </Card>

              <Card className="glass-card bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-400/30">
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <p className="text-sm text-pink-200">Purchases</p>
                  <p className="text-xl font-bold text-white">{vipData.purchases}</p>
                </CardContent>
              </Card>
            </div>

            {/* VIP Progress */}
            <Card className="glass-card bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/30 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  VIP Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Next Level: Platinum VIP</span>
                    <span className="text-white font-medium">{vipData.points}/{vipData.nextLevelPoints}</span>
                  </div>
                  <Progress value={(vipData.points / vipData.nextLevelPoints) * 100} className="h-3" />
                  <p className="text-sm text-purple-300">
                    {vipData.nextLevelPoints - vipData.points} more points to reach Platinum VIP
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/30 border border-purple-300/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/40 text-white">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-600/40 text-white">
                <Gift className="h-4 w-4 mr-2" />
                Rewards
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600/40 text-white">
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600/40 text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card bg-white/5 border-purple-300/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-400" />
                      VIP Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vipData.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-400/20">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-purple-100">{reward}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card bg-white/5 border-purple-300/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Visit Store
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Gift className="h-4 w-4 mr-2" />
                      Claim Daily Reward
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade VIP
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vipData.rewards.map((reward, index) => (
                  <Card key={index} className="glass-card bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-400/30">
                    <CardContent className="p-6 text-center">
                      <Gift className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white mb-2">{reward}</h3>
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Active</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vipData.achievements.map((achievement, index) => (
                  <Card key={index} className="glass-card bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-400/30">
                    <CardContent className="p-6 flex items-center gap-4">
                      <Award className="h-12 w-12 text-yellow-400" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{achievement}</h3>
                        <p className="text-yellow-200">Unlocked</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card className="glass-card bg-white/5 border-purple-300/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-400" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-purple-200 text-sm">Username</label>
                      <p className="text-white font-medium">{user.username}</p>
                    </div>
                    <div>
                      <label className="text-purple-200 text-sm">Email</label>
                      <p className="text-white font-medium">{user.email || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-purple-200 text-sm">VIP Level</label>
                      <p className="text-white font-medium">{vipData.level}</p>
                    </div>
                    <div>
                      <label className="text-purple-200 text-sm">Member Since</label>
                      <p className="text-white font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}