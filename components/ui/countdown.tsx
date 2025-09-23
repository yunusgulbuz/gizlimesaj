'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetDate: string;
  onExpired?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate, onExpired, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onExpired) {
          onExpired();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpired]);

  if (isExpired) {
    return (
      <div className={`flex items-center justify-center text-red-500 ${className}`}>
        <Clock className="w-5 h-5 mr-2" />
        <span className="text-lg font-semibold">Süre Doldu</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      <Clock className="w-5 h-5 text-purple-500" />
      <div className="flex space-x-2">
        {timeLeft.days > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{timeLeft.days}</div>
            <div className="text-xs text-gray-500">Gün</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">Saat</div>
        </div>
        <div className="text-center text-purple-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">Dakika</div>
        </div>
        <div className="text-center text-purple-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">Saniye</div>
        </div>
      </div>
    </div>
  );
}