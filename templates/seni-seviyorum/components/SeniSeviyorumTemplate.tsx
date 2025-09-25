'use client';

import { Heart } from 'lucide-react';
import type { TemplateTextFields } from '../../shared/types';

interface SeniSeviyorumTemplateProps {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist';
  creatorName?: string;
  textFields?: TemplateTextFields;
}

export default function SeniSeviyorumTemplate({ 
  recipientName, 
  message, 
  designStyle, 
  creatorName,
  textFields = {}
}: SeniSeviyorumTemplateProps) {
  const styles = getSeniSeviyorumStyles(designStyle);
  
  // Metin alanlarını al, yoksa default değerleri kullan
  const displayRecipientName = textFields.recipientName || recipientName;
  const displayMainMessage = textFields.mainMessage || message;
  const displayFooterMessage = textFields.footerMessage || "Sen benim her şeyimsin! 💝";
  
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
      
      <div className={`max-w-4xl mx-auto p-8 text-center relative z-10 ${styles.container}`}>
        {/* Creator Name Display */}
        {creatorName && (
          <div className="text-center mb-6">
            <p className={`text-sm ${styles.creatorNameColor || 'text-gray-600'}`}>
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}
        
        {/* Header Section */}
        <div className="mb-12">
          <div className={`${styles.iconContainer} mx-auto mb-6`}>
            <Heart className={`${styles.iconSize} ${styles.heartColor} animate-bounce`} />
          </div>
          <h1 className={`${styles.titleSize} font-bold ${styles.titleColor} mb-4 ${styles.titleAnimation}`}>
            {displayRecipientName ? `Sevgili ${displayRecipientName},` : 'Sevgilim,'}
          </h1>
          <h2 className={`${styles.subtitleSize} ${styles.subtitleColor} mb-8 ${styles.subtitleAnimation}`}>
            💕 Seni Seviyorum 💕
          </h2>
        </div>
        
        {/* Message Section */}
        <div className={`${styles.messageContainer} p-8 rounded-2xl mb-12 ${styles.messageAnimation}`}>
          <div className="mb-6">
            <div className="flex justify-center space-x-2 mb-4">
              {['💖', '✨', '🌟', '✨', '💖'].map((emoji, i) => (
                <span 
                  key={i}
                  className={`text-3xl ${styles.emojiAnimation}`}
                  style={{animationDelay: `${i * 0.1}s`}}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <p className={`${styles.messageSize} ${styles.messageColor} leading-relaxed mb-6`}>
              {displayMainMessage}
            </p>
          </div>
        </div>
        
        {/* Footer Section */}
        <div className={`${styles.footerSection} space-y-6`}>
          <p className={`${styles.footerText} font-medium`}>
            {displayFooterMessage}
          </p>
          
          <div className="flex justify-center space-x-3">
            <span className="text-3xl animate-bounce" style={{animationDelay: '0s'}}>💖</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.1s'}}>💕</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>💗</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>💓</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.4s'}}>💘</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>💝</span>
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
        iconContainer: 'bg-gradient-to-br from-pink-100 to-purple-100 rounded-full p-6 w-fit',
        iconSize: 'w-12 h-12',
        heartColor: 'text-pink-500',
        titleSize: 'text-4xl md:text-6xl',
        titleColor: 'text-gray-800',
        titleFont: 'font-bold',
        titleAnimation: 'animate-fade-in',
        subtitleSize: 'text-xl md:text-2xl',
        subtitleColor: 'text-gray-600',
        subtitleFont: 'font-medium',
        subtitleAnimation: 'animate-fade-in-delay',
        messageContainer: 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200',
        messageSize: 'text-lg md:text-xl',
        messageColor: 'text-gray-700',
        messageFont: 'font-normal',
        messageAnimation: 'animate-slide-up',
        emojiAnimation: 'animate-bounce',
        footerSection: 'text-center',
        footerText: 'text-lg text-gray-700',
        creatorNameColor: 'text-white/80'
      };
    case 'classic':
      return {
        background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
        backgroundElements: 'absolute inset-0 pointer-events-none',
        floatingHeart: 'text-amber-300/30 text-lg',
        container: 'bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border-2 border-amber-200',
        iconContainer: 'bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-6 w-fit border-2 border-amber-300',
        iconSize: 'w-12 h-12',
        heartColor: 'text-amber-600',
        titleSize: 'text-3xl md:text-5xl',
        titleColor: 'text-amber-800',
        titleFont: 'font-serif font-bold',
        titleAnimation: 'animate-fade-in',
        subtitleSize: 'text-lg md:text-xl',
        subtitleColor: 'text-amber-700',
        subtitleFont: 'font-serif font-medium',
        subtitleAnimation: 'animate-fade-in-delay',
        messageContainer: 'bg-amber-50/80 border-2 border-amber-200',
        messageSize: 'text-base md:text-lg',
        messageColor: 'text-amber-900',
        messageFont: 'font-serif',
        messageAnimation: 'animate-slide-up',
        emojiAnimation: 'animate-bounce',
        footerSection: 'text-center',
        footerText: 'text-lg text-amber-800',
        creatorNameColor: 'text-amber-600'
      };
    case 'minimalist':
      return {
        background: 'bg-gray-50',
        backgroundElements: 'absolute inset-0 pointer-events-none',
        floatingHeart: 'text-gray-300/40 text-lg',
        container: 'bg-white rounded-lg shadow-sm border border-gray-200',
        iconContainer: 'bg-gray-100 rounded-full p-6 w-fit',
        iconSize: 'w-12 h-12',
        heartColor: 'text-gray-600',
        titleSize: 'text-2xl md:text-4xl',
        titleColor: 'text-gray-900',
        titleFont: 'font-light',
        titleAnimation: 'animate-fade-in',
        subtitleSize: 'text-base md:text-lg',
        subtitleColor: 'text-gray-600',
        subtitleFont: 'font-normal',
        subtitleAnimation: 'animate-fade-in-delay',
        messageContainer: 'bg-gray-50',
        messageSize: 'text-sm md:text-base',
        messageColor: 'text-gray-800',
        messageFont: 'font-normal',
        messageAnimation: 'animate-slide-up',
        emojiAnimation: 'animate-bounce',
        footerSection: 'text-center',
        footerText: 'text-base text-gray-700',
        creatorNameColor: 'text-gray-500'
      };
    default:
      return getSeniSeviyorumStyles('modern');
  }
}
