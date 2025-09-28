'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Download, Instagram, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface ShareButtonProps {
  shortId: string;
  recipientName: string;
  className?: string;
}

export function ShareButton({ shortId, recipientName, className }: ShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  // Detect background color to adjust button visibility
  useEffect(() => {
    const detectBackgroundColor = () => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const backgroundColor = computedStyle.backgroundColor;
      
      // Convert RGB to luminance to determine if background is dark
      const rgb = backgroundColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        
        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        setIsDarkBackground(luminance < 0.5);
      }
    };

    detectBackgroundColor();
    
    // Re-check when the page loads or changes
    const observer = new MutationObserver(detectBackgroundColor);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class', 'style'],
      subtree: true 
    });

    return () => observer.disconnect();
  }, []);

  const generateAndDownloadImage = async (format: string) => {
    setIsGenerating(true);
    try {
      // First, temporarily replace any oklab colors in the DOM
      const allElements = document.querySelectorAll('*');
      const originalStyles: { element: HTMLElement; cssText: string }[] = [];
      
      allElements.forEach((el) => {
        const element = el as HTMLElement;
        const style = element.style;
        const computedStyle = window.getComputedStyle(element);
        
        // Check both inline styles and computed styles for oklab
        const hasOklabInline = style.cssText.includes('oklab') || style.cssText.includes('oklch');
        const hasOklabComputed = computedStyle.color?.includes('oklab') || 
                                computedStyle.color?.includes('oklch') ||
                                computedStyle.backgroundColor?.includes('oklab') ||
                                computedStyle.backgroundColor?.includes('oklch') ||
                                computedStyle.borderColor?.includes('oklab') ||
                                computedStyle.borderColor?.includes('oklch');
        
        if (hasOklabInline || hasOklabComputed) {
          // Store original styles for restoration
          originalStyles.push({ element, cssText: style.cssText });
          
          // Replace oklab colors with fallback colors in inline styles
          if (hasOklabInline) {
            const rules = style.cssText.split(';');
            const filteredRules = rules.filter(rule => !rule.includes('oklab') && !rule.includes('oklch'));
            style.cssText = filteredRules.join(';');
          }
          
          // Override computed styles with safe fallbacks
          if (hasOklabComputed) {
            if (computedStyle.color?.includes('oklab') || computedStyle.color?.includes('oklch')) {
              element.style.color = '#000000';
            }
            if (computedStyle.backgroundColor?.includes('oklab') || computedStyle.backgroundColor?.includes('oklch')) {
              element.style.backgroundColor = 'transparent';
            }
            if (computedStyle.borderColor?.includes('oklab') || computedStyle.borderColor?.includes('oklch')) {
              element.style.borderColor = '#cccccc';
            }
          }
        }
      });

      // Capture the current page design using html2canvas
      const element = document.body;
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Restore original styles
      originalStyles.forEach(({ element, cssText }) => {
        element.style.cssText = cssText;
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gizli-mesaj-${format}-${shortId}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success('Görsel başarıyla indirildi!');
        }
      }, 'image/png');

    } catch (error) {
      console.error('Görsel oluşturma hatası:', error);
      toast.error('Görsel oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getFormatName = (format: string) => {
    const names = {
      'instagram-square': 'Instagram Kare',
      'instagram-story': 'Instagram Story',
      'whatsapp': 'WhatsApp',
      'web-banner': 'Web Banner'
    };
    return names[format as keyof typeof names] || format;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'instagram-square':
      case 'instagram-story':
        return <Instagram className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'web-banner':
        return <Download className="w-4 h-4" />;
      default:
        return <Share2 className="w-4 h-4" />;
    }
  };

  const formats = [
    { key: 'instagram-square', name: 'Instagram Kare (1080×1080)' },
    { key: 'instagram-story', name: 'Instagram Story (1080×1920)' },
    { key: 'whatsapp', name: 'WhatsApp (800×800)' },
    { key: 'web-banner', name: 'Web Banner (1920×1080)' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 backdrop-blur-sm border-white/20 transition-all duration-200 ${
            isDarkBackground 
              ? 'bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900' 
              : 'bg-gray-900/90 text-white hover:bg-gray-900 hover:text-white border-gray-700/50'
          } ${className}`}
          disabled={isGenerating}
        >
          <Share2 className="w-4 h-4" />
          {isGenerating ? 'Oluşturuluyor...' : 'Paylaş'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {formats.map((format) => (
          <DropdownMenuItem
            key={format.key}
            onClick={() => generateAndDownloadImage(format.key)}
            className="gap-2 cursor-pointer"
            disabled={isGenerating}
          >
            {getFormatIcon(format.key)}
            <span>{format.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}