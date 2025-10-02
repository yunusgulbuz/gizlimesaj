'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import type { TemplateTextFields } from '../../shared/types';

interface SeniSeviyorumTemplateProps {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

export default function SeniSeviyorumTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields = {},
  isEditable = false,
  onTextFieldChange
}: SeniSeviyorumTemplateProps) {
  const styles = getSeniSeviyorumStyles(designStyle);

  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localMainMessage, setLocalMainMessage] = useState('');
  const [localFooterMessage, setLocalFooterMessage] = useState('');

  // Initialize local state with text fields
  useEffect(() => {
    setLocalRecipientName(recipientName);
    setLocalMainMessage(textFields?.mainMessage || message);
    setLocalFooterMessage(textFields?.footerMessage || "Sen benim her şeyimsin! 💝");
  }, [recipientName, message, textFields]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    // Update local state immediately
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'mainMessage') setLocalMainMessage(value);
    else if (key === 'footerMessage') setLocalFooterMessage(value);

    // Notify parent component
    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  // Get text values - use local state if editable, otherwise use props
  const displayRecipientName = isEditable ? localRecipientName : (textFields.recipientName || recipientName);
  const displayMainMessage = isEditable ? localMainMessage : (textFields.mainMessage || message);
  const displayFooterMessage = isEditable ? localFooterMessage : (textFields.footerMessage || "Sen benim her şeyimsin! 💝");
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${styles.floatingHeart} animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      <div className={`max-w-4xl mx-auto p-4 sm:p-6 md:p-8 text-center relative z-10 ${styles.container}`}>
        {/* Creator Name Display */}
        {creatorName && (
          <div className="text-center mb-4 sm:mb-6">
            <p className={`text-xs sm:text-sm ${styles.creatorNameColor || 'text-gray-600'}`}>
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className={`${styles.iconContainer} mx-auto mb-4 sm:mb-6`}>
            <Heart className={`${styles.iconSize} ${styles.heartColor} animate-bounce`} />
          </div>
          <h1
            className={`${styles.titleSize} font-bold ${styles.titleColor} mb-3 sm:mb-4 ${styles.titleAnimation} break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
          >
            {displayRecipientName ? `Sevgili ${displayRecipientName},` : 'Sevgilim,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-6 sm:mb-8 ${styles.subtitleAnimation}`}>
            💕 Seni Seviyorum 💕
          </h2>
        </div>
        
        {/* Message Section */}
        <div className={`${styles.messageContainer} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl mb-8 sm:mb-10 md:mb-12 ${styles.messageAnimation}`}>
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
              {['💖', '✨', '🌟', '✨', '💖'].map((emoji, i) => (
                <span
                  key={i}
                  className={`text-xl sm:text-2xl md:text-3xl ${styles.emojiAnimation}`}
                  style={{animationDelay: `${i * 0.1}s`}}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <p
              className={`${styles.messageSize} ${styles.messageColor} leading-relaxed mb-4 sm:mb-6 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent || '')}
            >
              {displayMainMessage}
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className={`${styles.footerSection} space-y-4 sm:space-y-6`}>
          <p
            className={`${styles.footerText} font-medium break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors inline-block' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('footerMessage', e.currentTarget.textContent || '')}
          >
            {displayFooterMessage}
          </p>

          <div className="flex justify-center space-x-2 sm:space-x-3">
            <span className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0s'}}>💖</span>
            <span className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.1s'}}>💕</span>
            <span className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>💗</span>
            <span className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>💓</span>
            <span className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.4s'}}>💘</span>
            <span className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>💝</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSeniSeviyorumStyles(designStyle: 'modern' | 'classic' | 'minimalist') {
  switch (designStyle) {
    case 'modern':
      return {
        background: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
        backgroundElements: 'absolute inset-0 pointer-events-none',
        floatingHeart: 'text-white/20 text-lg',
        container: 'bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20',
        iconContainer: 'bg-gradient-to-br from-pink-100 to-purple-100 rounded-full p-4 sm:p-6 w-fit',
        iconSize: 'w-10 h-10 sm:w-12 sm:h-12',
        heartColor: 'text-pink-500',
        titleSize: 'text-2xl sm:text-3xl md:text-4xl lg:text-6xl',
        titleColor: 'text-gray-800',
        titleFont: 'font-bold',
        titleAnimation: 'animate-fade-in',
        subtitleSize: 'text-lg sm:text-xl md:text-2xl',
        subtitleColor: 'text-gray-600',
        subtitleFont: 'font-medium',
        subtitleAnimation: 'animate-fade-in-delay',
        messageContainer: 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200',
        messageSize: 'text-base sm:text-lg md:text-xl',
        messageColor: 'text-gray-700',
        messageFont: 'font-normal',
        messageAnimation: 'animate-slide-up',
        emojiAnimation: 'animate-bounce',
        footerSection: 'text-center',
        footerText: 'text-base sm:text-lg text-gray-700',
        creatorNameColor: 'text-white/80'
      };
    case 'classic':
      return {
        background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
        backgroundElements: 'absolute inset-0 pointer-events-none',
        floatingHeart: 'text-amber-300/30 text-lg',
        container: 'bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border-2 border-amber-200',
        iconContainer: 'bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-4 sm:p-6 w-fit border-2 border-amber-300',
        iconSize: 'w-10 h-10 sm:w-12 sm:h-12',
        heartColor: 'text-amber-600',
        titleSize: 'text-xl sm:text-2xl md:text-3xl lg:text-5xl',
        titleColor: 'text-amber-800',
        titleFont: 'font-serif font-bold',
        titleAnimation: 'animate-fade-in',
        subtitleSize: 'text-base sm:text-lg md:text-xl',
        subtitleColor: 'text-amber-700',
        subtitleFont: 'font-serif font-medium',
        subtitleAnimation: 'animate-fade-in-delay',
        messageContainer: 'bg-amber-50/80 border-2 border-amber-200',
        messageSize: 'text-sm sm:text-base md:text-lg',
        messageColor: 'text-amber-900',
        messageFont: 'font-serif',
        messageAnimation: 'animate-slide-up',
        emojiAnimation: 'animate-bounce',
        footerSection: 'text-center',
        footerText: 'text-base sm:text-lg text-amber-800',
        creatorNameColor: 'text-amber-600'
      };
    case 'minimalist':
      return {
        background: 'bg-gray-50',
        backgroundElements: 'absolute inset-0 pointer-events-none',
        floatingHeart: 'text-gray-300/40 text-lg',
        container: 'bg-white rounded-lg shadow-sm border border-gray-200',
        iconContainer: 'bg-gray-100 rounded-full p-4 sm:p-6 w-fit',
        iconSize: 'w-10 h-10 sm:w-12 sm:h-12',
        heartColor: 'text-gray-600',
        titleSize: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
        titleColor: 'text-gray-900',
        titleFont: 'font-light',
        titleAnimation: 'animate-fade-in',
        subtitleSize: 'text-sm sm:text-base md:text-lg',
        subtitleColor: 'text-gray-600',
        subtitleFont: 'font-normal',
        subtitleAnimation: 'animate-fade-in-delay',
        messageContainer: 'bg-gray-50',
        messageSize: 'text-xs sm:text-sm md:text-base',
        messageColor: 'text-gray-800',
        messageFont: 'font-normal',
        messageAnimation: 'animate-slide-up',
        emojiAnimation: 'animate-bounce',
        footerSection: 'text-center',
        footerText: 'text-sm sm:text-base text-gray-700',
        creatorNameColor: 'text-gray-500'
      };
    default:
      return getSeniSeviyorumStyles('modern');
  }
}
