'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

function EglenceliSeniSeviyorumTemplate({ recipientName, message, creatorName }: {
  recipientName: string;
  message: string;
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

        <div className="relative z-10 text-center space-y-6 p-8">
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

export default EglenceliSeniSeviyorumTemplate;
