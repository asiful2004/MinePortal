import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function AdminLogin() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/auth/login', formData);
      const data = await response.json();
      
      // Store the token
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      toast({
        title: t('admin.login.success'),
        description: t('admin.login.welcome'),
      });
      
      // Redirect to admin dashboard
      setLocation('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('admin.login.error'),
        description: error instanceof Error ? error.message : t('admin.login.invalid_credentials'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-gaming text-2xl text-primary">
              {t('admin.login.title')}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {t('admin.login.subtitle')}
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('admin.login.username')}</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t('admin.login.username_placeholder')}
                  required
                  disabled={isLoading}
                  data-testid="username-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('admin.login.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('admin.login.password_placeholder')}
                    required
                    disabled={isLoading}
                    data-testid="password-input"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full btn-gaming"
                disabled={isLoading}
                data-testid="login-button"
              >
                {isLoading ? t('admin.login.logging_in') : t('admin.login.login')}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                {t('admin.login.default_credentials')}
              </p>
              <p className="text-xs text-center mt-1 font-mono">
                admin / skyblock2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
