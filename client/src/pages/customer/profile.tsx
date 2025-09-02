import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Star, Gift, Shield, Zap, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function CustomerProfile() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('customer-token');
    const userData = localStorage.getItem('customer-user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Mock VIP data - in real app this would come from API
  const vipLevel = 3;
  const vipProgress = 75;
  const totalRewards = 1250;
  const currentStreak = 12;
  const monthlyVotes = 28;

  const perks = [
    { icon: Crown, title: "VIP Chat Color", description: "Golden username in chat", active: true },
    { icon: Star, title: "Priority Support", description: "Faster response times", active: true },
    { icon: Gift, title: "Daily Rewards", description: "Exclusive daily bonuses", active: true },
    { icon: Shield, title: "Plot Protection", description: "Enhanced plot security", active: true },
    { icon: Zap, title: "Fast Travel", description: "Instant teleportation", active: vipLevel >= 2 },
    { icon: Coins, title: "Bonus Currency", description: "20% extra coin drops", active: vipLevel >= 3 },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p>Please log in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-yellow-400">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white text-2xl font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2">
                      <Crown className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                  {user.username}
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    VIP {vipLevel}
                  </Badge>
                </CardTitle>
                <p className="text-gray-600">Premium Member</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>VIP Progress</span>
                    <span>{vipProgress}%</span>
                  </div>
                  <Progress value={vipProgress} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {100 - vipProgress}% to VIP {vipLevel + 1}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-600">{totalRewards}</div>
                    <div className="text-xs text-gray-600">Total Rewards</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">{currentStreak}</div>
                    <div className="text-xs text-gray-600">Day Streak</div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  <Gift className="h-4 w-4 mr-2" />
                  Claim Daily Reward
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* VIP Perks & Stats */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* VIP Perks */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Crown className="h-5 w-5" />
                  VIP Perks & Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {perks.map((perk, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-2 transition-all ${
                        perk.active 
                          ? 'bg-green-50 border-green-300 shadow-lg' 
                          : 'bg-gray-50 border-gray-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          perk.active ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <perk.icon className={`h-5 w-5 ${
                            perk.active ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{perk.title}</h4>
                            {perk.active && (
                              <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{perk.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Star className="h-5 w-5" />
                  Activity & Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{monthlyVotes}</div>
                    <div className="text-sm text-gray-600">Votes This Month</div>
                    <div className="text-xs text-green-600 mt-1">+3 from last month</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">247</div>
                    <div className="text-sm text-gray-600">Hours Played</div>
                    <div className="text-xs text-green-600 mt-1">+12 this week</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">89.5%</div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                    <div className="text-xs text-green-600 mt-1">Above average</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Recent Achievements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        🏆
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Island Master</div>
                        <div className="text-sm text-gray-600">Completed 50 island challenges</div>
                      </div>
                      <Badge className="bg-yellow-500 text-white">New</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        💎
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Diamond Collector</div>
                        <div className="text-sm text-gray-600">Collected 1000 diamonds</div>
                      </div>
                      <Badge className="bg-blue-500 text-white">Unlocked</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}