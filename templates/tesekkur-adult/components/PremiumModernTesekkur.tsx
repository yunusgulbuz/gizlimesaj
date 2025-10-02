'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PremiumModernTesekkurProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

function PremiumModernTesekkur({ recipientName, message, creatorName, isEditable = false, onTextFieldChange }: PremiumModernTesekkurProps) {
  const [showExplosion, setShowExplosion] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([]);
  const [spheres, setSpheres] = useState<Array<{id: number, x: number, y: number, rotation: number}>>([]);

  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localMessage, setLocalMessage] = useState(message);
  const [localCreatorName, setLocalCreatorName] = useState(creatorName || '');

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
    // Create floating 3D spheres
    const newSpheres = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360
    }));
    setSpheres(newSpheres);

    // Create initial golden particles
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));
    setParticles(initialParticles);
  }, []);

  const handleCelebrationStart = () => {
    setShowExplosion(true);
    
    // Create explosion particles
    const explosionParticles = Array.from({ length: 200 }, (_, i) => ({
      id: i + 1000,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50 + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8
    }));
    
    setParticles(prev => [...prev, ...explosionParticles]);
    
    setTimeout(() => {
      setShowExplosion(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Space background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-black opacity-90" />
      
      {/* Floating 3D Spheres */}
      {spheres.map(sphere => (
        <div
          key={sphere.id}
          className="absolute w-16 h-16 rounded-full opacity-20"
          style={{
            left: `${sphere.x}%`,
            top: `${sphere.y}%`,
            background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)',
            animation: `float 6s ease-in-out infinite, rotate 8s linear infinite`,
            animationDelay: `${sphere.id * 0.5}s`,
            transform: `rotate(${sphere.rotation}deg)`,
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Golden Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-yellow-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: '0 0 6px #ffd700, 0 0 12px #ffd700',
            animation: showExplosion && particle.id >= 1000 
              ? `explode 3s ease-out forwards` 
              : `orbit 10s linear infinite`,
            animationDelay: `${particle.id * 0.01}s`
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center p-4 sm:p-6 md:p-8 max-w-4xl">
        {/* 3D Title */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1
            className={`text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 transition-all duration-1000 break-words ${
              showExplosion
                ? 'animate-pulse scale-110 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400'
            }`}
            style={{
              textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
            }}
          >
            TEŞEKKÜRLER
          </h1>

          <div
            className={`text-xl sm:text-2xl md:text-3xl text-yellow-200 font-light break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
          >
            {displayRecipientName}
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 sm:mb-10 md:mb-12 p-4 sm:p-6 md:p-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-400/20">
          <p
            className={`text-base sm:text-lg md:text-xl lg:text-2xl text-yellow-100 leading-relaxed font-light break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('message', e.currentTarget.textContent || '')}
          >
            {displayMessage}
          </p>
          {displayCreatorName && (
            <p
              className={`text-sm sm:text-base md:text-lg text-yellow-300 mt-4 sm:mt-6 italic break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('creatorName', e.currentTarget.textContent || '')}
            >
              - {displayCreatorName}
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={handleCelebrationStart}
          className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black rounded-full transition-all duration-300 transform hover:scale-105"
          style={{
            boxShadow: showExplosion
              ? '0 0 50px rgba(255, 215, 0, 1), 0 0 100px rgba(255, 215, 0, 0.5)'
              : '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.2)',
            animation: showExplosion ? 'pulse 0.5s ease-in-out infinite' : 'none'
          }}
        >
          Kutlamayı Başlat
        </Button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbit {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(90deg); }
          50% { transform: translate(0, -20px) rotate(180deg); }
          75% { transform: translate(-10px, -10px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes explode {
          0% { 
            transform: translate(0, 0) scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: translate(var(--random-x, 200px), var(--random-y, 200px)) scale(0); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
}

export default PremiumModernTesekkur;