'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface MinimalistNeonTemplateProps {
  recipientName: string;
  mainMessage: string;
  wishMessage?: string;
  footerMessage?: string;
  creatorName?: string;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

function MinimalistNeonTemplate({
  recipientName,
  mainMessage,
  wishMessage,
  footerMessage,
  creatorName,
  isEditable = false,
  onTextFieldChange
}: MinimalistNeonTemplateProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [neonLines, setNeonLines] = useState<Array<{id: number, x: number, y: number, width: number, color: string, delay: number}>>([]);
  const [digitalRain, setDigitalRain] = useState<Array<{id: number, x: number, char: string, speed: number, color: string}>>([]);
  const [glitchEffect, setGlitchEffect] = useState(false);

  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localMainMessage, setLocalMainMessage] = useState(mainMessage);
  const [localWishMessage, setLocalWishMessage] = useState(wishMessage || '');
  const [localFooterMessage, setLocalFooterMessage] = useState(footerMessage || '');

  const neonColors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0080', '#8000ff'];
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

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
    // Create neon grid lines
    const newNeonLines = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      width: Math.random() * 200 + 50,
      color: neonColors[Math.floor(Math.random() * neonColors.length)],
      delay: Math.random() * 3
    }));
    setNeonLines(newNeonLines);

    // Create digital rain
    const newDigitalRain = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      speed: Math.random() * 3 + 1,
      color: neonColors[Math.floor(Math.random() * neonColors.length)]
    }));
    setDigitalRain(newDigitalRain);
  }, []);

  const handleNeonActivation = () => {
    setShowCelebration(true);
    setGlitchEffect(true);
    
    // Create more intense neon effects
    setTimeout(() => {
      const celebrationLines = Array.from({ length: 40 }, (_, i) => ({
        id: i + 1000,
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: Math.random() * 300 + 100,
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        delay: Math.random() * 1
      }));
      setNeonLines(prev => [...prev, ...celebrationLines]);
    }, 200);

    setTimeout(() => setGlitchEffect(false), 2000);
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Digital Rain */}
        {digitalRain.map(drop => (
          <div
            key={drop.id}
            className="absolute text-sm font-mono animate-pulse"
            style={{
              left: `${drop.x}%`,
              top: `${Math.random() * 100}%`,
              color: drop.color,
              textShadow: `0 0 10px ${drop.color}`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${drop.speed}s`,
              transform: `translateY(${Math.random() * 200}px)`,
              zIndex: 5
            }}
          >
            {drop.char}
          </div>
        ))}

        {/* Neon Lines */}
        {neonLines.map(line => (
          <div
            key={line.id}
            className="absolute animate-pulse"
            style={{
              left: `${line.x}%`,
              top: `${line.y}%`,
              width: `${line.width}px`,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${line.color}, transparent)`,
              boxShadow: `0 0 10px ${line.color}, 0 0 20px ${line.color}`,
              animationDelay: `${line.delay}s`,
              animationDuration: '2s',
              zIndex: 10
            }}
          />
        ))}

        {/* Main Content */}
        <div className={`relative z-20 text-center space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 max-w-4xl ${glitchEffect ? 'animate-pulse' : ''}`}>
          {creatorName && (
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-white font-mono bg-black/80 rounded px-3 py-1 border border-cyan-400/50 break-words" style={{
                textShadow: '0 0 10px #ffffff'
              }}>
                &gt; Hazırlayan: {creatorName}
              </p>
            </div>
          )}

          {/* Neon Frame */}
          <div className="relative border border-cyan-400 sm:border-2 p-6 sm:p-8 md:p-12 bg-black/90 backdrop-blur-sm" style={{
            boxShadow: '0 0 20px rgba(0,255,255,0.5), inset 0 0 20px rgba(0,255,255,0.1)'
          }}>
            {/* Corner Lights */}
            <div className="absolute top-0 left-0 w-4 h-4 bg-cyan-400 rounded-full animate-ping" style={{
              boxShadow: '0 0 15px #00ffff',
              transform: 'translate(-50%, -50%)'
            }}></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-magenta-400 rounded-full animate-ping" style={{
              boxShadow: '0 0 15px #ff00ff',
              transform: 'translate(50%, -50%)',
              animationDelay: '0.5s'
            }}></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-yellow-400 rounded-full animate-ping" style={{
              boxShadow: '0 0 15px #ffff00',
              transform: 'translate(-50%, 50%)',
              animationDelay: '1s'
            }}></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full animate-ping" style={{
              boxShadow: '0 0 15px #00ff00',
              transform: 'translate(50%, 50%)',
              animationDelay: '1.5s'
            }}></div>

            {/* Glitch Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-mono mb-4 sm:mb-6 md:mb-8 text-white relative break-words" style={{
              textShadow: '0 0 20px #00ffff, 2px 2px 0px #ff00ff, -2px -2px 0px #ffff00',
              fontWeight: 'bold'
            }}>
              <span className={glitchEffect ? 'animate-bounce' : ''}>
                MUTLU_YILLAR.exe
              </span>
              {glitchEffect && (
                <>
                  <div className="absolute inset-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-mono text-magenta-400 opacity-70 transform translate-x-1 break-words">
                    MUTLU_YILLAR.exe
                  </div>
                  <div className="absolute inset-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-mono text-yellow-400 opacity-50 transform -translate-x-1 break-words">
                    MUTLU_YILLAR.exe
                  </div>
                </>
              )}
            </h1>

            <h2
              className={`text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white mb-4 sm:mb-6 md:mb-8 font-mono font-bold break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent?.replace(/^> /, '') || '')}
              style={{
                textShadow: '0 0 25px #ff00ff, 4px 4px 8px rgba(0,0,0,1), 0 0 40px rgba(255,0,255,1), 2px 2px 0px rgba(0,0,0,1)',
                background: 'rgba(0,0,0,0.95)',
                padding: '12px 20px',
                borderRadius: '8px',
                border: '3px solid rgba(255,0,255,0.8)',
                backdropFilter: 'blur(10px)'
              }}
            >
              &gt; {displayRecipientName ? `${displayRecipientName.toUpperCase()}` : 'SEVGILI_DOSTUM'}
            </h2>

            <div className="border p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8" style={{
              borderColor: 'rgba(0,255,255,0.8)',
              background: 'rgba(0,0,0,0.95)',
              boxShadow: 'inset 0 0 20px rgba(0,255,255,0.5), 0 0 30px rgba(0,255,255,0.4)',
              border: '3px solid rgba(0,255,255,0.9)',
              backdropFilter: 'blur(15px)'
            }}>
              <p
                className={`text-base sm:text-lg md:text-xl text-white leading-relaxed font-mono font-medium break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent?.replace(/^> /, '') || '')}
                style={{
                  textShadow: '0 0 20px #00ff00, 3px 3px 6px rgba(0,0,0,1), 0 0 35px rgba(0,255,0,0.8), 1px 1px 0px rgba(0,0,0,1)'
                }}
              >
                &gt; {displayMainMessage}
              </p>
            </div>

            {/* Matrix-style Success Message */}
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white animate-pulse font-mono font-bold break-words" style={{
              textShadow: '0 0 25px #ffff00, 4px 4px 8px rgba(0,0,0,1), 0 0 40px rgba(255,255,0,1), 2px 2px 0px rgba(0,0,0,1)',
              background: 'rgba(0,0,0,0.95)',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '2px solid rgba(255,255,0,0.7)',
              backdropFilter: 'blur(10px)'
            }}>
              [SUCCESS] YENİ_YIL_KUTLAMASI_AKTIF
            </div>
          </div>

          {displayWishMessage && (
            <div
              className={`text-base sm:text-lg md:text-xl text-white font-mono font-medium bg-black/80 rounded-lg p-4 border border-cyan-400/50 break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('wishMessage', e.currentTarget.textContent?.replace(/^> /, '') || '')}
              style={{
                textShadow: '0 0 10px #00ffff'
              }}
            >
              &gt; {displayWishMessage}
            </div>
          )}

          {displayFooterMessage && (
            <div
              className={`text-base sm:text-lg text-white mt-4 sm:mt-6 md:mt-8 font-mono font-medium bg-black/80 rounded-lg p-4 border border-magenta-400/50 break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('footerMessage', e.currentTarget.textContent?.replace(/^> /, '') || '')}
              style={{
                textShadow: '0 0 10px #ff00ff'
              }}
            >
              &gt; {displayFooterMessage}
            </div>
          )}

          {/* Cyberpunk Emoji */}
          <div className="text-4xl sm:text-5xl md:text-6xl animate-bounce mt-4 sm:mt-6 md:mt-8">🤖</div>
        </div>

        <style jsx>{`
          .text-cyan-200 { color: #a5f3fc; }
          .text-cyan-300 { color: #67e8f9; }
          .text-cyan-400 { color: #22d3ee; }
          .text-magenta-300 { color: #f0abfc; }
          .text-magenta-400 { color: #e879f9; }
          .text-yellow-300 { color: #fde047; }
          .text-yellow-400 { color: #facc15; }
          .text-green-300 { color: #86efac; }
          .text-green-400 { color: #4ade80; }
          .border-cyan-400 { border-color: #22d3ee; }
          .border-cyan-400\\/50 { border-color: rgba(34, 211, 238, 0.5); }
          .bg-cyan-400 { background-color: #22d3ee; }
          .bg-magenta-400 { background-color: #e879f9; }
          .bg-yellow-400 { background-color: #facc15; }
          .bg-green-400 { background-color: #4ade80; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Subtle Digital Rain */}
      {digitalRain.slice(0, 20).map(drop => (
        <div
          key={drop.id}
          className="absolute text-xs font-mono animate-pulse opacity-30"
          style={{
            left: `${drop.x}%`,
            top: `${Math.random() * 100}%`,
            color: drop.color,
            textShadow: `0 0 5px ${drop.color}`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${drop.speed + 2}s`,
            zIndex: 5
          }}
        >
          {drop.char}
        </div>
      ))}

      {/* Subtle Neon Lines */}
      {neonLines.slice(0, 10).map(line => (
        <div
          key={line.id}
          className="absolute animate-pulse opacity-40"
          style={{
            left: `${line.x}%`,
            top: `${line.y}%`,
            width: `${line.width}px`,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${line.color}, transparent)`,
            boxShadow: `0 0 5px ${line.color}`,
            animationDelay: `${line.delay}s`,
            animationDuration: '4s',
            zIndex: 5
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 max-w-4xl">
        {creatorName && (
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-cyan-300/70 font-mono break-words" style={{
              textShadow: '0 0 10px #00ffff, 2px 2px 4px rgba(0,0,0,1)',
              background: 'rgba(0,0,0,0.9)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(0,255,255,0.5)',
              backdropFilter: 'blur(5px)'
            }}>
              &gt; Hazırlayan: {creatorName}
            </p>
          </div>
        )}

        {/* Neon Frame */}
        <div className="relative border border-cyan-400/60 p-6 sm:p-8 md:p-10 bg-black/60 backdrop-blur-sm" style={{
          boxShadow: '0 0 15px rgba(0,255,255,0.3), inset 0 0 15px rgba(0,255,255,0.05)'
        }}>
          {/* Corner Indicators */}
          <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400/60 rounded-full animate-pulse" style={{
            boxShadow: '0 0 10px #00ffff',
            transform: 'translate(-50%, -50%)'
          }}></div>
          <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-magenta-400/60 rounded-full animate-pulse" style={{
            boxShadow: '0 0 10px #ff00ff',
            transform: 'translate(50%, -50%)',
            animationDelay: '1s'
          }}></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400/60 rounded-full animate-pulse" style={{
            boxShadow: '0 0 10px #ffff00',
            transform: 'translate(-50%, 50%)',
            animationDelay: '2s'
          }}></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-400/60 rounded-full animate-pulse" style={{
            boxShadow: '0 0 10px #00ff00',
            transform: 'translate(50%, 50%)',
            animationDelay: '3s'
          }}></div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-mono mb-4 sm:mb-6 text-white break-words" style={{
            textShadow: '0 0 15px #00ffff, 2px 2px 4px rgba(0,0,0,0.8)',
            fontWeight: 'bold'
          }}>
            MUTLU_YILLAR
          </h1>

          <h2
            className={`text-base sm:text-xl md:text-2xl lg:text-3xl text-white mb-4 sm:mb-6 font-mono font-bold break-words ${isEditable ? 'hover:bg-white/10 cursor-text transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent?.replace(/^> /, '') || '')}
            style={{
              textShadow: '0 0 15px #ff00ff, 3px 3px 6px rgba(0,0,0,1), 0 0 25px rgba(255,0,255,0.8)',
              background: 'rgba(0,0,0,0.9)',
              padding: '8px 16px',
              borderRadius: '4px',
              border: '2px solid rgba(255,0,255,0.6)'
            }}
          >
            &gt; {displayRecipientName ? `${displayRecipientName.toUpperCase()}` : 'SEVGILI_DOSTUM'}
          </h2>

          <div className="border p-4 mb-4 sm:mb-6" style={{
            borderColor: 'rgba(0,255,255,0.8)',
            background: 'rgba(0,0,0,0.9)',
            border: '2px solid rgba(0,255,255,0.7)'
          }}>
            <p
              className={`text-base sm:text-lg md:text-xl text-white leading-relaxed font-mono font-medium break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent?.replace(/^> /, '') || '')}
              style={{
                textShadow: '0 0 12px #00ff00, 2px 2px 4px rgba(0,0,0,1), 0 0 20px rgba(0,255,0,0.6)'
              }}
            >
              &gt; {displayMainMessage}
            </p>
          </div>

          <Button
            onClick={handleNeonActivation}
            className="bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 text-white font-mono font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-none text-base sm:text-lg transition-all duration-300 relative overflow-hidden group border border-cyan-400"
            style={{
              boxShadow: '0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(255,0,255,0.3)',
              textShadow: '2px 2px 4px rgba(0,0,0,1)'
            }}
          >
            <span className="relative z-10 flex items-center gap-1 sm:gap-2 md:gap-3">
              <span className="text-lg sm:text-xl md:text-2xl">🤖</span>
              <span className="break-words">NEON_AKTIF.exe</span>
              <span className="text-lg sm:text-xl md:text-2xl">🤖</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .text-cyan-200 { color: #a5f3fc; }
        .text-cyan-300 { color: #67e8f9; }
        .text-cyan-400 { color: #22d3ee; }
        .text-cyan-500 { color: #06b6d4; }
        .text-cyan-600 { color: #0891b2; }
        .text-magenta-300 { color: #f0abfc; }
        .text-magenta-400 { color: #e879f9; }
        .text-magenta-500 { color: #d946ef; }
        .text-magenta-600 { color: #c026d3; }
        .text-yellow-300 { color: #fde047; }
        .text-yellow-400 { color: #facc15; }
        .text-green-300 { color: #86efac; }
        .text-green-400 { color: #4ade80; }
        .border-cyan-400 { border-color: #22d3ee; }
        .border-cyan-400\\/30 { border-color: rgba(34, 211, 238, 0.3); }
        .border-cyan-400\\/60 { border-color: rgba(34, 211, 238, 0.6); }
        .bg-cyan-400 { background-color: #22d3ee; }
        .bg-cyan-500 { background-color: #06b6d4; }
        .bg-cyan-600 { background-color: #0891b2; }
        .bg-magenta-400 { background-color: #e879f9; }
        .bg-magenta-500 { background-color: #d946ef; }
        .bg-magenta-600 { background-color: #c026d3; }
        .bg-yellow-400 { background-color: #facc15; }
        .bg-green-400 { background-color: #4ade80; }
        .from-cyan-600 { --tw-gradient-from: #0891b2; }
        .to-magenta-600 { --tw-gradient-to: #c026d3; }
        .hover\\:from-cyan-500:hover { --tw-gradient-from: #06b6d4; }
        .hover\\:to-magenta-500:hover { --tw-gradient-to: #d946ef; }
      `}</style>
    </div>
  );
}

export default MinimalistNeonTemplate;