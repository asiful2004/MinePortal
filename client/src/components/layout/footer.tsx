import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { useServerStatus } from '@/hooks/use-server-status';
import { Github, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const { data: serverConfig } = useServerStatus();

  return (
    <footer className="bg-card border-t border-border py-12" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Server Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded">
                <span className="sr-only">{t('server.name')}</span>
              </div>
              <span className="text-lg font-gaming font-bold">{t('server.name')}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-primary transition-colors"
                data-testid="social-discord"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-primary transition-colors"
                data-testid="social-youtube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-primary transition-colors"
                data-testid="social-github"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">{t('footer.links.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <span className="text-muted-foreground hover:text-primary transition-colors">
                    {t('nav.home')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/news">
                  <span className="text-muted-foreground hover:text-primary transition-colors">
                    {t('nav.news')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/vote">
                  <span className="text-muted-foreground hover:text-primary transition-colors">
                    {t('nav.vote')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-muted-foreground hover:text-primary transition-colors">
                    {t('nav.about')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Server Info */}
          <div>
            <h3 className="font-bold mb-4">{t('footer.server.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                <span>{t('footer.server.ip')}: </span>
                <span className="text-primary font-mono" data-testid="footer-server-ip">
                  {serverConfig?.ip || 'play.skyblocklegends.net'}
                </span>
              </li>
              <li className="text-muted-foreground">
                <span>{t('footer.server.version')}: </span>
                <span data-testid="footer-server-version">
                  {serverConfig?.version || '1.20.1'}
                </span>
              </li>
              <li className="text-muted-foreground">
                <span>{t('footer.server.players')}: </span>
                <span className="text-secondary" data-testid="footer-player-count">
                  {serverConfig?.playerCount || 0}/{serverConfig?.maxPlayers || 2000}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">{t('footer.contact.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.contact.support')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.contact.discord')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.contact.email')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              {t('footer.legal.privacy')}
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              {t('footer.legal.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
