'use client';

import { useState, useEffect } from 'react';
import { Heart, Music, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SeniSeviyorumTemplate from './components/SeniSeviyorumTemplate';
import AffetBeniTemplate from './components/AffetBeniTemplate';
import { YouTubePlayer, extractVideoId } from '@/components/ui/youtube-player';
import { TemplateTextFields } from './types';

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
  textFields?: TemplateTextFields;
}

export default function TemplateRenderer({ 
  template, 
  recipientName, 
  message, 
  designStyle,
  isPreview = false,
  creatorName,
  textFields
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
          textFields={textFields}
        />;
      case 'affet-beni':
      case 'affet-beni-classic':
        return <AffetBeniTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle}
          creatorName={creatorName}
          textFields={textFields}
        />;
      case 'evlilik-teklifi-elegant':
        return <EvlilikTeklifiTemplate 
          recipientName={recipientName} 
          message={message} 
          designStyle={designStyle as 'modern' | 'classic' | 'minimalist' | 'eglenceli'}
          creatorName={creatorName}
          textFields={textFields}
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



function EvlilikTeklifiTemplate({ recipientName, message, designStyle, creatorName, textFields = {} }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
  textFields?: TemplateTextFields;
}) {
  const [showQuestion, setShowQuestion] = useState(true);
  const [noClickCount, setNoClickCount] = useState(0);
  const [showParty, setShowParty] = useState(false);
  const [confetti, setConfetti] = useState<Array<{id: number, x: number, y: number, color: string, size: number}>>([]);

  const handleNoClick = () => {
    if (designStyle === 'eglenceli') {
      setNoClickCount(prev => prev + 1);
      // Buton kaçma efekti için state güncellemesi
    }
  };

  // Get text values from textFields or use defaults
  const mainMessage = textFields?.mainMessage || message;
  const footerMessage = textFields?.footerMessage || 'Seni sonsuza kadar seviyorum! 💍💕';
  const specialMessage = textFields?.specialMessage || 'Sen benim hayatımın aşkısın, ruhuma dokunduğun ilk günden beri seni seviyorum.';

  const handleYesClick = () => {
    if (designStyle === 'eglenceli') {
      setShowQuestion(false);
      setShowParty(true);
      // Konfeti efekti
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#ff69b4', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'][Math.floor(Math.random() * 5)],
        size: Math.random() * 10 + 5
      }));
      setConfetti(newConfetti);
    }
  };

  // Modern Stil
  if (designStyle === 'modern') {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #fef3c7 100%)'
      }}>
        {/* Altın toz efekti */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              <div className="w-1 h-1 bg-yellow-400 rounded-full opacity-70"></div>
            </div>
          ))}
        </div>

        {/* İnce ışık hüzmesi */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-yellow-300 to-transparent opacity-30"></div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Creator Name */}
            {creatorName && (
              <div className="mb-8">
                <p className="text-sm text-yellow-200 font-light tracking-wide">
                  Hazırlayan: {creatorName}
                </p>
              </div>
            )}

            {/* Ana Başlık */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-serif text-yellow-100 mb-6 tracking-wide">
                {recipientName ? `${recipientName},` : 'Aşkım,'}
              </h1>
              <h2 className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight">
                Benimle Evlenir misin?
              </h2>
              
              {/* Altın aksesuar motifleri */}
              <div className="flex justify-center items-center space-x-8 mb-8">
                <div className="w-16 h-px bg-yellow-400"></div>
                <div className="text-4xl">💍</div>
                <div className="w-16 h-px bg-yellow-400"></div>
              </div>
            </div>

            {/* Mesaj Kutusu */}
            <div className="bg-white/10 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-8 mb-12 max-w-2xl mx-auto">
              <p className="text-xl text-yellow-50 leading-relaxed font-light">
                {mainMessage}
              </p>
              
              {specialMessage && (
                <div className="mt-6 pt-6 border-t border-yellow-400/20">
                  <p className="text-lg text-yellow-100 italic">
                    "{specialMessage}"
                  </p>
                </div>
              )}
            </div>

            {/* Footer Message */}
            <div className="mb-8">
              <p className="text-lg text-yellow-200 font-medium">
                {footerMessage}
              </p>
            </div>

            {/* Dekoratif Elementler */}
            <div className="flex justify-center space-x-6 text-4xl">
              <span className="animate-bounce" style={{animationDelay: '0s'}}>💐</span>
              <span className="animate-bounce" style={{animationDelay: '0.2s'}}>💍</span>
              <span className="animate-bounce" style={{animationDelay: '0.4s'}}>💒</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Klasik Stil
  if (designStyle === 'classic') {
    return (
      <div className="min-h-screen relative" style={{
        background: 'linear-gradient(45deg, #fef7ed 0%, #fdf2f8 50%, #fef3c7 100%)'
      }}>
        {/* Dantel doku efekti */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Çiçek süslemeleri */}
        <div className="absolute top-10 left-10 text-pink-300 text-2xl opacity-60 animate-pulse">🌸</div>
        <div className="absolute top-20 right-16 text-pink-300 text-xl opacity-60 animate-pulse" style={{animationDelay: '1s'}}>🌺</div>
        <div className="absolute bottom-20 left-20 text-pink-300 text-2xl opacity-60 animate-pulse" style={{animationDelay: '2s'}}>🌹</div>
        <div className="absolute bottom-16 right-12 text-pink-300 text-xl opacity-60 animate-pulse" style={{animationDelay: '0.5s'}}>🌷</div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Creator Name */}
            {creatorName && (
              <div className="mb-8">
                <p className="text-sm text-rose-600 font-serif italic">
                  Hazırlayan: {creatorName}
                </p>
              </div>
            )}

            {/* Dekoratif Çerçeve */}
            <div className="border-4 border-yellow-600 border-double rounded-3xl p-12 bg-white/80 backdrop-blur-sm shadow-2xl">
              {/* Üst süsleme */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-px bg-yellow-600"></div>
                  <div className="text-3xl">🌹</div>
                  <div className="w-12 h-px bg-yellow-600"></div>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif text-rose-800 mb-6 italic">
                {recipientName ? `${recipientName},` : 'Aşkım,'}
              </h1>
              
              <h2 className="text-3xl md:text-5xl font-serif text-yellow-700 mb-8 leading-relaxed">
                Benimle Evlenir misin?
              </h2>

              {/* Mesaj */}
              <div className="bg-rose-50 border-l-4 border-rose-300 p-6 rounded-r-lg mb-8 max-w-2xl mx-auto">
                <p className="text-lg text-rose-800 leading-relaxed font-serif italic">
                  {mainMessage}
                </p>
                
                {specialMessage && (
                  <div className="mt-4 pt-4 border-t border-rose-200">
                    <p className="text-base text-rose-700 italic">
                      "{specialMessage}"
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Message */}
              <div className="mb-6">
                <p className="text-lg text-rose-600 font-serif">
                  {footerMessage}
                </p>
              </div>

              {/* Alt süsleme */}
              <div className="flex justify-center items-center space-x-6">
                <div className="text-2xl animate-pulse">💐</div>
                <div className="text-3xl animate-pulse" style={{animationDelay: '0.5s'}}>💍</div>
                <div className="text-2xl animate-pulse" style={{animationDelay: '1s'}}>💒</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimalist Stil
  if (designStyle === 'minimalist') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Creator Name */}
          {creatorName && (
            <div className="mb-12">
              <p className="text-xs text-gray-400 font-light tracking-widest uppercase">
                Hazırlayan: {creatorName}
              </p>
            </div>
          )}

          {/* Ana İçerik */}
          <div className="space-y-16">
            <div className="space-y-8">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
                {recipientName ? `${recipientName}` : 'Aşkım'}
              </h1>
              
              <div className="w-24 h-px bg-pink-400 mx-auto"></div>
              
              <h2 className="text-5xl md:text-7xl font-thin text-gray-800 leading-tight">
                Benimle<br />Evlenir misin?
              </h2>
            </div>

            {/* Mesaj */}
            <div className="max-w-xl mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                {mainMessage}
              </p>
              
              {specialMessage && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-base text-gray-500 italic">
                    "{specialMessage}"
                  </p>
                </div>
              )}
            </div>

            {/* Footer Message */}
            <div className="max-w-lg mx-auto">
              <p className="text-base text-gray-500 font-light">
                {footerMessage}
              </p>
            </div>

            {/* Minimal İkon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 border border-pink-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">💍</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Eğlenceli Stil
  if (designStyle === 'eglenceli') {
    if (showParty) {
      return (
        <div className="min-h-screen relative overflow-hidden" style={{
          background: 'linear-gradient(45deg, #ff69b4, #ffd700, #ff6b6b, #4ecdc4)'
        }}>
          {/* Konfeti */}
          {confetti.map((piece) => (
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
                animationDuration: '2s',
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}

          <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-8xl mb-8 animate-bounce">🎉</div>
              <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                EVET! 💕
              </h1>
              <p className="text-2xl text-white mb-8">
                Harika! Düğün hazırlıklarına başlayabiliriz! 🎊
              </p>
              <div className="flex justify-center space-x-4 text-4xl">
                <span className="animate-spin">💍</span>
                <span className="animate-bounce">💒</span>
                <span className="animate-pulse">👰</span>
                <span className="animate-bounce">🤵</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(45deg, #ff69b4 0%, #ffd700 25%, #ff6b6b 50%, #4ecdc4 75%, #ff69b4 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient 8s ease infinite'
      }}>
        {/* Animasyonlu arka plan desenleri */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              <span className="text-2xl opacity-30">
                {['💖', '⭐', '✨', '💫'][Math.floor(Math.random() * 4)]}
              </span>
            </div>
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Creator Name */}
            {creatorName && (
              <div className="mb-8">
                <p className="text-sm text-white font-bold tracking-wide animate-pulse">
                  Hazırlayan: {creatorName}
                </p>
              </div>
            )}

            {/* Ana Soru */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-2xl">
              <div className="text-6xl mb-6 animate-bounce">💍</div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                {recipientName ? `${recipientName},` : 'Aşkım,'}
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-pink-600 mb-6">
                Benimle Evlenir misin? 🥺
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {mainMessage}
              </p>
              
              {specialMessage && (
                <div className="mt-4 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-300">
                  <p className="text-base text-gray-700 italic">
                    "{specialMessage}"
                  </p>
                </div>
              )}
              
              {footerMessage && (
                <div className="mt-4">
                  <p className="text-sm text-pink-600 font-medium">
                    {footerMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Butonlar */}
            <div className="flex flex-col items-center space-y-8">
              <Button
                onClick={handleYesClick}
                className="bg-green-500 hover:bg-green-600 text-white text-2xl px-12 py-6 rounded-full transform hover:scale-110 transition-all duration-300 shadow-lg animate-pulse"
              >
                EVET! 💕
              </Button>
              
              <Button
                onClick={handleNoClick}
                className={`bg-red-500 hover:bg-red-600 text-white text-xl px-8 py-4 rounded-full transform transition-all duration-300 shadow-lg ${
                  noClickCount > 0 ? 'animate-bounce' : ''
                }`}
                style={{
                  transform: noClickCount > 0 ? `translate(${(noClickCount * 20) % 100}px, ${(noClickCount * 15) % 50}px) rotate(${noClickCount * 10}deg)` : 'none'
                }}
              >
                {noClickCount === 0 ? 'Hayır' : 
                 noClickCount === 1 ? 'Emin misin?' :
                 noClickCount === 2 ? 'Gerçekten mi?' :
                 noClickCount === 3 ? 'Son şansın!' :
                 'Yakaladın! 😄'}
              </Button>
            </div>

            {noClickCount > 0 && (
              <p className="text-white text-lg mt-4 animate-bounce">
                Hadi ama! Bu kadar tatlı olmaya devam edemem! 😂
              </p>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    );
  }

  // Fallback
  return <div>Tasarım stili bulunamadı</div>;
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