'use client';

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Heart, Clock, Calendar, User, Music, Share2, Download } from "lucide-react";
import { Countdown } from '@/components/ui/countdown';
import { FloatingHearts } from '@/components/ui/floating-hearts';
import { AudioPlayer } from '@/components/ui/audio-player';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAnalyticsTracker } from '@/lib/analytics';

interface PersonalPage {
  id: string;
  short_id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  template_title: string;
  template_preview_url: string | null;
  template_bg_audio_url: string | null;
  expires_at: string;
  special_date: string | null;
  is_active: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PersonalMessagePage({ params }: { params: Promise<{ shortId: string }> }) {
  const [personalPage, setPersonalPage] = useState<PersonalPage | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [shortId, setShortId] = useState<string>('');
  
  // Initialize params
  useEffect(() => {
    const initParams = async () => {
      const resolvedParams = await params;
      setShortId(resolvedParams.shortId);
    };
    initParams();
  }, [params]);

  // Initialize analytics tracker
  const analytics = createAnalyticsTracker(shortId);

  // Fetch personal page data
  useEffect(() => {
    if (!shortId) return;
    
    const fetchPersonalPage = async () => {
      try {
        const response = await fetch(`/api/personal-pages/${shortId}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch personal page');
        }
        const data = await response.json();
        setPersonalPage(data);
        
        // Track page view using analytics tracker
        await analytics.trackPageView();
      } catch (error) {
        console.error('Error fetching personal page:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalPage();
  }, [shortId, analytics]);

  // Initialize audio
  useEffect(() => {
    if (personalPage?.template_bg_audio_url) {
      const audioElement = new Audio(personalPage.template_bg_audio_url);
      audioElement.loop = true;
      audioElement.volume = 0.5;
      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [personalPage?.template_bg_audio_url]);

  // Countdown timer
  useEffect(() => {
    if (!personalPage) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(personalPage.expires_at).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [personalPage]);

  // Audio controls
  const toggleAudio = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Mesajınız yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!personalPage || !personalPage.is_active) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mesaj Bulunamadı</h1>
          <p className="text-gray-600 mb-6">
            Bu mesaj artık mevcut değil veya süresi dolmuş olabilir.
          </p>
          <Button asChild>
            <a href="https://gizlimesaj.com">Kendi Mesajını Oluştur</a>
          </Button>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mesajın Süresi Doldu</h1>
          <p className="text-gray-600 mb-6">
            Bu özel mesajın görüntülenme süresi sona erdi. Ama endişelenme, 
            yeni mesajlar oluşturmaya devam edebilirsin!
          </p>
          <Button asChild>
            <a href="https://gizlimesaj.com">Yeni Mesaj Oluştur</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Image */}
      {personalPage.template_preview_url && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${personalPage.template_preview_url})` }}
        />
      )}

      {/* Audio Controls */}
      {personalPage.template_bg_audio_url && (
        <div className="fixed top-4 right-4 z-50">
          <AudioPlayer 
            src={personalPage.template_bg_audio_url}
            autoPlay={false}
            loop={true}
          />
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto w-full">
          {/* Main Message Card */}
          <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              {/* Header */}
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Merhaba {personalPage.recipient_name}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  {personalPage.sender_name} sana özel bir mesaj gönderdi
                </p>
              </div>

              {/* Message */}
              <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
                <div className="text-2xl mb-4">💌</div>
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                  {personalPage.message}
                </p>
                <div className="mt-4 text-right">
                  <p className="text-gray-600 italic">
                    - {personalPage.sender_name}
                  </p>
                </div>
              </div>

              {/* Special Date */}
              {personalPage.special_date && (
                <div className="mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-center gap-2 text-yellow-800">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">
                      Özel Tarih: {new Date(personalPage.special_date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              )}

              {/* Countdown Timer */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Bu mesaj şu kadar süre daha aktif:
                </h3>
                <Countdown 
                  targetDate={personalPage.expires_at}
                  onExpired={() => {
                    // Handle expiration
                    window.location.reload();
                  }}
                  className="justify-center"
                />
              </div>

              {/* Template Info */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Şablon:</span> {personalPage.template_title}
                </p>
              </div>

              {/* Call to Action */}
              <div className="space-y-4">
                <p className="text-gray-600">
                  Bu mesajı beğendin mi? Sen de sevdiklerine özel mesajlar gönderebilirsin!
                </p>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={async () => {
                    await analytics.trackButtonClick('create_message_cta');
                  }}
                >
                  <a href="https://gizlimesaj.com" target="_blank" rel="noopener noreferrer">
                    Kendi Mesajını Oluştur ✨
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Bu mesaj{" "}
              <a 
                href="https://gizlimesaj.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline font-medium"
                onClick={async () => {
                  await analytics.trackButtonClick('footer_link');
                }}
              >
                Gizli Mesaj
              </a>{" "}
              ile oluşturuldu
            </p>
          </div>
        </div>
      </div>

      {/* Floating Hearts Animation */}
      <FloatingHearts isActive={true} />
    </div>
  );
}