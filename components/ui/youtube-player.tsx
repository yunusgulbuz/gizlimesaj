'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from './button';

interface YouTubePlayerProps {
  videoId?: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
  onReady?: () => void;
  onError?: (error: any) => void;
  theme?: 'light' | 'dark' | 'auto';
}

// YouTube URL'den video ID'sini çıkaran fonksiyon
function extractVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direkt video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

export function YouTubePlayer({ 
  videoId, 
  autoPlay = true, 
  loop = true, 
  className = '',
  onReady,
  onError,
  theme = 'auto'
}: YouTubePlayerProps) {
  const [isDark, setIsDark] = useState(false);

  // Tema değişikliklerini dinle
  useEffect(() => {
    const checkTheme = () => {
      if (theme === 'auto') {
        setIsDark(document.documentElement.classList.contains('dark'));
      } else {
        setIsDark(theme === 'dark');
      }
    };
    
    checkTheme();
    
    if (theme === 'auto') {
      // MutationObserver ile tema değişikliklerini izle
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      return () => observer.disconnect();
    }
  }, [theme]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [player, setPlayer] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // YouTube API'yi yükle
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // YouTube API zaten yüklüyse
    if ((window as any).YT && (window as any).YT.Player) {
      initializePlayer();
      return;
    }

    // YouTube API'yi yükle
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // API yüklendiğinde çağrılacak global fonksiyon
    (window as any).onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    return () => {
      // Cleanup
      if (player) {
        player.destroy();
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!videoId || !playerRef.current) {
      console.log('YouTube Player: videoId or playerRef not available', { videoId, playerRef: !!playerRef.current });
      return;
    }

    console.log('YouTube Player: Initializing with videoId:', videoId);

    const newPlayer = new (window as any).YT.Player(playerRef.current, {
      height: '0',
      width: '0',
      videoId: videoId,
      playerVars: {
        autoplay: autoPlay ? 1 : 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        loop: loop ? 1 : 0,
        playlist: loop ? videoId : undefined
      },
      events: {
        onReady: (event: any) => {
          console.log('YouTube Player: onReady event triggered');
          setIsReady(true);
          setPlayer(event.target);
          if (autoPlay) {
            event.target.playVideo();
            setIsPlaying(true);
          }
          onReady?.();
        },
        onStateChange: (event: any) => {
          const state = event.data;
          if (state === (window as any).YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (state === (window as any).YT.PlayerState.PAUSED || 
                     state === (window as any).YT.PlayerState.ENDED) {
            setIsPlaying(false);
          }
        },
        onError: (event: any) => {
          console.error('YouTube Player Error:', event.data);
          onError?.(event.data);
        }
      }
    });
  };

  const togglePlay = () => {
    if (!player || !isReady) return;

    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (error) {
      console.error('YouTube Player Control Error:', error);
    }
  };

  const toggleMute = () => {
    if (!player || !isReady) return;

    try {
      if (isMuted) {
        player.unMute();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
    } catch (error) {
      console.error('YouTube Player Mute Error:', error);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!player || !isReady) return;

    try {
      player.setVolume(newVolume);
      setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    } catch (error) {
      console.error('YouTube Player Volume Error:', error);
    }
  };

  if (!videoId) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Müzik İkonu */}
        <div className="flex items-center space-x-1">
          <Music className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 hidden sm:inline">Geçersiz YouTube URL'si</span>
        </div>
        
        {/* Devre Dışı Play Butonu */}
        <Button
          variant="ghost"
          size="sm"
          disabled={true}
          className="p-2 rounded-full bg-gray-100 transition-all opacity-50 cursor-not-allowed"
        >
          <Play className="w-4 h-4 text-gray-400" />
        </Button>
      </div>
    );
  }

  // Tema renklerini belirle
  const themeColors = isDark ? {
    iconColor: 'text-white/80',
    textColor: 'text-white/80',
    buttonBg: 'bg-white/20',
    buttonHover: 'hover:bg-white/30',
    buttonIcon: 'text-white',
    sliderBg: 'rgba(255,255,255,0.2)',
    sliderThumb: '#ffffff'
  } : {
    iconColor: 'text-gray-600',
    textColor: 'text-gray-600',
    buttonBg: 'bg-gray-200',
    buttonHover: 'hover:bg-gray-300',
    buttonIcon: 'text-gray-700',
    sliderBg: 'rgba(0,0,0,0.2)',
    sliderThumb: '#374151'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Gizli YouTube Player */}
      <div ref={playerRef} style={{ display: 'none' }} />
      
      {/* Müzik İkonu */}
      <div className="flex items-center space-x-1">
        <Music className={`w-4 h-4 ${themeColors.iconColor}`} />
        <span className={`text-xs ${themeColors.textColor} hidden sm:inline`}>Müzik</span>
      </div>

      {/* Play/Pause Butonu */}
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlay}
        disabled={!isReady}
        className={`p-2 rounded-full ${themeColors.buttonBg} backdrop-blur-sm ${themeColors.buttonHover} transition-all disabled:opacity-50`}
      >
        {isPlaying ? (
          <Pause className={`w-4 h-4 ${themeColors.buttonIcon}`} />
        ) : (
          <Play className={`w-4 h-4 ${themeColors.buttonIcon}`} />
        )}
      </Button>

      {/* Mute/Unmute Butonu */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMute}
        disabled={!isReady}
        className={`p-2 rounded-full ${themeColors.buttonBg} backdrop-blur-sm ${themeColors.buttonHover} transition-all disabled:opacity-50`}
      >
        {isMuted ? (
          <VolumeX className={`w-4 h-4 ${themeColors.buttonIcon}`} />
        ) : (
          <Volume2 className={`w-4 h-4 ${themeColors.buttonIcon}`} />
        )}
      </Button>

      {/* Ses Seviyesi Slider */}
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={isMuted ? 0 : volume}
        onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
        disabled={!isReady}
        className="w-16 h-1 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, ${themeColors.sliderThumb} ${(isMuted ? 0 : volume)}%, ${themeColors.sliderBg} ${(isMuted ? 0 : volume)}%)`
        }}
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${themeColors.sliderThumb};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${themeColors.sliderThumb};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

// YouTube URL'den video ID çıkaran yardımcı fonksiyon (export)
export { extractVideoId };