'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface EglenceliInteraktifTesekkurProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

interface Gift {
  id: number;
  x: number;
  y: number;
  caught: boolean;
  emoji: string;
}

function EglenceliInteraktifTesekkur({ recipientName, message, creatorName, isEditable = false, onTextFieldChange }: EglenceliInteraktifTesekkurProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [snowflakes, setSnowflakes] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  const [fireworks, setFireworks] = useState<Array<{id: number, x: number, y: number}>>([]);

  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localMessage, setLocalMessage] = useState(message);
  const [localCreatorName, setLocalCreatorName] = useState(creatorName || '');

  const giftEmojis = ['🎁', '🎀', '🎊', '🎉', '💝', '🎈', '🌟', '✨'];

  // Initialize local state from props
  useEffect(() => {
    setLocalRecipientName(recipientName);
    setLocalMessage(message);
    setLocalCreatorName(creatorName || '');
  }, [recipientName, message, creatorName]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'message') setLocalMessage(value);
    else if (key === 'creatorName') setLocalCreatorName(value);

    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  // Get display values
  const displayRecipientName = isEditable ? localRecipientName : recipientName;
  const displayMessage = isEditable ? localMessage : message;
  const displayCreatorName = isEditable ? localCreatorName : creatorName;

  useEffect(() => {
    // Create snowflakes
    const newSnowflakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 4
    }));
    setSnowflakes(newSnowflakes);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameCompleted(false);
    
    // Create gifts
    const newGifts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      caught: false,
      emoji: giftEmojis[Math.floor(Math.random() * giftEmojis.length)]
    }));
    setGifts(newGifts);
  };

  const catchGift = useCallback((giftId: number) => {
    setGifts(prev => prev.map(gift => 
      gift.id === giftId ? { ...gift, caught: true } : gift
    ));
    
    setScore(prev => {
      const newScore = prev + 1;
      if (newScore >= 10) {
        setGameCompleted(true);
        // Create fireworks
        const newFireworks = Array.from({ length: 12 }, (_, i) => ({
          id: i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20
        }));
        setFireworks(newFireworks);
      }
      return newScore;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-400 to-purple-500 relative overflow-hidden flex items-center justify-center">
      {/* Animated Christmas Tree */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-6xl animate-pulse">
        🎄
      </div>

      {/* Snowflakes */}
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute text-white animate-bounce"
          style={{
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            fontSize: `${flake.size}px`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          <span className="text-xs sm:text-sm md:text-base">❄️</span>
        </div>
      ))}

      {/* Fireworks */}
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="absolute text-4xl animate-ping"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
            animationDuration: '1s'
          }}
        >
          🎆
        </div>
      ))}

      {/* Flying Gift Boxes (when not in game) */}
      {!gameStarted && (
        <>
          <div className="absolute top-20 left-10 text-3xl animate-bounce" style={{animationDelay: '0s'}}>🎁</div>
          <div className="absolute top-32 right-20 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>🎀</div>
          <div className="absolute bottom-40 left-20 text-3xl animate-bounce" style={{animationDelay: '1s'}}>🎊</div>
          <div className="absolute bottom-20 right-10 text-2xl animate-bounce" style={{animationDelay: '1.5s'}}>🎉</div>
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center p-4 sm:p-6 md:p-8 max-w-4xl">
        {/* Title with Balloons */}
        <div className="mb-6 sm:mb-8 relative">
          <div className="absolute -top-3 sm:-top-4 -left-2 sm:-left-4 text-2xl sm:text-3xl animate-bounce">🎈</div>
          <div className="absolute -top-3 sm:-top-4 -right-2 sm:-right-4 text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>🎈</div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 text-white break-words" style={{
            fontFamily: 'Comic Sans MS, cursive',
            textShadow: '4px 4px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.3)',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'rainbow 3s ease-in-out infinite'
          }}>
            TEŞEKKÜRLER!
          </h1>

          <div
            className={`text-xl sm:text-2xl md:text-3xl text-yellow-200 font-bold break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            style={{
              fontFamily: 'Comic Sans MS, cursive',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
          >
            {displayRecipientName}
          </div>
        </div>

        {/* Game Area */}
        {gameStarted && !gameCompleted && (
          <div className="mb-6 sm:mb-8">
            <div className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6" style={{
              fontFamily: 'Comic Sans MS, cursive',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Hediye Sayısı: {score}/10
            </div>

            {/* Interactive Gifts */}
            <div className="relative h-48 sm:h-56 md:h-64 mb-4">
              {gifts.filter(gift => !gift.caught).map(gift => (
                <button
                  key={gift.id}
                  onClick={() => catchGift(gift.id)}
                  className="absolute text-2xl sm:text-3xl md:text-4xl hover:scale-125 transition-transform duration-200 animate-pulse cursor-pointer"
                  style={{
                    left: `${gift.x}%`,
                    top: `${gift.y}%`,
                    animation: `float 2s ease-in-out infinite`,
                    animationDelay: `${gift.id * 0.2}s`
                  }}
                >
                  {gift.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Completed */}
        {gameCompleted && (
          <div className="mb-6 sm:mb-8 animate-bounce">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-300 mb-4 break-words" style={{
              fontFamily: 'Comic Sans MS, cursive',
              textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
              animation: 'celebration 2s ease-in-out infinite'
            }}>
              🎉 TEBRIKLER! 🎉
            </h2>
            <p className="text-xl sm:text-2xl text-white font-bold break-words" style={{
              fontFamily: 'Comic Sans MS, cursive',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Minnettarlığımız Sonsuz!
            </p>
          </div>
        )}

        {/* Message */}
        {!gameStarted && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white/20 backdrop-blur-sm rounded-3xl border-4 border-yellow-300 relative">
            <div className="absolute -top-2 -left-2 text-xl sm:text-2xl">🌟</div>
            <div className="absolute -top-2 -right-2 text-xl sm:text-2xl">🌟</div>
            <div className="absolute -bottom-2 -left-2 text-xl sm:text-2xl">✨</div>
            <div className="absolute -bottom-2 -right-2 text-xl sm:text-2xl">✨</div>

            <p
              className={`text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed font-bold break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              style={{
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('message', e.currentTarget.textContent || '')}
            >
              {displayMessage}
            </p>
            {displayCreatorName && (
              <p
                className={`text-sm sm:text-base md:text-lg text-yellow-200 mt-4 font-bold break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                style={{
                  fontFamily: 'Comic Sans MS, cursive',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('creatorName', e.currentTarget.textContent || '')}
              >
                — {displayCreatorName}
              </p>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={startGame}
          disabled={gameStarted && !gameCompleted}
          className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 text-white rounded-full transition-all duration-300 transform hover:scale-110 relative overflow-hidden"
          style={{
            fontFamily: 'Comic Sans MS, cursive',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)',
            border: '4px solid #fff',
            animation: gameStarted && !gameCompleted ? 'none' : 'wiggle 2s ease-in-out infinite'
          }}
        >
          <span className="relative z-10 break-words">
            {gameCompleted ? '🎉 Tekrar Oyna! 🎉' : gameStarted ? 'Oyun Devam Ediyor...' : '🎁 Hediye Avını Başlat! 🎁'}
          </span>
          {!gameStarted && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          )}
        </Button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes rainbow {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(180deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes celebration {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-2deg); }
          75% { transform: scale(1.1) rotate(2deg); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
}

export default EglenceliInteraktifTesekkur;