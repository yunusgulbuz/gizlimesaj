'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { TemplateTextFields } from '../../shared/types';
import { createAnalyticsTracker } from '@/lib/analytics';

function EvlilikTeklifiTemplate({ recipientName, message, designStyle, creatorName, textFields = {}, shortId }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
  textFields?: TemplateTextFields;
  shortId?: string;
}) {
  const [showQuestion, setShowQuestion] = useState(true);
  const [noClickCount, setNoClickCount] = useState(0);
  const [showParty, setShowParty] = useState(false);
  const [confetti, setConfetti] = useState<Array<{id: number, x: number, y: number, color: string, size: number}>>([]);
  const [animationElements, setAnimationElements] = useState<Array<{id: number, left: number, top: number, delay: number}>>([]);
  const [funAnimationElements, setFunAnimationElements] = useState<Array<{id: number, left: number, top: number, delay: number, emoji: string}>>([]);
  const [isClient, setIsClient] = useState(false);

  // Generate animation elements only on client-side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setAnimationElements(elements);

    const funElements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      emoji: ['💖', '⭐', '✨', '💫'][Math.floor(Math.random() * 4)]
    }));
    setFunAnimationElements(funElements);
  }, []);

  // Initialize analytics tracker
  const analytics = shortId ? createAnalyticsTracker(shortId) : null;

  const handleNoClick = () => {
    if (designStyle === 'eglenceli') {
      setNoClickCount(prev => prev + 1);
      // Buton kaçma efekti için state güncellemesi
    }
    
    // Track "Hayır" button click
    analytics?.trackButtonClick('no_button', {
      templateType: 'evlilik-teklifi',
      designStyle: designStyle,
      action: 'reject_proposal',
      clickCount: noClickCount + 1
    });
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
    
    // Track "Evet" button click
    analytics?.trackButtonClick('yes_button', {
      templateType: 'evlilik-teklifi',
      designStyle: designStyle,
      action: 'accept_proposal',
      noClickCount: noClickCount,
      finalChoice: 'yes'
    });
  };

  // Modern Stil
  if (designStyle === 'modern') {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #fef3c7 100%)'
      }}>
        {/* Altın toz efekti */}
        <div className="absolute inset-0">
          {isClient && animationElements.map((element) => (
            <div
              key={element.id}
              className="absolute animate-pulse"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
                animationDelay: `${element.delay}s`
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
              <h1 contentEditable="true" className="text-5xl md:text-7xl font-serif text-yellow-100 mb-6 tracking-wide">
                {recipientName ? `${recipientName},` : 'Aşkım,'}
              </h1>
              <h2 contentEditable="true" className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight">
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
          {confetti.map((piece, index) => (
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
                animationDelay: `${(index * 0.1) % 2}s`
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
          {isClient && funAnimationElements.map((element) => (
            <div
              key={element.id}
              className="absolute animate-pulse"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
                animationDelay: `${element.delay}s`
              }}
            >
              <span className="text-2xl opacity-30">
                {element.emoji}
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

export default EvlilikTeklifiTemplate;
