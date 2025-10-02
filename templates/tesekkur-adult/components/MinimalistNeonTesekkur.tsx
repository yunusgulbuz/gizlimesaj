'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface MinimalistNeonTesekkurProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

function MinimalistNeonTesekkur({ recipientName, message, creatorName, isEditable = false, onTextFieldChange }: MinimalistNeonTesekkurProps) {
  const [showLaser, setShowLaser] = useState(false);
  const [gridLines, setGridLines] = useState<Array<{id: number, x: number, y: number, direction: 'horizontal' | 'vertical'}>>([]);
  const [neonPulse, setNeonPulse] = useState(false);

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
    // Create grid lines
    const lines = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      direction: Math.random() > 0.5 ? 'horizontal' : 'vertical' as 'horizontal' | 'vertical'
    }));
    setGridLines(lines);

    // Start neon pulsing
    const interval = setInterval(() => {
      setNeonPulse(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleNeonEnter = () => {
    setShowLaser(true);
    
    setTimeout(() => {
      setShowLaser(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-20">
        {gridLines.map(line => (
          <div
            key={line.id}
            className={`absolute ${line.direction === 'horizontal' ? 'w-full h-px' : 'w-px h-full'}`}
            style={{
              left: line.direction === 'horizontal' ? '0' : `${line.x}%`,
              top: line.direction === 'vertical' ? '0' : `${line.y}%`,
              background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
              animation: `gridMove 8s linear infinite`,
              animationDelay: `${line.id * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Neon Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridSlide 10s linear infinite'
      }} />

      {/* Main Content */}
      <div className="relative z-10 text-center p-4 sm:p-6 md:p-8 max-w-4xl">
        {/* Neon Title */}
        <div className="mb-8 sm:mb-10 md:mb-12 relative">
          <h1
            className={`text-4xl sm:text-6xl md:text-8xl font-thin mb-4 sm:mb-6 transition-all duration-500 break-words ${
              neonPulse ? 'text-cyan-300' : 'text-cyan-400'
            }`}
            style={{
              fontFamily: 'monospace',
              textShadow: neonPulse
                ? '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff'
                : '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff',
              letterSpacing: '0.1em',
              animation: 'neonFlicker 3s ease-in-out infinite'
            }}
          >
            TEŞEKKÜRLER
          </h1>

          {/* Neon underline */}
          <div
            className="mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{
              width: '60%',
              boxShadow: '0 0 10px #00ffff',
              animation: 'neonGlow 2s ease-in-out infinite alternate'
            }}
          />

          <div
            className={`text-xl sm:text-2xl md:text-3xl text-pink-400 font-thin mt-4 sm:mt-6 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            style={{
              fontFamily: 'monospace',
              textShadow: '0 0 10px #ff1493, 0 0 20px #ff1493',
              letterSpacing: '0.05em'
            }}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
          >
            {displayRecipientName}
          </div>
        </div>

        {/* Message Box */}
        <div className="mb-8 sm:mb-10 md:mb-12 relative">
          <div
            className="p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-sm rounded-lg border border-cyan-400/50 relative"
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.05)'
            }}
          >
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-t-2 border-cyan-400" style={{boxShadow: '0 0 5px #00ffff'}} />
            <div className="absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-t-2 border-cyan-400" style={{boxShadow: '0 0 5px #00ffff'}} />
            <div className="absolute bottom-2 left-2 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-b-2 border-cyan-400" style={{boxShadow: '0 0 5px #00ffff'}} />
            <div className="absolute bottom-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-b-2 border-cyan-400" style={{boxShadow: '0 0 5px #00ffff'}} />

            <p
              className={`text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-100 leading-relaxed font-thin break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.02em'
              }}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('message', e.currentTarget.textContent || '')}
            >
              {displayMessage}
            </p>
            {displayCreatorName && (
              <p
                className={`text-sm sm:text-base md:text-lg text-pink-300 mt-4 sm:mt-6 font-thin break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                style={{
                  fontFamily: 'monospace',
                  textShadow: '0 0 5px #ff1493'
                }}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('creatorName', e.currentTarget.textContent || '')}
              >
                — {displayCreatorName}
              </p>
            )}
          </div>
        </div>

        {/* Laser Effect Message */}
        {showLaser && (
          <div className="mb-6 sm:mb-8 relative">
            <p
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-yellow-400 font-thin break-words"
              style={{
                fontFamily: 'monospace',
                textShadow: '0 0 20px #ffff00, 0 0 40px #ffff00',
                animation: 'laserWrite 4s ease-out forwards',
                letterSpacing: '0.1em'
              }}
            >
              MINNETTARLIK.EXE ÇALIŞIYOR...
            </p>
            <div className="mt-2 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" style={{
              animation: 'laserScan 2s ease-in-out infinite',
              boxShadow: '0 0 10px #ffff00'
            }} />
          </div>
        )}

        {/* Neon Button */}
        <Button
          onClick={handleNeonEnter}
          className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-thin bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
          style={{
            fontFamily: 'monospace',
            textShadow: '0 0 10px #00ffff',
            boxShadow: showLaser
              ? '0 0 30px #00ffff, 0 0 60px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.1)'
              : '0 0 15px #00ffff, inset 0 0 10px rgba(0, 255, 255, 0.05)',
            letterSpacing: '0.05em'
          }}
        >
          <span className="relative z-10">SISTEME GİR</span>
          {showLaser && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" />
          )}
        </Button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes neonFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
          75% { opacity: 0.9; }
        }
        
        @keyframes neonGlow {
          0% { box-shadow: 0 0 5px #00ffff; }
          100% { box-shadow: 0 0 20px #00ffff, 0 0 30px #00ffff; }
        }
        
        @keyframes gridMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gridSlide {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes laserWrite {
          0% { 
            opacity: 0; 
            transform: scaleX(0); 
          }
          50% { 
            opacity: 1; 
            transform: scaleX(0.5); 
          }
          100% { 
            opacity: 1; 
            transform: scaleX(1); 
          }
        }
        
        @keyframes laserScan {
          0%, 100% { transform: scaleX(0.1); opacity: 1; }
          50% { transform: scaleX(1); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default MinimalistNeonTesekkur;