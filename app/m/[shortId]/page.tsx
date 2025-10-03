'use client';

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Heart, Clock, Calendar, User, Music, Share2, Download } from "lucide-react";
import { Countdown } from '@/components/ui/countdown';
import { FloatingHearts } from '@/components/ui/floating-hearts';
import { AudioPlayer } from '@/components/ui/audio-player';
import { YouTubePlayer, extractVideoId } from '@/components/ui/youtube-player';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAnalyticsTracker } from '@/lib/analytics';
import TemplateRenderer from '@/templates/shared/template-renderer';
import { getDefaultTextFields } from '@/templates/shared/types';
import { ShareButton } from '@/components/share-button';

interface PersonalPage {
  id: string;
  short_id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  template_title: string;
  template_slug: string;
  template_audience: string | string[];
  template_preview_url: string | null;
  template_bg_audio_url: string | null;
  bg_audio_url: string | null;
  design_style: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  text_fields: Record<string, string>;
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

// This needs to be a Client Component to use useEffect and state
// So we cannot add generateMetadata here
// Meta tags will be handled via API route or default metadata

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
      } catch (error) {
        console.error('Error fetching personal page:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalPage();
  }, [shortId]);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {personalPage?.template_title ? `${personalPage.template_title} - Mesaj Bulunamadı` : 'Mesaj Bulunamadı'}
          </h1>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Share Button */}
      <div className="fixed top-4 left-4 z-50">
        <ShareButton
          shortId={personalPage.short_id}
          recipientName={personalPage.recipient_name}
          className="bg-gray-900/95 text-white border-gray-700/50 hover:bg-gray-900 shadow-lg"
        />
      </div>

      {/* Audio Player - YouTube or Regular Audio */}
      {(personalPage.bg_audio_url || personalPage.text_fields?.musicUrl) && (
        <div className="fixed top-4 right-4 z-50">
          {(() => {
            // Öncelik sırası: text_fields.musicUrl, sonra bg_audio_url
            const audioUrl = personalPage.text_fields?.musicUrl || personalPage.bg_audio_url;

            if (audioUrl && (audioUrl.includes('youtube.com') || audioUrl.includes('youtu.be'))) {
              return (
                <YouTubePlayer
                  videoId={extractVideoId(audioUrl) || undefined}
                  autoPlay={false}
                  loop={true}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                />
              );
            } else if (audioUrl) {
              return (
                <AudioPlayer
                  src={audioUrl}
                  autoPlay={false}
                  loop={true}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                />
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Full Screen Template Renderer */}
      <div className="w-full h-screen">
        <TemplateRenderer
          template={{
            id: personalPage.id,
            slug: personalPage.template_slug,
            title: personalPage.template_title,
            audience: Array.isArray(personalPage.template_audience) ? personalPage.template_audience : [personalPage.template_audience],
            bg_audio_url: personalPage.template_bg_audio_url
          }}
          recipientName={personalPage.recipient_name}
          message={personalPage.message}
          designStyle={personalPage.design_style}
          creatorName={personalPage.sender_name}
          isPreview={false}
          textFields={{
            ...getDefaultTextFields(personalPage.template_slug),
            ...personalPage.text_fields,
            recipient_name: personalPage.recipient_name,
            sender_name: personalPage.sender_name,
            message: personalPage.message,
            ...(personalPage.special_date && { special_date: personalPage.special_date })
          }}
        />
      </div>

      {/* Floating Hearts Animation */}
      <FloatingHearts isActive={true} />

      {/* Footer - HeartNote Branding */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <p className="text-xs text-white font-medium">
            ❤️ HeartNote ile yapılmıştır
          </p>
        </div>
      </div>
    </div>
  );
}