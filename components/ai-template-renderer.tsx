'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AITemplateRendererProps {
  templateCode: string;
  metadata: {
    recipientName?: string;
    mainMessage?: string;
    footerMessage?: string;
    colorScheme?: Record<string, string>;
    [key: string]: any;
  };
  creatorName?: string;
  bgAudioUrl?: string | null;
  isEditable?: boolean;
  onMetadataChange?: (metadata: any) => void;
}

export default function AITemplateRenderer({
  templateCode,
  metadata,
  creatorName,
  bgAudioUrl,
  isEditable = false,
  onMetadataChange,
}: AITemplateRendererProps) {
  const [processedHTML, setProcessedHTML] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Process template code with metadata values
  useEffect(() => {
    let html = templateCode;

    // Replace creator name placeholder
    if (creatorName) {
      html = html.replace(/\{\{CREATOR_NAME\}\}/g, creatorName);
    }

    // Replace ALL editable field values dynamically
    Object.keys(metadata).forEach((key) => {
      if (key !== 'colorScheme' && key !== 'editableFields' && metadata[key]) {
        const regex = new RegExp(
          `(<[^>]+data-editable="${key}"[^>]*>)([^<]*?)(<\/[^>]+>)`,
          'g'
        );
        html = html.replace(regex, `$1${metadata[key]}$3`);
      }
    });

    setProcessedHTML(html);
  }, [templateCode, metadata, creatorName]);

  // Handle editable content changes
  useEffect(() => {
    if (!isEditable || !contentRef.current || !onMetadataChange) return;

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      const editableKey = target.getAttribute('data-editable');

      if (editableKey) {
        const newValue = target.textContent || '';
        onMetadataChange({
          ...metadata,
          [editableKey]: newValue,
        });
      }
    };

    // Get all editable elements EXCEPT data-creator-name elements
    const allElements = contentRef.current.querySelectorAll('[data-editable]');
    const editableElements = Array.from(allElements).filter(
      (el) => !el.hasAttribute('data-creator-name')
    );

    editableElements.forEach((el) => {
      el.addEventListener('blur', handleInput);
      if (isEditable) {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('cursor-text', 'hover:bg-white/10', 'rounded-lg', 'px-2', 'py-1', 'transition-colors');
      }
    });

    return () => {
      editableElements.forEach((el) => {
        el.removeEventListener('blur', handleInput);
      });
    };
  }, [processedHTML, isEditable, metadata, onMetadataChange]);

  // Music control
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = bgAudioUrl ? extractYouTubeVideoId(bgAudioUrl) : null;

  return (
    <div className="relative">
      {/* Music control */}
      {videoId && (
        <div className="absolute top-4 right-4 z-20">
          <Button
            onClick={toggleMusic}
            size="sm"
            variant="secondary"
            className="bg-black/30 backdrop-blur-sm hover:bg-black/40 text-white border-white/20"
          >
            {isMusicPlaying ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          {/* Hidden YouTube iframe for audio */}
          <iframe
            ref={(iframe) => {
              if (iframe && !audioRef.current) {
                audioRef.current = iframe as any;
              }
            }}
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&loop=1&controls=0`}
            allow="autoplay"
            className="hidden"
          />
        </div>
      )}

      {/* Rendered template */}
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: processedHTML }}
        className="ai-template-container"
      />

      {/* Editable indicator */}
      {isEditable && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
          Metinlere tıklayarak düzenleyebilirsiniz
        </div>
      )}
    </div>
  );
}
