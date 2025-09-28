'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';

interface AudioPlayerProps {
  src?: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

export function AudioPlayer({ 
  src, 
  autoPlay = false, 
  loop = true, 
  className = '' 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    const handleCanPlay = () => {
      if (autoPlay) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, autoPlay]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio play error:', error);
    }
  };

  if (!src) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        preload="auto"
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlay}
        className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white" />
        )}
      </Button>
    </div>
  );
}