import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Star, Gift, Shield, Zap, Coins, ArrowLeft } from 'lucide-react';

export default function CustomerProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    const userData = localStorage.getItem('customer_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Mock data - in real app this would come from API
  const playerStats = {
    level: 15,
    progress: 65,
    totalRewards: 850,
    currentStreak: 8,
    monthlyVotes: 22,
    hoursPlayed: 156,
    achievements: 42
  };

  const achievements = [
    { icon: "🏆", title: "Island Master", description: "Completed 50 island challenges", unlocked: true },
    { icon: "💎", title: "Diamond Collector", description: "Collected 1000 diamonds", unlocked: true },
    { icon: "⚡", title: "Speed Builder", description: "Built 100 structures in record time", unlocked: false },
    { icon: "🌟", title: "Elite Player", description: "Reached level 25", unlocked: false },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p>Please log in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/customer/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Player Profile</h1>
                <p className="text-muted-foreground">{user.username}'s profile</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 border-4 border-border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                  {user.username}
                  <Badge>Level {playerStats.level}</Badge>
                </CardTitle>
                <p className="text-muted-foreground">Player Member</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Level Progress</span>
                    <span>{playerStats.progress}%</span>
                  </div>
                  <Progress value={playerStats.progress} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {100 - playerStats.progress}% to Level {playerStats.level + 1}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary">{playerStats.totalRewards}</div>
                    <div className="text-xs text-muted-foreground">Total Rewards</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary">{playerStats.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                </div>

                <Button className="w-full">
                  <Gift className="h-4 w-4 mr-2" />
                  Claim Daily Reward
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Achievements */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Activity & Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">{playerStats.monthlyVotes}</div>
                    <div className="text-sm text-muted-foreground">Votes This Month</div>
                    <div className="text-xs text-green-600 mt-1">+3 from last month</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">{playerStats.hoursPlayed}</div>
                    <div className="text-sm text-muted-foreground">Hours Played</div>
                    <div className="text-xs text-green-600 mt-1">+8 this week</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">{playerStats.achievements}</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                    <div className="text-xs text-green-600 mt-1">12 unlocked</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-all ${
                        achievement.unlocked 
                          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                          : 'bg-muted border-border opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            {achievement.unlocked && (
                              <Badge className="bg-green-500 text-white text-xs">Unlocked</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Player Perks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Player Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Player Status</h4>
                        <p className="text-sm text-muted-foreground mt-1">Full access to server features</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Gift className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Daily Rewards</h4>
                        <p className="text-sm text-muted-foreground mt-1">Collect daily bonuses and items</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Voting Rewards</h4>
                        <p className="text-sm text-muted-foreground mt-1">Earn rewards by voting for the server</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Coins className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Economy Access</h4>
                        <p className="text-sm text-muted-foreground mt-1">Trade and use server economy</p>
                      </div>
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