'use client';

import { useState, useEffect } from 'react';
import { Heart, Music, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateRendererProps {
  template: {
    id: string;
    slug: string;
    title: string;
    audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant';
    bg_audio_url: string | null;
  };
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  isPreview?: boolean;
  creatorName?: string;
}

export default function TemplateRenderer({ 
  template, 
  recipientName, 
  message, 
  designStyle,
  isPreview = false,
  creatorName
}: TemplateRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (template.bg_audio_url && !isPreview) {
      const audioElement = new Audio(template.bg_audio_url);
      audioElement.loop = true;
      setAudio(audioElement);
      
      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [template.bg_audio_url, isPreview]);

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getTemplateComponent = () => {
    const templateKey = `${template.slug}-${designStyle}`;
    
    switch (template.slug) {
      case 'seni-seviyorum-teen':
        if (designStyle === 'eglenceli') {
          return <EglenceliSeniSeviyorumTemplate 
            recipientName={recipientName} 
            message={message} 
            designStyle={designStyle}
            creatorName={creatorName}
          />;
        }
        return <SeniSeviyorumTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      case 'affet-beni':
        return <AffetBeniTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      case 'evlilik-teklifi':
        return <EvlilikTeklifiTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      case 'dogum-gunu':
        return <DogumGunuTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      case 'tesekkur':
        return <TesekkurTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      case 'ozur-dilerim':
        return <OzurDilerimTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      case 'mutlu-yillar':
        return <MutluYillarTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      case 'romantik-mesaj':
        return <RomantikMesajTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          creatorName={creatorName}
        />;
      default:
        return <DefaultTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist'}
          title={template.title}
          creatorName={creatorName}
        />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Audio Control */}
      {template.bg_audio_url && !isPreview && (
        <Button
          onClick={toggleAudio}
          className="fixed top-4 right-4 z-50 rounded-full w-12 h-12 p-0"
          variant="outline"
        >
          {isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      )}
      
      {getTemplateComponent()}
    </div>
  );
}

// Template Components
function SeniSeviyorumTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getSeniSeviyorumStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${styles.floatingHeart} animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            ❤️
          </div>
        ))}
      </div>
      
      <div className={`max-w-4xl mx-auto p-8 text-center relative z-10 ${styles.container}`}>
        {/* Creator Name Display */}
        {creatorName && (
          <div className="text-center mb-6">
            <p className={`text-sm ${styles.creatorNameColor || 'text-gray-600'}`}>
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        {/* Header Section */}
        <div className="mb-12">
          <div className={`${styles.iconContainer} mx-auto mb-6`}>
            <Heart className={`${styles.iconSize} ${styles.heartColor} animate-bounce`} />
          </div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4 ${styles.titleAnimation}`}>
            {recipientName ? `Sevgili ${recipientName},` : 'Sevgilim,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8 ${styles.subtitleAnimation}`}>
            💕 Seni Seviyorum 💕
          </h2>
        </div>
        
        {/* Message Section */}
        <div className={`${styles.messageContainer} p-8 rounded-2xl mb-12 ${styles.messageAnimation}`}>
          <div className="mb-6">
            <div className="flex justify-center space-x-2 mb-4">
              {['💖', '✨', '🌟', '✨', '💖'].map((emoji, i) => (
                <span 
                  key={i}
                  className={`text-3xl ${styles.emojiAnimation}`}
                  style={{animationDelay: `${i * 0.1}s`}}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed mb-6`}>
              {message || "Sen benim hayatımın en güzel parçasısın. Seninle geçirdiğim her an bir hayal gibi. Seni ne kadar sevdiğimi kelimelerle anlatmak mümkün değil. Her gün seni daha çok seviyorum. 💕"}
            </p>
          </div>
        </div>
        
        {/* Footer Section */}
        <div className={`${styles.footerSection} space-y-6`}>
          <p className={`${styles.footerText} font-medium`}>
            Sen benim her şeyimsin! 💝
          </p>
          
          <div className="flex justify-center space-x-3">
            <span className="text-3xl animate-bounce" style={{animationDelay: '0s'}}>💖</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.1s'}}>💕</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>💗</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>💓</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.4s'}}>💘</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>💝</span>
          </div>
          
 
        </div>
      </div>
    </div>
  );
}

function AffetBeniTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display */}
        {creatorName && (
          <div className="text-center mb-6">
            <p className="text-sm text-white/70">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Sevgilim,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Affet Beni 💔
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Yaptığım hatalar için çok üzgünüm. Seni incittiğim için kalbim acıyor. Lütfen beni affet, bir daha asla böyle bir hata yapmayacağım."}
          </p>
        </div>
        
        <div className="text-4xl">💝</div>
      </div>
    </div>
  );
}

function EvlilikTeklifiTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Moved to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">💍</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Aşkım,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Benimle Evlenir misin? 💕
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Seninle geçirdiğim her an hayatımın en güzel anları. Artık hayatımın geri kalanını da seninle geçirmek istiyorum. Benimle evlenir misin?"}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 text-3xl">
          <span>💐</span>
          <span>💍</span>
          <span>💒</span>
        </div>
      </div>
    </div>
  );
}

function DogumGunuTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">🎂</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Canım,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Doğum Günün Kutlu Olsun! 🎉
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Bu özel günde sana en güzel dilekleri gönderiyorum. Yeni yaşın sana sağlık, mutluluk ve başarı getirsin. Doğum günün kutlu olsun!"}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 text-3xl">
          <span>🎈</span>
          <span>🎁</span>
          <span>🎊</span>
          <span>🎉</span>
        </div>
      </div>
    </div>
  );
}

function TesekkurTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Değerli İnsan,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Teşekkür Ederim 🌟
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Bana gösterdiğin destek ve anlayış için çok teşekkür ederim. Senin gibi değerli insanların varlığı hayatımı çok daha anlamlı kılıyor."}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 text-3xl">
          <span>🌹</span>
          <span>💝</span>
          <span>🌟</span>
        </div>
      </div>
    </div>
  );
}

function OzurDilerimTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">😔</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Sevgili Arkadaşım,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Özür Dilerim 💙
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Yaptığım hata için gerçekten çok üzgünüm. Seni kırdığım için kendimi affetmiyorum. Umarım beni anlayışla karşılar ve özrümü kabul edersin."}
          </p>
        </div>
        
        <div className="text-4xl">🕊️</div>
      </div>
    </div>
  );
}

function MutluYillarTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">🎊</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Sevgili Dostum,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Mutlu Yıllar! ✨
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Yeni yıl yeni umutlar, yeni başlangıçlar demek. Bu yıl sana sağlık, mutluluk ve başarı getirsin. Mutlu yıllar!"}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 text-3xl">
          <span>🎆</span>
          <span>🥂</span>
          <span>🎊</span>
          <span>✨</span>
        </div>
      </div>
    </div>
  );
}

function RomantikMesajTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-6xl mb-4">💕</div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Aşkım,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            Sana Özel Bir Mesaj 💖
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Sen benim hayatımın en güzel parçasısın. Seninle geçirdiğim her an bir hayal gibi. Seni ne kadar sevdiğimi kelimelerle anlatmak mümkün değil."}
          </p>
        </div>
        
        <div className="flex justify-center space-x-2">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="text-2xl animate-pulse" style={{animationDelay: `${i * 0.3}s`}}>
              💖
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DefaultTemplate({ recipientName, message, designStyle, title, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  title: string;
  creatorName?: string;
}) {
  const styles = getDesignStyles(designStyle);
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background}`}>
      <div className={`max-w-2xl mx-auto p-8 text-center ${styles.container}`}>
        {/* Creator Name Display - Added to Top */}
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <Heart className={`mx-auto mb-4 ${styles.iconSize} ${styles.heartColor}`} />
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4`}>
            {recipientName ? `${recipientName},` : 'Sevgili İnsan,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8`}>
            {title}
          </h2>
        </div>
        
        <div className={`${styles.messageContainer} p-6 rounded-lg mb-8`}>
          <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed`}>
            {message || "Bu özel mesaj sizin için hazırlandı."}
          </p>
        </div>
      </div>
    </div>
  );
}

// Design Styles Helper
function getDesignStyles(designStyle: 'modern' | 'classic' | 'minimalist') {
  switch (designStyle) {
    case 'modern':
      return {
        background: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
        container: 'bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl',
        titleSize: 'text-4xl md:text-5xl',
        titleColor: 'text-gray-800',
        subtitleSize: 'text-2xl md:text-3xl',
        subtitleColor: 'text-gray-600',
        messageContainer: 'bg-gradient-to-r from-pink-50 to-purple-50',
        messageSize: 'text-lg md:text-xl',
        messageColor: 'text-gray-700',
        iconSize: 'h-16 w-16',
        smallHeartSize: 'h-6 w-6',
        heartColor: 'text-pink-500'
      };
    case 'classic':
      return {
        background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
        container: 'bg-white border-4 border-amber-200 rounded-lg shadow-xl',
        titleSize: 'text-3xl md:text-4xl',
        titleColor: 'text-amber-800',
        subtitleSize: 'text-xl md:text-2xl',
        subtitleColor: 'text-amber-700',
        messageContainer: 'bg-amber-50 border border-amber-200',
        messageSize: 'text-base md:text-lg',
        messageColor: 'text-amber-900',
        iconSize: 'h-12 w-12',
        smallHeartSize: 'h-5 w-5',
        heartColor: 'text-amber-600'
      };
    case 'minimalist':
      return {
        background: 'bg-gray-50',
        container: 'bg-white border border-gray-200 rounded-lg shadow-sm',
        titleSize: 'text-2xl md:text-3xl',
        titleColor: 'text-gray-900',
        subtitleSize: 'text-lg md:text-xl',
        subtitleColor: 'text-gray-600',
        messageContainer: 'bg-gray-50',
        messageSize: 'text-base',
        messageColor: 'text-gray-800',
        iconSize: 'h-10 w-10',
        smallHeartSize: 'h-4 w-4',
        heartColor: 'text-gray-600'
      };
    default:
      return getDesignStyles('modern');
  }
}

// Interactive Fun Template Component
function EglenceliSeniSeviyorumTemplate({ recipientName, message, designStyle, creatorName }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
}) {
  const [showQuestion, setShowQuestion] = useState(true);
  const [noClickCount, setNoClickCount] = useState(0);
  const [showParty, setShowParty] = useState(false);
  const [confetti, setConfetti] = useState<Array<{id: number, x: number, y: number, color: string, size: number}>>([]);
  const [fireworks, setFireworks] = useState<Array<{id: number, x: number, y: number}>>([]);

  const handleNoClick = () => {
    setNoClickCount(prev => prev + 1);
  };

  const handleYesClick = () => {
    setShowQuestion(false);
    setShowParty(true);
    
    // Create enhanced confetti effect
    const newConfetti = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#f093fb', '#f5576c'][Math.floor(Math.random() * 8)],
      size: Math.random() * 8 + 4
    }));
    setConfetti(newConfetti);

    // Create fireworks effect
    const newFireworks = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20
    }));
    setFireworks(newFireworks);
  };

  const getYesButtonStyle = () => {
    const baseSize = Math.min(noClickCount * 35 + 80, Math.min(window?.innerWidth * 0.9 || 500, 500));
    const glowIntensity = Math.min(noClickCount * 5, 25);
    return {
      width: `${baseSize}px`,
      height: `${baseSize}px`,
      fontSize: `${Math.min(noClickCount * 3 + 18, 36)}px`,
      boxShadow: `0 0 ${glowIntensity}px rgba(34, 197, 94, 0.8), 0 0 ${glowIntensity * 2}px rgba(34, 197, 94, 0.4)`,
      transform: `scale(${1 + noClickCount * 0.1})`,
      transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    };
  };

  const getNoButtonStyle = () => {
    const shrinkFactor = Math.max(1 - noClickCount * 0.15, 0.2);
    const shakeFactor = noClickCount > 2 ? 'translateX(-2px)' : 'translateX(0)';
    return {
      transform: `scale(${shrinkFactor}) ${shakeFactor}`,
      opacity: Math.max(1 - noClickCount * 0.15, 0.3),
      transition: 'all 0.3s ease-out',
      filter: noClickCount > 1 ? 'blur(0.5px)' : 'none'
    };
  };

  if (showParty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced Confetti Animation */}
        {confetti.map(piece => (
          <div
            key={piece.id}
            className="absolute animate-bounce"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              backgroundColor: piece.color,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              borderRadius: '50%',
              animationDuration: `${1 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: `0 0 ${piece.size}px ${piece.color}`,
              zIndex: 10
            }}
          />
        ))}

        {/* Fireworks Effect */}
        {fireworks.map(firework => (
          <div
            key={firework.id}
            className="absolute"
            style={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
              zIndex: 5
            }}
          >
            <div className="relative">
              {/* Firework burst */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                  style={{
                    transform: `rotate(${i * 30}deg) translateX(${20 + Math.random() * 30}px)`,
                    animationDelay: `${Math.random() * 1}s`,
                    animationDuration: `${1.5 + Math.random()}s`
                  }}
                />
              ))}
              <div className="text-4xl animate-pulse">✨</div>
            </div>
          </div>
        ))}

        {/* Floating Hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-200/60 text-3xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              💖
            </div>
          ))}
        </div>
        
        {/* Party Content */}
        <div className="text-center text-white z-20 max-w-4xl mx-auto p-8 relative">
          {/* Creator Name Display */}
          {creatorName && (
            <div className="text-center mb-6">
              <p className="text-sm text-white/70">
                Hazırlayan: {creatorName}
              </p>
            </div>
          )}
          
          <div className="text-8xl mb-8 animate-bounce">🎉</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-pulse">
            Yaşasın! 🥳
          </h1>
          <h2 className="text-2xl md:text-4xl mb-8">
            {recipientName ? `${recipientName}, sen de beni seviyorsun!` : 'Sen de beni seviyorsun!'}
          </h2>
          <div className="text-xl md:text-2xl mb-8 bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            {message || "Bu kadar mutlu olmamıştım! Seni çok ama çok seviyorum! 💕"}
          </div>
          
          {/* Dancing Emojis */}
          <div className="flex justify-center space-x-4 text-6xl">
            <span className="animate-bounce" style={{animationDelay: '0s'}}>💃</span>
            <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🕺</span>
            <span className="animate-bounce" style={{animationDelay: '0.4s'}}>💃</span>
            <span className="animate-bounce" style={{animationDelay: '0.6s'}}>🕺</span>
          </div>
          
          <div className="mt-8 text-lg">
            <p className="animate-pulse">🎊 Parti zamanı! 🎊</p>
          </div>
        </div>
      </div>
    );
  }

  if (showQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-400 flex items-center justify-center relative overflow-hidden">
        {/* Floating Hearts Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/20 text-2xl animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              💖
            </div>
          ))}
        </div>

        <div className="text-center max-w-4xl mx-auto p-8 relative z-10">
          {/* Creator Name Display */}
          {creatorName && (
            <div className="text-center mb-6">
              <p className="text-sm text-white/70">
                Hazırlayan: {creatorName}
              </p>
            </div>
          )}
          
          {/* Header */}
          <div className="mb-12">
            <div className="text-6xl mb-6 animate-bounce">💕</div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {recipientName ? `Merhaba ${recipientName}!` : 'Merhaba Canım!'}
            </h1>
          </div>

          {/* Question */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6">
              Seni çok seviyorum. Sen de beni seviyor musun? 🥺
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {message || "Çok merak ediyorum... Lütfen dürüst ol! 💭"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col items-center space-y-8">
            <Button
              onClick={handleYesClick}
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-white/30 backdrop-blur-sm relative overflow-hidden group"
              style={getYesButtonStyle()}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="animate-pulse">💚</span>
                EVET!
                <span className="animate-pulse">💚</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
            
            <Button
              onClick={handleNoClick}
              className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-lg border-2 border-white/20 relative group"
              style={getNoButtonStyle()}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>😔</span>
                Hayır
                <span>😔</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </Button>
          </div>

          {noClickCount > 0 && (
            <div className="mt-8 text-white text-lg animate-bounce">
              {noClickCount === 1 && "Emin misin? 🤔"}
              {noClickCount === 2 && "Gerçekten mi? 😢"}
              {noClickCount === 3 && "Lütfen tekrar düşün! 🥺"}
              {noClickCount >= 4 && "Evet butonuna basmak zorundasın artık! 😄"}
            </div>
          )}
        </div>
        

      </div>
    );
  }

  return null;
}

