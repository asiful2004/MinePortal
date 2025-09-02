import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { LANGUAGES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className="fixed top-20 right-4 z-40" data-testid="language-switcher">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="glass-card border-border/20"
            data-testid="language-switcher-trigger"
          >
            <span className="mr-2">{currentLang.flag}</span>
            <Globe size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="glass-card border-border/20"
          data-testid="language-switcher-menu"
        >
          {LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => {
                changeLanguage(language.code);
                setIsOpen(false);
              }}
              className={currentLanguage === language.code ? 'bg-accent' : ''}
              data-testid={`language-option-${language.code}`}
            >
              <span className="mr-3">{language.flag}</span>
              <span>{language.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
