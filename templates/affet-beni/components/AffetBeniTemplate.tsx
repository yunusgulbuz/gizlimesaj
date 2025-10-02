'use client';

import { useState, useEffect } from 'react';
import type { TemplateTextFields } from '../../shared/types';

interface AffetBeniTemplateProps {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
  textFields?: TemplateTextFields;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

export default function AffetBeniTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields = {},
  isEditable = false,
  onTextFieldChange
}: AffetBeniTemplateProps) {
  const styles = getAffetBeniStyles(designStyle);

  // Local editable state
  const [localRecipientName, setLocalRecipientName] = useState(recipientName);
  const [localSubtitle, setLocalSubtitle] = useState('');
  const [localMainMessage, setLocalMainMessage] = useState('');
  const [localFooterMessage, setLocalFooterMessage] = useState('');
  const [localQuoteMessage, setLocalQuoteMessage] = useState('');

  // Initialize local state with text fields
  useEffect(() => {
    setLocalRecipientName(recipientName);
    setLocalSubtitle(textFields?.subtitle || (designStyle === 'eglenceli' ? '🤪 Affet Beni 🤪' : '🌹 Affet Beni 🌹'));
    setLocalMainMessage(textFields?.mainMessage || message || (designStyle === 'eglenceli'
      ? "Tamam tamam, kabul ediyorum! Biraz saçmaladım ve seni üzdüm. Ama bak, şimdi burada sana özel bir mesaj hazırladım! Bu kadar çaba sarf ettikten sonra beni affetmemen mümkün değil, değil mi? 😄🎭"
      : "Biliyorum ki seni üzdüm ve bunun için çok pişmanım. Yaptığım hatalar için senden özür diliyorum. Sen benim için çok değerlisin ve seni kaybetmek istemiyorum. Lütfen beni affet. 🙏💕"
    ));
    setLocalFooterMessage(textFields?.footerMessage || (designStyle === 'eglenceli'
      ? "Hadi ama, bu kadar tatlı olmaya devam edemem! 😂💝"
      : "Seni çok seviyorum ve özür diliyorum! 💝"
    ));
    setLocalQuoteMessage(textFields?.quoteMessage || (designStyle === 'eglenceli'
      ? '"Hayatta en güzel şey, hatalarımızdan gülerek öğrenmektir!" 😄'
      : '"Gerçek aşk, hatalarımızı kabul etmek ve affedilmeyi umut etmektir."'
    ));
  }, [recipientName, message, textFields, designStyle]);

  // Handle content change
  const handleContentChange = (key: string, value: string) => {
    // Update local state immediately
    if (key === 'recipientName') setLocalRecipientName(value);
    else if (key === 'subtitle') setLocalSubtitle(value);
    else if (key === 'mainMessage') setLocalMainMessage(value);
    else if (key === 'footerMessage') setLocalFooterMessage(value);
    else if (key === 'quoteMessage') setLocalQuoteMessage(value);

    // Notify parent component
    if (onTextFieldChange) {
      onTextFieldChange(key, value);
    }
  };

  // Get text values - use local state if editable, otherwise use props
  const displayRecipientName = isEditable ? localRecipientName : (textFields.recipientName || recipientName);
  const displaySubtitle = isEditable ? localSubtitle : (textFields.subtitle || (designStyle === 'eglenceli' ? '🤪 Affet Beni 🤪' : '🌹 Affet Beni 🌹'));
  const displayMainMessage = isEditable ? localMainMessage : (textFields.mainMessage || message || (designStyle === 'eglenceli'
    ? "Tamam tamam, kabul ediyorum! Biraz saçmaladım ve seni üzdüm. Ama bak, şimdi burada sana özel bir mesaj hazırladım! Bu kadar çaba sarf ettikten sonra beni affetmemen mümkün değil, değil mi? 😄🎭"
    : "Biliyorum ki seni üzdüm ve bunun için çok pişmanım. Yaptığım hatalar için senden özür diliyorum. Sen benim için çok değerlisin ve seni kaybetmek istemiyorum. Lütfen beni affet. 🙏💕"
  ));
  const displayFooterMessage = isEditable ? localFooterMessage : (textFields.footerMessage || (designStyle === 'eglenceli'
    ? "Hadi ama, bu kadar tatlı olmaya devam edemem! 😂💝"
    : "Seni çok seviyorum ve özür diliyorum! 💝"
  ));
  const displayQuoteMessage = isEditable ? localQuoteMessage : (textFields.quoteMessage || (designStyle === 'eglenceli'
    ? '"Hayatta en güzel şey, hatalarımızdan gülerek öğrenmektir!" 😄'
    : '"Gerçek aşk, hatalarımızı kabul etmek ve affedilmeyi umut etmektir."'
  ));
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.background} relative overflow-hidden`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating petals */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            {designStyle === 'eglenceli' ? '🎈' : '🌸'}
          </div>
        ))}
        
        {/* Corner decorative borders */}
        <div className={`absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 ${styles.borderColor}`}></div>
        <div className={`absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 ${styles.borderColor}`}></div>
        <div className={`absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 ${styles.borderColor}`}></div>
        <div className={`absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 ${styles.borderColor}`}></div>
      </div>
      
      <div className={`max-w-4xl mx-auto p-4 sm:p-6 md:p-8 text-center relative z-10 ${styles.container}`}>
        {/* Creator Name Display */}
        {creatorName && (
          <div className="text-center mb-4 sm:mb-6">
            <p className={`text-xs sm:text-sm ${styles.creatorNameColor}`}>
              Hazırlayan: {creatorName}
            </p>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className={`${styles.iconContainer} ${styles.iconBackground} rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center`}>
            <span className="text-3xl sm:text-4xl md:text-5xl">{designStyle === 'eglenceli' ? '😅' : '🙏'}</span>
          </div>
          <h1
            className={`${styles.titleSize} ${styles.titleFont} ${styles.titleColor} mb-3 sm:mb-4 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('recipientName', e.currentTarget.textContent || '')}
          >
            {displayRecipientName ? `Sevgili ${displayRecipientName},` : 'Sevgilim,'}
          </h1>
          <h2
            className={`${styles.subtitleSize} ${styles.subtitleFont} ${styles.subtitleColor} mb-6 sm:mb-8 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('subtitle', e.currentTarget.textContent || '')}
          >
            {displaySubtitle}
          </h2>
        </div>
        
        {/* Decorative divider */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className={`flex-1 h-px bg-gradient-to-r from-transparent ${styles.dividerColor} to-transparent`}></div>
          <span className="px-3 sm:px-4 text-xl sm:text-2xl md:text-3xl">{designStyle === 'eglenceli' ? '🎭' : '💐'}</span>
          <div className={`flex-1 h-px bg-gradient-to-r from-transparent ${styles.dividerColor} to-transparent`}></div>
        </div>

        {/* Message Section */}
        <div className={`${styles.messageContainer} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl mb-8 sm:mb-10 md:mb-12 relative`}>
          <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 text-2xl sm:text-3xl ${styles.quoteColor}`}>"</div>
          <div className={`absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-2xl sm:text-3xl ${styles.quoteColor} rotate-180`}>"</div>

          <div className="mb-4 sm:mb-6">
            <div className="flex justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
              {designStyle === 'eglenceli'
                ? ['🎪', '🎭', '🎨', '🎭', '🎪'].map((emoji, i) => (
                    <span
                      key={i}
                      className="text-xl sm:text-2xl md:text-3xl animate-bounce"
                      style={{animationDelay: `${i * 0.1}s`}}
                    >
                      {emoji}
                    </span>
                  ))
                : ['🌸', '💐', '🌹', '💐', '🌸'].map((emoji, i) => (
                    <span
                      key={i}
                      className="text-xl sm:text-2xl md:text-3xl animate-bounce"
                      style={{animationDelay: `${i * 0.1}s`}}
                    >
                      {emoji}
                    </span>
                  ))
              }
            </div>
            <p
              className={`${styles.messageSize} ${styles.messageFont} ${styles.messageColor} leading-relaxed mb-4 sm:mb-6 break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('mainMessage', e.currentTarget.textContent || '')}
            >
              {displayMainMessage}
            </p>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="space-y-4 sm:space-y-6">
          <p
            className={`${styles.messageSize} ${styles.messageFont} ${styles.messageColor} font-medium break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors inline-block' : ''}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange('footerMessage', e.currentTarget.textContent || '')}
          >
            {displayFooterMessage}
          </p>

          <div className="flex justify-center space-x-2 sm:space-x-3">
            {designStyle === 'eglenceli'
              ? [
                  <span key={0} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0s'}}>😅</span>,
                  <span key={1} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.1s'}}>🎪</span>,
                  <span key={2} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>🤹</span>,
                  <span key={3} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>🎭</span>,
                  <span key={4} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.4s'}}>🎨</span>,
                  <span key={5} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>💝</span>
                ]
              : [
                  <span key={0} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0s'}}>🙏</span>,
                  <span key={1} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.1s'}}>💐</span>,
                  <span key={2} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>🌹</span>,
                  <span key={3} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>💕</span>,
                  <span key={4} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.4s'}}>🌸</span>,
                  <span key={5} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>💝</span>
                ]
            }
          </div>

          <div className={`${styles.messageContainer} p-3 sm:p-4 rounded-lg`}>
            <p
              className={`text-xs sm:text-sm ${styles.messageColor} italic break-words ${isEditable ? 'hover:bg-white/10 cursor-text rounded-lg p-2 transition-colors' : ''}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('quoteMessage', e.currentTarget.textContent || '')}
            >
              {displayQuoteMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAffetBeniStyles(designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli') {
  switch (designStyle) {
    case 'modern':
      return {
        background: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600',
        backgroundElements: 'text-white/20',
        floatingHeart: 'text-pink-300/30',
        container: 'bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20',
        iconContainer: 'w-16 h-16 sm:w-20 sm:h-20',
        iconSize: 'w-16 h-16 sm:w-20 sm:h-20',
        iconBackground: 'bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200',
        heartColor: 'text-pink-500',
        titleSize: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
        titleColor: 'text-gray-800',
        titleFont: 'font-bold',
        titleAnimation: 'animate-pulse',
        subtitleSize: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
        subtitleColor: 'text-gray-600',
        subtitleFont: 'font-medium',
        subtitleAnimation: 'animate-bounce',
        messageContainer: 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200',
        messageSize: 'text-base sm:text-lg md:text-xl',
        messageColor: 'text-gray-700',
        messageFont: 'font-normal',
        messageAnimation: 'animate-fade-in',
        emojiAnimation: 'animate-bounce',
        footerSection: 'bg-gradient-to-r from-purple-100 to-pink-100',
        footerText: 'text-purple-800',
        creatorNameColor: 'text-white/80',
        borderColor: 'border-purple-300/30',
        dividerColor: 'via-purple-300',
        quoteColor: 'text-purple-400/50'
      };
    case 'classic':
      return {
        background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
        backgroundElements: 'text-amber-300/20',
        floatingHeart: 'text-amber-400/30',
        container: 'bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border-4 border-amber-200',
        iconContainer: 'w-20 h-20 sm:w-24 sm:h-24',
        iconSize: 'w-20 h-20 sm:w-24 sm:h-24',
        iconBackground: 'bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-amber-300',
        heartColor: 'text-amber-600',
        titleSize: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
        titleColor: 'text-amber-800',
        titleFont: 'font-serif font-bold',
        titleAnimation: 'animate-pulse',
        subtitleSize: 'text-base sm:text-lg md:text-xl lg:text-2xl',
        subtitleColor: 'text-amber-700',
        subtitleFont: 'font-serif font-medium',
        subtitleAnimation: 'animate-bounce',
        messageContainer: 'bg-amber-50/90 border-2 border-amber-200 shadow-inner',
        messageSize: 'text-sm sm:text-base md:text-lg',
        messageColor: 'text-amber-900',
        messageFont: 'font-serif leading-relaxed',
        messageAnimation: 'animate-fade-in',
        emojiAnimation: 'animate-bounce',
        footerSection: 'bg-amber-100/50',
        footerText: 'text-amber-800',
        creatorNameColor: 'text-amber-600',
        borderColor: 'border-amber-300/30',
        dividerColor: 'via-amber-300',
        quoteColor: 'text-amber-400/50'
      };
    case 'minimalist':
      return {
        background: 'bg-gray-50',
        backgroundElements: 'text-gray-300/20',
        floatingHeart: 'text-gray-400/30',
        container: 'bg-white rounded-lg shadow-sm border border-gray-200',
        iconContainer: 'w-14 h-14 sm:w-16 sm:h-16',
        iconSize: 'w-14 h-14 sm:w-16 sm:h-16',
        iconBackground: 'bg-gray-100 border border-gray-300',
        heartColor: 'text-gray-600',
        titleSize: 'text-xl sm:text-2xl md:text-3xl',
        titleColor: 'text-gray-900',
        titleFont: 'font-light',
        titleAnimation: '',
        subtitleSize: 'text-base sm:text-lg md:text-xl',
        subtitleColor: 'text-gray-600',
        subtitleFont: 'font-normal',
        subtitleAnimation: '',
        messageContainer: 'bg-gray-50 border border-gray-200',
        messageSize: 'text-sm sm:text-base',
        messageColor: 'text-gray-800',
        messageFont: 'font-normal',
        messageAnimation: '',
        emojiAnimation: '',
        footerSection: 'bg-gray-100/50',
        footerText: 'text-gray-700',
        creatorNameColor: 'text-gray-500',
        borderColor: 'border-gray-300/30',
        dividerColor: 'via-gray-300',
        quoteColor: 'text-gray-400/50'
      };
    case 'eglenceli':
      return {
        background: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
        backgroundElements: 'text-white/20',
        floatingHeart: 'text-yellow-300/30',
        container: 'bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-yellow-300 transform rotate-1',
        iconContainer: 'w-20 h-20 sm:w-24 sm:h-24',
        iconSize: 'w-20 h-20 sm:w-24 sm:h-24',
        iconBackground: 'bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400 animate-pulse',
        heartColor: 'text-yellow-500',
        titleSize: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
        titleColor: 'text-gray-800',
        titleFont: 'font-bold transform -rotate-1',
        titleAnimation: 'animate-bounce',
        subtitleSize: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
        subtitleColor: 'text-orange-600',
        subtitleFont: 'font-bold transform rotate-1',
        subtitleAnimation: 'animate-pulse',
        messageContainer: 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg transform -rotate-1',
        messageSize: 'text-base sm:text-lg md:text-xl',
        messageColor: 'text-gray-700',
        messageFont: 'font-medium',
        messageAnimation: 'animate-bounce',
        emojiAnimation: 'animate-spin',
        footerSection: 'bg-gradient-to-r from-yellow-100 to-orange-100 transform rotate-1',
        footerText: 'text-orange-800 font-bold',
        creatorNameColor: 'text-white/90 font-bold',
        borderColor: 'border-yellow-400/50',
        dividerColor: 'via-yellow-400',
        quoteColor: 'text-yellow-500/70'
      };
    default:
      return getAffetBeniStyles('modern');
  }
}
