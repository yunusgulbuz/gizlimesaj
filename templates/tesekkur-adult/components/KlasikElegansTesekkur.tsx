'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface KlasikElegansTesekkurProps {
  recipientName: string;
  message: string;
  creatorName?: string;
}

function KlasikElegansTesekkur({ recipientName, message, creatorName }: KlasikElegansTesekkurProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Create initial champagne bubbles
    const initialBubbles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 3
    }));
    setBubbles(initialBubbles);
  }, []);

  const handleChampagneClick = () => {
    setShowCelebration(true);
    
    // Create more bubbles
    const newBubbles = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1000,
      x: Math.random() * 100,
      y: 100,
      size: Math.random() * 12 + 6,
      delay: Math.random() * 2
    }));
    
    setBubbles(prev => [...prev, ...newBubbles]);
    
    // Show laser message effect
    setTimeout(() => {
      setShowMessage(true);
    }, 1000);
  };

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

      {/* Golden Frame */}
      <div className="absolute inset-8 border-4 border-yellow-400 rounded-lg opacity-30" style={{
        background: 'linear-gradient(45deg, transparent 48%, rgba(255, 215, 0, 0.1) 49%, rgba(255, 215, 0, 0.1) 51%, transparent 52%)'
      }} />

      {/* Champagne Bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-t from-yellow-200 to-white opacity-70"
          style={{
            left: `${bubble.x}%`,
            bottom: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animation: `bubbleRise ${3 + Math.random() * 4}s ease-out infinite`,
            animationDelay: `${bubble.delay}s`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), inset 0 0 5px rgba(255, 215, 0, 0.3)'
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl">
        {/* Art Deco Title */}
        <div className="mb-12 relative">
          {/* Geometric decorations */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          
          <h1 className="text-6xl md:text-8xl font-serif text-yellow-400 mb-4 relative" style={{
            fontFamily: 'Georgia, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255, 215, 0, 0.5)',
            background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            TEŞEKKÜRLER
          </h1>
          
          {/* Geometric decorations bottom */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          
          <div className="text-2xl md:text-3xl text-yellow-200 font-serif italic mt-6">
            {recipientName}
          </div>
        </div>

        {/* Message in elegant frame */}
        <div className="mb-12 relative">
          <div className="p-8 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-sm rounded-lg border-2 border-yellow-400/30 relative">
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400" />
            
            <p className="text-xl md:text-2xl text-yellow-100 leading-relaxed font-serif">
              {message}
            </p>
            {creatorName && (
              <p className="text-lg text-yellow-300 mt-6 italic font-serif">
                — {creatorName}
              </p>
            )}
          </div>
        </div>

        {/* Laser Message Effect */}
        {showMessage && (
          <div className="mb-8 animate-pulse">
            <p className="text-3xl md:text-4xl text-yellow-400 font-serif" style={{
              textShadow: '0 0 20px #ffd700, 0 0 40px #ffd700',
              animation: 'laserGlow 2s ease-in-out infinite'
            }}>
              Minnettarlığımız Sonsuz!
            </p>
          </div>
        )}

        {/* Champagne Button */}
        <Button
          onClick={handleChampagneClick}
          className="px-12 py-6 text-xl font-serif bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 hover:from-yellow-500 hover:via-yellow-300 hover:to-yellow-500 text-black rounded-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
          style={{
            boxShadow: showCelebration 
              ? '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)' 
              : '0 0 15px rgba(255, 215, 0, 0.3)',
            border: '2px solid #ffd700'
          }}
        >
          <span className="relative z-10">Minnettarlık Ölçüsü</span>
          {showCelebration && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          )}
        </Button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes bubbleRise {
          0% { 
            transform: translateY(0) scale(1); 
            opacity: 0.7; 
          }
          50% { 
            transform: translateY(-50vh) scale(1.2); 
            opacity: 0.9; 
          }
          100% { 
            transform: translateY(-100vh) scale(0.8); 
            opacity: 0; 
          }
        }
        
        @keyframes laserGlow {
          0%, 100% { 
            text-shadow: 0 0 20px #ffd700, 0 0 40px #ffd700; 
          }
          50% { 
            text-shadow: 0 0 30px #ffd700, 0 0 60px #ffd700, 0 0 80px #ffd700; 
          }
        }
      `}</style>
    </div>
  );
}

export default KlasikElegansTesekkur;