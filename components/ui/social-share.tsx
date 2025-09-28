'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Share2, 
  Copy, 
  Mail, 
  Download, 
  Instagram, 
  Twitter, 
  Facebook,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  recipientName: string;
  onShare?: (platform: string) => void;
}

export function SocialShare({ 
  url, 
  title, 
  description, 
  recipientName,
  onShare 
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link kopyalandı!');
      onShare?.('clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Kopyalama başarısız');
    }
  };

  const shareViaWhatsApp = () => {
    const message = `${recipientName} için özel bir mesajım var! 💕\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    onShare?.('whatsapp');
  };

  const shareViaEmail = () => {
    const subject = `${recipientName} için özel mesaj`;
    const body = `Merhaba,\n\n${recipientName} için özel bir mesaj hazırladım. Aşağıdaki linke tıklayarak görüntüleyebilirsin:\n\n${url}\n\nSevgiler! 💕`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    onShare?.('email');
  };

  const shareViaTwitter = () => {
    const message = `${recipientName} için özel bir mesajım var! 💕`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, '_blank');
    onShare?.('twitter');
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    onShare?.('facebook');
  };

  const shareViaInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the link and show instructions
    copyToClipboard();
    toast.info('Link kopyalandı! Instagram Story\'nize yapıştırabilirsiniz.');
    onShare?.('instagram');
  };

  const generateVisualShare = async (format: 'instagram-square' | 'instagram-story' | 'whatsapp') => {
    setIsGeneratingImage(true);
    try {
      // This would typically call an API endpoint to generate the image
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dimensions = {
        'instagram-square': '1080x1080',
        'instagram-story': '1080x1920',
        'whatsapp': '1080x1350'
      };

      toast.success(`${dimensions[format]} görsel hazırlandı!`);
      onShare?.(`visual-${format}`);
    } catch (error) {
      toast.error('Görsel oluşturulamadı');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        onShare?.('native');
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-600" />
          Mesajınızı Paylaşın
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Display */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 bg-transparent border-none outline-none text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            <Copy className="w-4 h-4 mr-1" />
            {copied ? 'Kopyalandı!' : 'Kopyala'}
          </Button>
        </div>

        {/* Quick Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={shareViaWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button
            onClick={shareViaEmail}
            variant="outline"
          >
            <Mail className="w-4 h-4 mr-2" />
            E-posta
          </Button>
        </div>

        {/* Social Media Platforms */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Sosyal Medya</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={shareViaInstagram}
              variant="outline"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Instagram className="w-5 h-5 text-pink-600" />
              <span className="text-xs">Instagram</span>
            </Button>
            <Button
              onClick={shareViaTwitter}
              variant="outline"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Twitter className="w-5 h-5 text-blue-500" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              onClick={shareViaFacebook}
              variant="outline"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span className="text-xs">Facebook</span>
            </Button>
          </div>
        </div>

        {/* Visual Export */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Görsel Paylaşım</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => generateVisualShare('instagram-square')}
              variant="outline"
              size="sm"
              disabled={isGeneratingImage}
              className="justify-start"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Instagram Kare (1080x1080)
            </Button>
            <Button
              onClick={() => generateVisualShare('instagram-story')}
              variant="outline"
              size="sm"
              disabled={isGeneratingImage}
              className="justify-start"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Instagram Story (1080x1920)
            </Button>
            <Button
              onClick={() => generateVisualShare('whatsapp')}
              variant="outline"
              size="sm"
              disabled={isGeneratingImage}
              className="justify-start"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              WhatsApp Görseli (1080x1350)
            </Button>
          </div>
        </div>

        {/* Native Share (Mobile) */}
        {typeof window !== 'undefined' && 'share' in navigator && (
          <Button
            onClick={handleNativeShare}
            variant="outline"
            className="w-full"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Paylaş
          </Button>
        )}
      </CardContent>
    </Card>
  );
}