function getSeniSeviyorumStyles(designStyle: 'modern' | 'classic' | 'minimalist') {
  switch (designStyle) {
    case 'modern':
      return {
        background: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
        backgroundElements: 'absolute inset-0 pointer-events-none',
        floatingHeart: 'text-white/20 text-lg',
        container: 'bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20',
        iconContainer: 'bg-gradient-to-br from-pink-100 to-purple-100 rounded-full p-6 w-fit',
        titleSize: 'text-4xl md:text-6xl',
        titleColor: 'text-gray-800',
        titleAnimation: 'animate-fade-in-up',
        subtitleSize: 'text-2xl md:text-4xl',
        subtitleColor: 'text-pink-600',
        subtitleAnimation: 'animate-fade-in-up',
        messageContainer: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border border-pink-200/50 shadow-inner',
        messageSize: 'text-lg md:text-xl',
        messageColor: 'text-gray-700',
        messageAnimation: 'animate-fade-in-up',
        iconSize: 'h-20 w-20',
        smallHeartSize: 'h-6 w-6',
        heartColor: 'text-pink-500',
        emojiAnimation: 'hover:scale-125 transition-transform',
        footerSection: 'animate-fade-in-up',
        footerText: 'text-xl text-gray-700',
        featureCard: 'bg-white/80 backdrop-blur-sm border border-pink-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
        featureText: 'text-gray-600',
        cardAnimation: 'animate-fade-in-up',
        creatorNameColor: 'text-gray-600'
      };
    case 'classic':
      return {
        background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
        backgroundElements: 'absolute inset-0 pointer-events-none',
        floatingHeart: 'text-amber-200/40 text-base',
        container: 'bg-white border-4 border-amber-300 rounded-2xl shadow-2xl',
        iconContainer: 'bg-amber-100 rounded-full p-6 w-fit border-2 border-amber-200',
        titleSize: 'text-3xl md:text-5xl',
        titleColor: 'text-amber-800',
        titleAnimation: 'animate-fade-in-up',
        subtitleSize: 'text-xl md:text-3xl',
        subtitleColor: 'text-amber-700',
        subtitleAnimation: 'animate-fade-in-up',
        messageContainer: 'bg-amber-50 border-2 border-amber-200 shadow-inner',
        messageSize: 'text-base md:text-lg',
        messageColor: 'text-amber-900',
        messageAnimation: 'animate-fade-in-up',
        iconSize: 'h-16 w-16',
        smallHeartSize: 'h-5 w-5',
        heartColor: 'text-amber-600',
        emojiAnimation: 'hover:scale-110 transition-transform',
        footerSection: 'animate-fade-in-up',
        footerText: 'text-lg text-amber-800',
        featureCard: 'bg-amber-50 border-2 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
        featureText: 'text-amber-700',
        cardAnimation: 'animate-fade-in-up',
        creatorNameColor: 'text-amber-700'
      };
    case 'minimalist':
      return {
        background: 'bg-gray-50',
        backgroundElements: 'absolute inset-0 pointer-events-none',
        floatingHeart: 'text-gray-200/30 text-sm',
        container: 'bg-white border border-gray-300 rounded-xl shadow-lg',
        iconContainer: 'bg-gray-100 rounded-full p-4 w-fit',
        titleSize: 'text-2xl md:text-4xl',
        titleColor: 'text-gray-900',
        titleAnimation: 'animate-fade-in-up',
        subtitleSize: 'text-lg md:text-2xl',
        subtitleColor: 'text-gray-600',
        subtitleAnimation: 'animate-fade-in-up',
        messageContainer: 'bg-gray-50 border border-gray-200',
        messageSize: 'text-base md:text-lg',
        messageColor: 'text-gray-800',
        messageAnimation: 'animate-fade-in-up',
        iconSize: 'h-12 w-12',
        smallHeartSize: 'h-4 w-4',
        heartColor: 'text-gray-600',
        emojiAnimation: 'hover:scale-105 transition-transform',
        footerSection: 'animate-fade-in-up',
        footerText: 'text-base text-gray-700',
        featureCard: 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300',
        featureText: 'text-gray-600',
        cardAnimation: 'animate-fade-in-up',
        creatorNameColor: 'text-gray-600'
      };
    default:
      return getSeniSeviyorumStyles('modern');
  }
}