// ThemeSelector.tsx
import { useState, useEffect, SetStateAction } from 'react';
import { Palette, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const colorThemes = [
  {
    label: 'Default',
    value: 'default',
    color: 'bg-[oklch(0.208_0.042_265.755)]',
    border: 'border-[oklch(0.704_0.04_256.788)]',
  },
  {
    label: 'Blue',
    value: 'blue',
    color: 'bg-[oklch(0.546_0.245_262.881)]',
    border: 'border-[oklch(0.623_0.214_259.815)]',
  },
  {
    label: 'Green',
    value: 'green',
    color: 'bg-[oklch(0.648_0.2_131.684)]',
    border: 'border-[oklch(0.648_0.2_131.684)]',
  },
  {
    label: 'Amber',
    value: 'amber',
    color: 'bg-[oklch(0.666_0.179_58.318)]',
    border: 'border-[oklch(0.769_0.188_70.08)]',
  },
  {
    label: 'Rose',
    value: 'rose',
    color: 'bg-[oklch(0.586_0.253_17.585)]',
    border: 'border-[oklch(0.645_0.246_16.439)]',
  },
  {
    label: 'Purple',
    value: 'purple',
    color: 'bg-[oklch(0.558_0.288_302.321)]',
    border: 'border-[oklch(0.627_0.265_303.9)]',
  },
  {
    label: 'Orange',
    value: 'orange',
    color: 'bg-[oklch(0.646_0.222_41.116)]',
    border: 'border-[oklch(0.705_0.213_47.604)]',
  },
  {
    label: 'Teal',
    value: 'teal',
    color: 'bg-[oklch(0.6_0.118_184.704)]',
    border: 'border-[oklch(0.704_0.14_182.503)]',
  },
];

// Enhanced storage that persists across refreshes
const themeStorage = {
  getItem: (key: string) => {
    try {
      // First check localStorage if available
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(key);
        if (stored) return stored;
      }
    } catch (e) {
      // localStorage not available, continue with fallbacks
    }

    // Fallback to data attributes (only on client side)
    if (typeof window !== 'undefined') {
      const fromDataAttr = document.documentElement.getAttribute('data-color-theme');
      if (fromDataAttr) return fromDataAttr;

      // Check existing theme classes
      const existingTheme = colorThemes.find((theme) => 
        document.documentElement.classList.contains(theme.value)
      );
      return existingTheme ? existingTheme.value : 'default';
    }

    return 'default';
  },

  setItem: (key: string, value: string) => {
    try {
      // Try localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      // localStorage failed, continue with fallbacks
    }

    // Always set data attribute as backup (only on client side)
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-color-theme', value);
    }
  },
};

// Global theme state management
class ThemeManager {
  private static instance: ThemeManager;
  private subscribers: Set<(theme: string) => void> = new Set();
  private _currentTheme: string;

  private constructor() {
    this._currentTheme = this.getInitialTheme();
    this.initializeTheme();
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  private getInitialTheme(): string {
    return themeStorage.getItem('color-theme') || 'default';
  }

  private initializeTheme(): void {
    if (typeof window !== 'undefined') {
      this.applyTheme(this._currentTheme);
    }
  }

  get currentTheme(): string {
    return this._currentTheme;
  }

  setTheme(theme: string): void {
    if (this._currentTheme !== theme) {
      this._currentTheme = theme;
      this.applyTheme(theme);
      this.notifySubscribers(theme);
    }
  }

  private applyTheme(theme: string): void {
    if (typeof window === 'undefined') return;

    const html = document.documentElement;
    
    // Remove all theme classes
    colorThemes.forEach(({ value }) => {
      html.classList.remove(value);
    });

    // Add selected theme class
    if (theme !== 'default') {
      html.classList.add(theme);
    }

    // Save to storage
    themeStorage.setItem('color-theme', theme);
  }

  subscribe(callback: (theme: string) => void): () => void {
    this.subscribers.add(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(theme: string): void {
    this.subscribers.forEach(callback => callback(theme));
  }
}

export default function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    setMounted(true);
    const themeManager = ThemeManager.getInstance();
    
    // Set initial theme
    setCurrentTheme(themeManager.currentTheme);
    
    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, []);

  const handleSelect = (themeValue: SetStateAction<string>, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const newTheme = typeof themeValue === 'string' ? themeValue : themeValue(currentTheme);
    ThemeManager.getInstance().setTheme(newTheme);
  };

  const handleDropdownClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="flex items-center gap-2 px-3 py-1.5">
        <div className="w-4 h-4 rounded-full bg-muted animate-pulse"></div>
        <span className="text-xs">Loading...</span>
        <Palette className="w-3 h-3" />
      </Button>
    );
  }

  const selectedTheme = colorThemes.find((c) => c.value === currentTheme) || colorThemes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-3 py-1.5"
          onClick={handleDropdownClick}
        >
          <div className={`w-4 h-4 rounded-full ${selectedTheme.color} ${selectedTheme.border} border-2`}></div>
          <span className="text-xs font-medium">{selectedTheme.label}</span>
          <Palette className="w-3 h-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 p-2"
        onClick={handleDropdownClick}
        align="start"
      >
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          Choose Color
        </div>

        <div className="grid grid-cols-2 gap-1">
          {colorThemes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={(e) => handleSelect(theme.value, e)}
              className="flex items-center gap-2 p-2 rounded-md cursor-pointer"
            >
              <div className="relative">
                <div className={`w-5 h-5 rounded-full ${theme.color} ${theme.border} border-2 shadow-sm`}></div>
                {currentTheme === theme.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white drop-shadow-sm" />
                  </div>
                )}
              </div>
              <span className="text-xs font-medium flex-1">{theme.label}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
