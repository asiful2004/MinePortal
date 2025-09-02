import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: '/', label: t('nav.home') },
    { href: '/news', label: t('nav.news') },
    { href: '/vote', label: t('nav.vote') },
    { href: '/season', label: t('nav.season') },
    { href: '/about', label: t('nav.about') },
    { href: '/store', label: t('nav.store') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50" data-testid="navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" data-testid="logo-link">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-gaming text-lg font-bold">SL</span>
              </div>
              <div>
                <h1 className="font-gaming text-xl font-bold text-primary">
                  {t('server.name')}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {t('server.tagline')}
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-link-${item.href.replace('/', '') || 'home'}`}
              >
                <span
                  className={cn(
                    "text-muted-foreground hover:text-primary transition-colors duration-200",
                    isActive(item.href) && "text-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border" data-testid="mobile-menu">
            <div className="flex flex-col space-y-2 pt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-link-${item.href.replace('/', '') || 'home'}`}
                >
                  <span
                    className={cn(
                      "block py-2 text-muted-foreground hover:text-primary transition-colors duration-200",
                      isActive(item.href) && "text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
