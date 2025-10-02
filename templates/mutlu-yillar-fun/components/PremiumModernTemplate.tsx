'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PremiumModernTemplateProps {
  recipientName: string;
  mainMessage: string;
  wishMessage?: string;
  footerMessage?: string;
  creatorName?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

function PremiumModernTemplate({
  recipientName,
  mainMessage,
  wishMessage,
  footerMessage,
  creatorName,
  isEditable = false,
  onTextFieldChange
}: PremiumModernTemplateProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([]);
  const [spheres, setSpheres] = useState<Array<{id: number, x: number, y: number, rotation: number}>>([]);

  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localMainMessage, setLocalMainMessage] = useState(mainMessage);
  const [localWishMessage, setLocalWishMessage] = useState(wishMessage || '');
  const [localFooterMessage, setLocalFooterMessage] = useState(footerMessage || '');

  useEffect(() => {
    setLocalRecipientName(recipientName);
    setLocalMainMessage(mainMessage);
    setLocalWishMessage(wishMessage || '');
    setLocalFooterMessage(footerMessage || '');
  }, [recipientName, mainMessage, wishMessage, footerMessage]);

  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'mainMessage') setLocalMainMessage(value);
    else if (key === 'wishMessage') setLocalWishMessage(value);
    else if (key === 'footerMessage') setLocalFooterMessage(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  const displayRecipientName = isEditable ? localRecipientName : recipientName;
  const displayMainMessage = isEditable ? localMainMessage : mainMessage;
  const displayWishMessage = isEditable ? localWishMessage : wishMessage;
  const displayFooterMessage = isEditable ? localFooterMessage : footerMessage;

  useEffect(() => {
    // Create floating golden particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    // Create 3D spheres
    const newSpheres = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      rotation: Math.random() * 360
    }));
    setSpheres(newSpheres);
  }, []);

  const handleCelebrationStart = () => {
    setShowCelebration(true);
    
    // Create explosion effect
    setTimeout(() => {
      const explosionParticles = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1000,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50 + (Math.random() - 0.5) * 60,
        size: Math.random() * 6 + 3,
        delay: Math.random() * 2
      }));
      setParticles(prev => [...prev, ...explosionParticles]);
    }, 500);
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Space Background with Stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Enhanced Golden Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
              boxShadow: `0 0 ${particle.size * 2}px #ffd700, 0 0 ${particle.size * 4}px #ffd700`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              zIndex: 10
            }}
          />
        ))}

        {/* Rotating 3D Spheres */}
        {spheres.map(sphere => (
          <div
            key={sphere.id}
            className="absolute animate-spin"
            style={{
              left: `${sphere.x}%`,
              top: `${sphere.y}%`,
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #4a0e4e, #81007f, #4a0e4e)',
              borderRadius: '50%',
              boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.5), inset 10px 10px 20px rgba(255,255,255,0.1)',
              animationDuration: `${10 + Math.random() * 10}s`,
              transform: `rotate(${sphere.rotation}deg)`,
              zIndex: 5
            }}
          />
        ))}

        {/* Main Content */}
        <div className="relative z-20 text-center space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 max-w-4xl">
          {showCelebration && creatorName && (
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-white break-words" style={{
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

          {/* 3D Metallic Title */}
          <div className="relative">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 animate-pulse break-words"
              style={{
                background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700, #b8860b)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(255, 215, 0, 0.8)',
                animation: 'gradient 3s ease infinite, glow 2s ease-in-out infinite alternate'
              }}
            >
              MUTLU YILLAR
            </h1>
            <div className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold opacity-30 blur-sm break-words"
                 style={{
                   background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   transform: 'translateY(4px)'
                 }}>
              MUTLU YILLAR
            </div>
          </div>

          {showCelebration && (
            <h2
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold mb-4 sm:mb-6 drop-shadow-lg break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
            >
              {displayRecipientName ? `${displayRecipientName}!` : 'Sevgili Dostum!'}
            </h2>
          )}

          {showCelebration && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gold-500/30 shadow-2xl">
              <p
                className={`text-base sm:text-lg md:text-xl lg:text-2xl text-black leading-relaxed font-medium break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent || '')}
              >
                {displayMainMessage}
              </p>
            </div>
          )}

          {showCelebration && displayWishMessage && (
            <div
              className={`text-base sm:text-lg md:text-xl text-white font-semibold animate-pulse drop-shadow-lg bg-black/30 rounded-lg p-4 break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('wishMessage', e.currentTarget.textContent || '')}
            >
              {displayWishMessage}
            </div>
          )}

          {showCelebration && displayFooterMessage && (
            <div
              className={`text-base sm:text-lg text-white font-medium mt-4 sm:mt-6 md:mt-8 drop-shadow-lg bg-black/30 rounded-lg p-4 break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('footerMessage', e.currentTarget.textContent || '')}
            >
              {displayFooterMessage}
            </div>
          )}


        </div>

        <style jsx>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes glow {
            from { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6); }
            to { text-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.8); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Space Background */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Golden Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            boxShadow: `0 0 ${particle.size * 2}px #ffd700`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            zIndex: 5
          }}
        />
      ))}

      {/* Rotating Spheres */}
      {spheres.map(sphere => (
        <div
          key={sphere.id}
          className="absolute animate-spin"
          style={{
            left: `${sphere.x}%`,
            top: `${sphere.y}%`,
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #4a0e4e, #81007f)',
            borderRadius: '50%',
            boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.1)',
            animationDuration: `${15 + Math.random() * 10}s`,
            transform: `rotate(${sphere.rotation}deg)`,
            zIndex: 3
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 max-w-4xl">
        {!showCelebration && (
          <div className="text-center">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 break-words"
              style={{
                background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                animation: 'gradient 3s ease infinite'
              }}
            >
              MUTLU YILLAR
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 break-words" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,1)',
              background: 'rgba(0,0,0,0.8)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,215,0,0.3)',
              backdropFilter: 'blur(5px)'
            }}>
              Kutlamayı başlatmak için butona tıklayın
            </p>
          </div>
        )}

        {showCelebration && creatorName && (
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-white break-words" style={{
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

        {showCelebration && (
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 break-words"
            style={{
              background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
              animation: 'gradient 3s ease infinite'
            }}
          >
            MUTLU YILLAR
          </h1>
        )}

        {showCelebration && (
          <h2
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold mb-4 sm:mb-6 break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
            style={{
              textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,1), 0 0 40px rgba(255,255,255,0.8), 2px 2px 0px rgba(0,0,0,1)',
              background: 'rgba(0,0,0,0.95)',
              padding: '12px 20px',
              borderRadius: '12px',
              border: '3px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {displayRecipientName ? `${displayRecipientName}!` : 'Sevgili Dostum!'}
          </h2>
        )}

        {showCelebration && (
          <div className="backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gold-500/30 shadow-2xl" style={{
            background: 'rgba(0,0,0,0.95)',
            border: '3px solid rgba(255,215,0,0.7)',
            backdropFilter: 'blur(15px)'
          }}>
            <p
              className={`text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-medium break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent || '')}
              style={{
                color: '#ffffff',
                textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 25px rgba(0,0,0,1), 0 0 35px rgba(255,255,255,0.6), 1px 1px 0px rgba(0,0,0,1)'
              }}
            >
              {displayMainMessage}
            </p>
          </div>
        )}

        {showCelebration && displayWishMessage && (
          <div
            className={`text-base sm:text-lg md:text-xl font-semibold animate-pulse rounded-lg p-4 break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('wishMessage', e.currentTarget.textContent || '')}
            style={{
              color: '#ffffff',
              textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,1), 0 0 40px rgba(255,255,255,0.7), 2px 2px 0px rgba(0,0,0,1)',
              background: 'rgba(0,0,0,0.95)',
              border: '2px solid rgba(255,255,255,0.5)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {displayWishMessage}
          </div>
        )}

        {showCelebration && displayFooterMessage && (
          <div
            className={`text-base sm:text-lg font-medium mt-4 sm:mt-6 md:mt-8 rounded-lg p-4 break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('footerMessage', e.currentTarget.textContent || '')}
            style={{
              color: '#ffffff',
              textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,1), 0 0 40px rgba(255,255,255,0.7), 2px 2px 0px rgba(0,0,0,1)',
              background: 'rgba(0,0,0,0.95)',
              border: '2px solid rgba(255,255,255,0.5)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {displayFooterMessage}
          </div>
        )}

        <Button
          onClick={handleCelebrationStart}
          className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-full text-base sm:text-lg md:text-xl transition-all duration-300 shadow-2xl border-2 border-gold-400 relative overflow-hidden group"
          style={{
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            textShadow: '2px 2px 4px rgba(0,0,0,1)'
          }}
        >
          <span className="relative z-10 flex items-center gap-1 sm:gap-2 md:gap-3">
            <span className="text-lg sm:text-xl md:text-2xl">✨</span>
            <span className="break-words">Kutlamayı Başlat</span>
            <span className="text-lg sm:text-xl md:text-2xl">✨</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </Button>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .text-gold-100 { color: #fef3c7; }
        .text-gold-200 { color: #fde68a; }
        .text-gold-300 { color: #fcd34d; }
        .text-gold-400 { color: #fbbf24; }
        .text-gold-500 { color: #f59e0b; }
        .bg-gold-500 { background-color: #f59e0b; }
        .bg-gold-600 { background-color: #d97706; }
        .from-gold-500 { --tw-gradient-from: #f59e0b; }
        .to-gold-600 { --tw-gradient-to: #d97706; }
        .hover\\:from-gold-600:hover { --tw-gradient-from: #d97706; }
        .hover\\:to-gold-700:hover { --tw-gradient-to: #b45309; }
        .border-gold-400 { border-color: #fbbf24; }
        .border-gold-500\\/20 { border-color: rgba(251, 191, 36, 0.2); }
        .border-gold-500\\/30 { border-color: rgba(251, 191, 36, 0.3); }
      `}</style>
    </div>
  );
}

export default PremiumModernTemplate;