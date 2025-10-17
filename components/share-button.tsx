'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Link, MessageCircle, Twitter, Facebook, Instagram, Image as ImageIcon, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ShareButtonProps {
  shortId: string;
  recipientName: string;
  className?: string;
  onVisualShare?: () => void;
}

export function ShareButton({ shortId, recipientName, className, onVisualShare }: ShareButtonProps) {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Initialize shareUrl on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/m/${shortId}`);
    }
  }, [shortId]);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link panoya kopyalandı!');
    } catch (error) {
      console.error('Kopyalama hatası:', error);
      toast.error('Link kopyalanamadı. Lütfen tekrar deneyin.');
    }
  };

  const shareToWhatsApp = () => {
    const message = `${recipientName} için özel bir mesajım var! 💕 ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTwitter = () => {
    const message = `${recipientName} için özel bir mesajım var! 💕`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareToInstagram = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link kopyalandı! Instagram\'da paylaşabilirsiniz.');
      // Instagram web'de doğrudan URL paylaşımı desteklenmediği için Instagram'ı açıyoruz
      window.open('https://www.instagram.com/', '_blank');
    } catch (error) {
      console.error('Instagram paylaşım hatası:', error);
      toast.error('Link kopyalanamadı. Lütfen tekrar deneyin.');
    }
  };

  const shareViaWebAPI = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${recipientName} için özel mesaj`,
          text: `${recipientName} için özel bir mesajım var! 💕`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Web Share API hatası:', error);
        copyToClipboard(); // Fallback to copy
      }
    } else {
      copyToClipboard(); // Fallback to copy
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'copy':
        return <Copy className="w-4 h-4" />;
      case 'visual':
        return <ImageIcon className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'native':
        return <Share2 className="w-4 h-4" />;
      default:
        return <Link className="w-4 h-4" />;
    }
  };

  const [showUrlOptions, setShowUrlOptions] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 backdrop-blur-md transition-all duration-200 shadow-lg ${
            isDarkBackground
              ? 'bg-white/95 text-gray-900 hover:bg-white hover:text-gray-900 border-white/30 hover:border-white/50 shadow-black/20'
              : 'bg-gray-900/95 text-white hover:bg-gray-900 hover:text-white border-gray-700/50 hover:border-gray-600 shadow-gray-900/30'
          } ${className}`}
        >
          <Share2 className="w-4 h-4" />
          <span className="font-medium">Paylaş</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {!showUrlOptions ? (
          <>
            {onVisualShare && (
              <DropdownMenuItem
                onClick={onVisualShare}
                className="gap-3 cursor-pointer py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-md mb-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    Görsel olarak paylaş
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="text-xs text-gray-600">Sosyal medya için görseller</div>
                </div>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setShowUrlOptions(true);
              }}
              className="gap-3 cursor-pointer py-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Link className="w-5 h-5 text-gray-700" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">URL olarak paylaş</div>
                <div className="text-xs text-gray-600">Link ile paylaş</div>
              </div>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setShowUrlOptions(false);
              }}
              className="gap-2 cursor-pointer text-gray-600 mb-2"
            >
              <span>← Geri</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={copyToClipboard}
              className="gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Linki Kopyala</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={shareToWhatsApp}
              className="gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp'ta Paylaş</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={shareToInstagram}
              className="gap-2 cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram'da Paylaş</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={shareToTwitter}
              className="gap-2 cursor-pointer"
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter'da Paylaş</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={shareToFacebook}
              className="gap-2 cursor-pointer"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook'ta Paylaş</span>
            </DropdownMenuItem>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <DropdownMenuItem
                onClick={shareViaWebAPI}
                className="gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Diğer Uygulamalar</span>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
