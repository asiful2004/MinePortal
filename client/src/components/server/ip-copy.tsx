import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useServerStatus } from '@/hooks/use-server-status';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function IpCopy() {
  const { t } = useTranslation();
  const { data: serverConfig } = useServerStatus();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ip = serverConfig?.ip || 'play.skyblocklegends.net';
    
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      toast({
        title: t('server.ip.copied'),
        description: t('server.ip.copied_desc'),
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = ip;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      toast({
        title: t('server.ip.copied'),
        description: t('server.ip.copied_desc'),
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-between bg-muted rounded-lg p-3" data-testid="ip-copy">
      <span className="font-mono text-foreground" data-testid="server-ip">
        {serverConfig?.ip || 'play.skyblocklegends.net'}
      </span>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className={copied ? 'copy-success' : ''}
        data-testid="copy-ip-button"
      >
        {copied ? (
          <>
            <Check size={16} className="mr-2" />
            {t('server.ip.copied')}
          </>
        ) : (
          <>
            <Copy size={16} className="mr-2" />
            {t('server.ip.copy')}
          </>
        )}
      </Button>
    </div>
  );
}
