import { useServerStatus } from '@/hooks/use-server-status';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function ServerStatus() {
  const { t } = useTranslation();
  const { data: serverConfig, isLoading } = useServerStatus();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2" data-testid="server-status-loading">
        <div className="w-3 h-3 rounded-full bg-muted animate-pulse"></div>
        <span className="text-muted-foreground">{t('server.status.loading')}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2" data-testid="server-status">
      <div
        className={cn(
          "w-3 h-3 rounded-full",
          serverConfig?.isOnline ? "status-online" : "status-offline"
        )}
        data-testid="status-indicator"
      ></div>
      <span
        className={cn(
          "font-medium",
          serverConfig?.isOnline ? "text-secondary" : "text-destructive"
        )}
        data-testid="status-text"
      >
        {serverConfig?.isOnline ? t('server.status.online') : t('server.status.offline')}
      </span>
    </div>
  );
}
