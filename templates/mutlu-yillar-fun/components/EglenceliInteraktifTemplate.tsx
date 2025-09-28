'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createAnalyticsTracker } from '@/lib/analytics';

interface EglenceliInteraktifTemplateProps {
  recipientName: string;
  mainMessage: string;
  wishMessage?: string;
  footerMessage?: string;
  creatorName?: string;
  shortId?: string;
}

interface Gift {
  id: number;
  x: number;
  y: number;
  emoji: string;
  points: number;
  collected: boolean;
}

function EglenceliInteraktifTemplate({ 
  recipientName, 
  mainMessage, 
  wishMessage, 
  footerMessage, 
  creatorName,
  shortId
}: EglenceliInteraktifTemplateProps) {
  const analytics = shortId ? createAnalyticsTracker(shortId) : null;
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [snowflakes, setSnowflakes] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);
  const [fireworks, setFireworks] = useState<Array<{id: number, x: number, y: number, color: string}>>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const giftEmojis = ['🎁', '🎀', '🎊', '🎉', '⭐', '💎', '🏆', '🎈', '🍰', '🎂'];
  const fireworkColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];

  useEffect(() => {
    // Create snowflakes
    const newSnowflakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1
    }));
    setSnowflakes(newSnowflakes);
  }, []);

  useEffect(() => {
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted) {
      setGameCompleted(true);
      setShowCelebration(true);
      createFireworks();
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  const startGame = () => {
    analytics?.trackButtonClick('start_game', {
      templateType: 'EglenceliInteraktifTemplate',
      designStyle: 'eglenceli',
      action: 'game_start'
    });
    setGameStarted(true);
    setScore(0);
    setTimeLeft(10);
    setGameCompleted(false);
    createGifts();
  };

  const createGifts = () => {
    const newGifts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // Keep gifts away from edges
      y: Math.random() * 60 + 20,
      emoji: giftEmojis[Math.floor(Math.random() * giftEmojis.length)],
      points: Math.floor(Math.random() * 50) + 10,
      collected: false
    }));
    setGifts(newGifts);
  };

  const collectGift = (giftId: number) => {
    setGifts(prev => prev.map(gift => {
      if (gift.id === giftId && !gift.collected) {
        analytics?.trackButtonClick('collect_gift', {
          templateType: 'EglenceliInteraktifTemplate',
          designStyle: 'eglenceli',
          action: 'gift_collected',
          giftEmoji: gift.emoji,
          giftPoints: gift.points,
          currentScore: score
        });
        setScore(prevScore => prevScore + gift.points);
        return { ...gift, collected: true };
      }
      return gift;
    }));
  };

  const createFireworks = () => {
    const newFireworks = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)]
    }));
    setFireworks(newFireworks);
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        </div>

        {/* Snowflakes */}
        {snowflakes.map(flake => (
          <div
            key={flake.id}
            className="absolute text-white animate-bounce opacity-70"
            style={{
              left: `${flake.x}%`,
              top: `${flake.y}%`,
              fontSize: `${flake.size}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${flake.speed + 2}s`,
              transform: `translateY(${Math.sin(Date.now() * 0.001 + flake.id) * 20}px)`
            }}
          >
            ❄️
          </div>
        ))}

        {/* Fireworks */}
        {fireworks.map(firework => (
          <div
            key={firework.id}
            className="absolute animate-ping"
            style={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
              width: '20px',
              height: '20px',
              background: `radial-gradient(circle, ${firework.color}, transparent)`,
              borderRadius: '50%',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: '2s'
            }}
          />
        ))}

        {/* Main Content */}
        <div className="relative z-20 text-center space-y-8 p-8 max-w-4xl">
          {creatorName && (
            <div className="text-center mb-6">
              <p className="text-sm text-purple-300/70" style={{
                textShadow: '2px 2px 4px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,1)',
                background: 'rgba(0,0,0,0.8)',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(147,51,234,0.5)',
                backdropFilter: 'blur(5px)'
              }}>
                Hazırlayan: {creatorName}
              </p>
            </div>
          )}

          {/* Game Results */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="text-6xl mb-6">🎉</div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-pulse">
              MUTLU YILLAR!
            </h1>

            <h2 className="text-2xl md:text-4xl text-white mb-8 font-bold">
              {recipientName ? `${recipientName}` : '2025'}
            </h2>

            {/* Score Display */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-8 shadow-lg" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,1)'
            }}>
              <div className="text-3xl font-bold mb-2">🏆 OYUN TAMAMLANDI! 🏆</div>
              <div className="text-2xl font-bold">Skorun: {score} Puan!</div>
              <div className="text-lg mt-2">
                {score >= 500 ? "🌟 Muhteşem! Hediye Avcısısın!" :
                 score >= 300 ? "🎯 Harika! Çok İyi Oynadın!" :
                 score >= 150 ? "👍 İyi! Güzel Bir Skor!" :
                 "😊 Güzel Deneme! Tekrar Oyna!"}
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl mb-8">
              <p className="text-lg md:text-xl text-white leading-relaxed">
                "{mainMessage}"
              </p>
            </div>

            <div className="text-2xl md:text-3xl text-yellow-300 animate-bounce font-bold">
              🎊 Yeni Yılın Kutlu Olsun! 🎊
            </div>
          </div>

          {wishMessage && (
            <div className="text-lg md:text-xl text-purple-200">
              {wishMessage}
            </div>
          )}

          {footerMessage && (
            <div className="text-lg text-pink-300 mt-8">
              {footerMessage}
            </div>
          )}

          {/* Play Again Button */}
          <Button
            onClick={() => {
              setShowCelebration(false);
              setGameStarted(false);
              setGameCompleted(false);
              setFireworks([]);
            }}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-xl"
          >
            🎮 Tekrar Oyna 🎮
          </Button>
        </div>
      </div>
    );
  }

  if (gameStarted && !gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative overflow-hidden">
        {/* Game UI */}
        <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-white font-bold text-xl">
            ⏰ {timeLeft}s
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-white font-bold text-xl">
            🏆 {score} Puan
          </div>
        </div>

        {/* Snowflakes */}
        {snowflakes.map(flake => (
          <div
            key={flake.id}
            className="absolute text-white animate-pulse opacity-50"
            style={{
              left: `${flake.x}%`,
              top: `${flake.y}%`,
              fontSize: `${flake.size}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${flake.speed + 1}s`,
              transform: `translateY(${Math.sin(Date.now() * 0.002 + flake.id) * 30}px)`
            }}
          >
            ❄️
          </div>
        ))}

        {/* Gifts */}
        {gifts.map(gift => (
          !gift.collected && (
            <button
              key={gift.id}
              onClick={() => collectGift(gift.id)}
              className="absolute text-4xl hover:text-5xl transition-all duration-200 hover:animate-bounce cursor-pointer z-20 transform hover:scale-110"
              style={{
                left: `${gift.x}%`,
                top: `${gift.y}%`,
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))',
                animation: `float ${2 + Math.random()}s ease-in-out infinite`
              }}
            >
              {gift.emoji}
            </button>
          )
        ))}

        {/* Game Instructions */}
        <div className="absolute bottom-4 left-4 right-4 z-30 text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-white">
            <div className="text-lg font-bold mb-2">🎯 Hediye Avı Oyunu</div>
            <div className="text-sm">Hediyeleri topla ve puan kazan! Süre dolmadan önce mümkün olduğunca çok hediye topla!</div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      </div>

      {/* Snowflakes */}
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute text-white animate-pulse opacity-30"
          style={{
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            fontSize: `${flake.size}px`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${flake.speed + 3}s`,
            transform: `translateY(${Math.sin(Date.now() * 0.001 + flake.id) * 15}px)`
          }}
        >
          ❄️
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 p-8 max-w-4xl">
        {creatorName && (
          <div className="text-center mb-6">
            <p className="text-sm text-purple-300/70" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,1)',
              background: 'rgba(0,0,0,0.8)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(147,51,234,0.5)',
              backdropFilter: 'blur(5px)'
            }}>
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}

        {/* Welcome Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="text-6xl mb-6 animate-bounce">🎮</div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
            Mutlu Yıllar
          </h1>

          <h2 className="text-xl md:text-3xl text-white mb-6 font-bold">
            {recipientName ? `${recipientName}` : '2025'}
          </h2>

          <div className="bg-white/10 p-6 rounded-2xl mb-8">
            <p className="text-lg md:text-xl text-white leading-relaxed">
              {mainMessage}
            </p>
          </div>

          {/* Game Description */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-2xl mb-8 border border-white/10">
            <div className="text-2xl mb-4">🎯 Hediye Avı Oyunu</div>
            <p className="text-white/90 mb-4">
              Yeni yıl kutlaması için özel bir oyun hazırladım! 10 saniye içinde mümkün olduğunca çok hediye topla ve yüksek skor yap!
            </p>
            <div className="text-sm text-white/70">
              🎁 Her hediye farklı puan değerinde • ⏰ 10 saniye süren • 🏆 Skor tabanlı
            </div>
          </div>

          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-12 py-6 rounded-full text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <span className="flex items-center gap-3">
              🎮 Oyunu Başlat 🎮
            </span>
          </Button>
        </div>

        {wishMessage && (
          <div className="text-lg md:text-xl text-purple-200">
            {wishMessage}
          </div>
        )}

        {footerMessage && (
          <div className="text-lg text-pink-300 mt-8">
            {footerMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default EglenceliInteraktifTemplate;