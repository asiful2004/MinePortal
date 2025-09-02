import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  User, 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Star,
  LogOut,
  Settings,
  CreditCard,
  Eye,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

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
          description: 'Customer dashboard is only for player accounts',
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

  // Mock order data - in real app this would come from API
  const orders = [
    {
      id: 'ORD-001',
      date: '2025-01-02',
      items: ['Diamond Rank Upgrade', 'Custom Plot Design'],
      total: '$49.99',
      status: 'completed',
      deliveryDate: '2025-01-02'
    },
    {
      id: 'ORD-002', 
      date: '2025-01-05',
      items: ['Monthly VIP Pass'],
      total: '$19.99',
      status: 'processing',
      deliveryDate: 'Pending'
    },
    {
      id: 'ORD-003',
      date: '2025-01-08',
      items: ['Starter Kit Bundle', 'Premium Tools Set'],
      total: '$29.99',
      status: 'shipped',
      deliveryDate: '2025-01-10'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500 text-white"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500 text-white"><Package className="h-3 w-3 mr-1" />Shipped</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p>Please log in to view your dashboard</p>
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
            <div>
              <h1 className="text-2xl font-bold text-foreground">Customer Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.username}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/customer/profile">
                <Button variant="outline" size="sm" data-testid="button-customer-profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-customer-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">$99.97</p>
                </div>
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status !== 'completed').length}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-2xl font-bold">2024</p>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="purchases">Purchase History</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {order.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">{item}</div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.total}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Order Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Completed Orders</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.status === 'completed').length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Processing Orders</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orders.filter(o => o.status === 'processing').length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Shipped Orders</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {orders.filter(o => o.status === 'shipped').length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Purchase History Tab */}
          <TabsContent value="purchases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Purchase History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.items.join(', ')}</TableCell>
                        <TableCell className="font-medium">{order.total}</TableCell>
                        <TableCell>Credit Card ****1234</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500 text-white">Paid</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <p className="mt-1 p-2 bg-muted rounded">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <p className="mt-1 p-2 bg-muted rounded capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="mt-1 p-2 bg-muted rounded">January 2024</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Status</label>
                    <p className="mt-1 p-2 bg-muted rounded">
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/customer/profile">
                    <Button className="w-full" variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/store">
                    <Button className="w-full" variant="outline">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Browse Store
                    </Button>
                  </Link>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}