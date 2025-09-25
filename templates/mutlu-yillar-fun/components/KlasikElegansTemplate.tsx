'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface KlasikElegansTemplateProps {
  recipientName: string;
  mainMessage: string;
  wishMessage?: string;
  footerMessage?: string;
  creatorName?: string;
}

function KlasikElegansTemplate({ 
  recipientName, 
  mainMessage, 
  wishMessage, 
  footerMessage, 
  creatorName 
}: KlasikElegansTemplateProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([]);
  const [goldLines, setGoldLines] = useState<Array<{id: number, rotation: number, opacity: number}>>([]);

  useEffect(() => {
    // Create champagne bubbles
    const newBubbles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 3
    }));
    setBubbles(newBubbles);

    // Create golden geometric lines
    const newGoldLines = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      rotation: i * 30,
      opacity: 0.3 + Math.random() * 0.4
    }));
    setGoldLines(newGoldLines);
  }, []);

  const handleChampagneClick = () => {
    setShowCelebration(true);
    
    // Create more bubbles for celebration
    setTimeout(() => {
      const celebrationBubbles = Array.from({ length: 60 }, (_, i) => ({
        id: i + 1000,
        x: Math.random() * 100,
        y: 100 + Math.random() * 30,
        size: Math.random() * 12 + 6,
        delay: Math.random() * 2
      }));
      setBubbles(prev => [...prev, ...celebrationBubbles]);
    }, 300);
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Art Deco Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #ffd700 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #ffd700 2px, transparent 2px),
              linear-gradient(45deg, transparent 48%, #ffd700 49%, #ffd700 51%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, #ffd700 49%, #ffd700 51%, transparent 52%)
            `,
            backgroundSize: '60px 60px, 60px 60px, 40px 40px, 40px 40px'
          }} />
        </div>

        {/* Golden Geometric Lines */}
        {goldLines.map(line => (
          <div
            key={line.id}
            className="absolute animate-pulse"
            style={{
              left: '50%',
              top: '50%',
              width: '200px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
              transform: `translate(-50%, -50%) rotate(${line.rotation}deg)`,
              opacity: line.opacity,
              animationDelay: `${line.id * 0.2}s`,
              animationDuration: '3s'
            }}
          />
        ))}

        {/* Champagne Bubbles */}
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="absolute rounded-full animate-bounce"
            style={{
              left: `${bubble.x}%`,
              bottom: `${bubble.y - 100}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 215, 0, 0.3))',
              boxShadow: `0 0 ${bubble.size}px rgba(255, 215, 0, 0.4), inset 0 0 ${bubble.size/2}px rgba(255, 255, 255, 0.3)`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              transform: `translateY(-${Math.random() * 200 + 100}px)`,
              zIndex: 10
            }}
          />
        ))}

        {/* Main Content */}
        <div className="relative z-20 text-center space-y-8 p-8 max-w-4xl">
          {creatorName && (
            <div className="text-center mb-6">
              <p className="text-sm text-white font-serif drop-shadow-lg bg-black/50 rounded px-3 py-1">
                Hazırlayan: {creatorName}
              </p>
            </div>
          )}

          {/* Art Deco Frame */}
          <div className="relative border-4 border-gold-400 p-12 bg-white/95 backdrop-blur-sm shadow-2xl">
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold-400 transform -translate-x-2 -translate-y-2"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold-400 transform translate-x-2 -translate-y-2"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold-400 transform -translate-x-2 translate-y-2"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold-400 transform translate-x-2 translate-y-2"></div>

            {/* Calligraphic Title */}
            <h1 className="text-5xl md:text-7xl font-serif mb-8 text-black relative">
              <span style={{
                fontFamily: 'serif',
                fontWeight: 'bold',
                letterSpacing: '0.1em'
              }}>
                Mutlu Yıllar
              </span>
            </h1>

            <h2 className="text-2xl md:text-4xl text-black mb-8 font-serif font-bold">
              {recipientName ? `${recipientName}` : 'Sevgili Dostum'}
            </h2>

            {showCelebration && (
              <div className="border-t border-b border-gold-400/70 py-6 mb-8">
                <p className="text-lg md:text-xl text-black leading-relaxed font-serif italic font-medium bg-white/90 rounded-lg p-4">
                  "{mainMessage}"
                </p>
              </div>
            )}

            {/* Laser Effect Message */}
            <div className="text-2xl md:text-3xl text-black animate-pulse font-serif font-bold">
              Yeni Yılınız Kutlu Olsun
            </div>
          </div>

          {showCelebration && wishMessage && (
            <div className="text-lg md:text-xl text-white font-serif italic font-semibold drop-shadow-lg bg-black/50 rounded-lg p-4">
              {wishMessage}
            </div>
          )}

          {showCelebration && footerMessage && (
            <div className="text-lg text-white mt-8 font-serif font-medium drop-shadow-lg bg-black/50 rounded-lg p-4">
              {footerMessage}
            </div>
          )}


        </div>

        <style jsx>{`
          .text-gold-100 { color: #fef3c7; }
          .text-gold-200 { color: #fde68a; }
          .text-gold-300 { color: #fcd34d; }
          .text-gold-400 { color: #fbbf24; }
          .text-gold-500 { color: #f59e0b; }
          .border-gold-400 { border-color: #fbbf24; }
          .border-gold-400\\/50 { border-color: rgba(251, 191, 36, 0.5); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Art Deco Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #ffd700 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #ffd700 1px, transparent 1px),
            linear-gradient(45deg, transparent 49%, #ffd700 50%, #ffd700 51%, transparent 52%),
            linear-gradient(-45deg, transparent 49%, #ffd700 50%, #ffd700 51%, transparent 52%)
          `,
          backgroundSize: '80px 80px, 80px 80px, 60px 60px, 60px 60px'
        }} />
      </div>

      {/* Subtle Golden Lines */}
      {goldLines.map(line => (
        <div
          key={line.id}
          className="absolute animate-pulse"
          style={{
            left: '50%',
            top: '50%',
            width: '150px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
            transform: `translate(-50%, -50%) rotate(${line.rotation}deg)`,
            opacity: line.opacity * 0.5,
            animationDelay: `${line.id * 0.3}s`,
            animationDuration: '4s'
          }}
        />
      ))}

      {/* Floating Bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${bubble.x}%`,
            bottom: `${bubble.y - 100}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 215, 0, 0.1))',
            boxShadow: `0 0 ${bubble.size/2}px rgba(255, 215, 0, 0.2)`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${5 + Math.random() * 3}s`,
            transform: `translateY(-${Math.random() * 100 + 50}px)`,
            zIndex: 5
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 p-8 max-w-4xl">
        {creatorName && (
          <div className="text-center mb-6">
            <p className="text-sm text-white font-serif" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,1)',
              background: 'rgba(0,0,0,0.8)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(255,215,0,0.3)',
              backdropFilter: 'blur(5px)'
            }}>
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}

        {/* Golden Frame */}
        <div className="relative border-2 border-gold-400/60 p-10 bg-black/40 backdrop-blur-sm">
          {/* Art Deco Corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-400 transform -translate-x-1 -translate-y-1"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold-400 transform translate-x-1 -translate-y-1"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold-400 transform -translate-x-1 translate-y-1"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-400 transform translate-x-1 translate-y-1"></div>

          <h1 className="text-4xl md:text-6xl font-serif mb-6 text-white" style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(255,215,0,0.6)',
            letterSpacing: '0.05em'
          }}>
            Mutlu Yıllar
          </h1>

          <h2 className="text-xl md:text-3xl text-white mb-6 font-serif font-bold" style={{
            textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,1), 0 0 40px rgba(255,215,0,0.8), 2px 2px 0px rgba(0,0,0,1)',
            background: 'rgba(0,0,0,0.95)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '3px solid rgba(255,215,0,0.7)',
            backdropFilter: 'blur(10px)'
          }}>
            {recipientName ? `${recipientName}` : 'Sevgili Dostum'}
          </h2>

          {showCelebration && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/30 shadow-2xl" style={{
              background: 'rgba(255,255,255,0.95)',
              border: '3px solid rgba(255,215,0,0.7)',
              backdropFilter: 'blur(15px)'
            }}>
              <p className="text-lg md:text-xl text-black leading-relaxed font-serif font-medium">
                {mainMessage}
              </p>
            </div>
          )}

          <Button
            onClick={handleChampagneClick}
            className="bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white font-serif font-bold px-10 py-4 rounded-none text-lg transition-all duration-300 shadow-xl border border-gold-400 relative overflow-hidden group"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,1)'
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              ✨ Kutlamayı Başlat ✨
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .text-gold-100 { color: #fef3c7; }
        .text-gold-200 { color: #fde68a; }
        .text-gold-300 { color: #fcd34d; }
        .text-gold-400 { color: #fbbf24; }
        .text-gold-500 { color: #f59e0b; }
        .text-gold-600 { color: #d97706; }
        .text-gold-700 { color: #b45309; }
        .bg-gold-600 { background-color: #d97706; }
        .bg-gold-700 { background-color: #b45309; }
        .bg-gold-800 { background-color: #92400e; }
        .from-gold-600 { --tw-gradient-from: #d97706; }
        .to-gold-700 { --tw-gradient-to: #b45309; }
        .hover\\:from-gold-700:hover { --tw-gradient-from: #b45309; }
        .hover\\:to-gold-800:hover { --tw-gradient-to: #92400e; }
        .border-gold-400 { border-color: #fbbf24; }
        .border-gold-400\\/30 { border-color: rgba(251, 191, 36, 0.3); }
        .border-gold-400\\/60 { border-color: rgba(251, 191, 36, 0.6); }
      `}</style>
    </div>
  );
}

export default KlasikElegansTemplate;