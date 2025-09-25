'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { TemplateTextFields } from '../../shared/types';

interface OzurDilerimClassicTemplateProps {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
  textFields?: TemplateTextFields;
}

export default function OzurDilerimClassicTemplate({
  recipientName,
  message,
  designStyle,
  creatorName,
  textFields
}: OzurDilerimClassicTemplateProps) {
  const [showAcceptButton, setShowAcceptButton] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Show accept button after 3 seconds
    const timer = setTimeout(() => {
      setShowAcceptButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    setIsAccepted(true);
    setShowAnimation(true);
  };

  const renderModernStyle = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
      {/* Cinematic curtain effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse"></div>
      
      {/* Spotlight effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-white/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto p-8 text-center relative z-10">
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-300">Hazırlayan: {creatorName}</p>
          </div>
        )}
        
        <div className="mb-12">
          <h1 className="text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            {recipientName ? `${recipientName},` : 'Sevgili Arkadaşım,'}
          </h1>
          <h2 className="text-5xl text-red-400 font-light mb-8 animate-pulse">
            Özür Dilerim
          </h2>
        </div>
        
        <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-red-500/30 mb-12">
          <p className="text-xl text-gray-200 leading-relaxed">
            {message || "Yaptığım hata için gerçekten çok üzgünüm. Seni kırdığım için kendimi affetmiyorum. Umarım beni anlayışla karşılar ve özrümü kabul edersin."}
          </p>
        </div>
        
        {showAcceptButton && !isAccepted && (
          <Button 
            onClick={handleAccept}
            className="bg-red-600 hover:bg-red-500 text-white px-12 py-4 text-xl rounded-full shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
          >
            Özürümü Kabul Et
          </Button>
        )}
        
        {isAccepted && (
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <p className="text-3xl text-green-400 font-bold">Teşekkürler!</p>
            {showAnimation && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderClassicStyle = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 flex items-center justify-center relative">
      {/* Rose petals background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            🌹
          </div>
        ))}
      </div>
      
      <div className="max-w-3xl mx-auto p-8 text-center relative z-10">
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-amber-700">Hazırlayan: {creatorName}</p>
          </div>
        )}
        
        {/* Envelope effect */}
        <div className="bg-gradient-to-br from-amber-100 to-rose-100 p-12 rounded-lg shadow-2xl border-4 border-amber-200 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-rose-300 rounded-full flex items-center justify-center">
            💌
          </div>
          
          <div className="mb-8">
            <h1 className="text-5xl font-serif text-amber-800 mb-4">
              {recipientName ? `Sevgili ${recipientName},` : 'Sevgili Arkadaşım,'}
            </h1>
            <h2 className="text-4xl text-rose-600 font-serif italic mb-6">
              Özür Dilerim
            </h2>
          </div>
          
          <div className="bg-white/70 p-6 rounded-lg border-2 border-rose-200 mb-8">
            <p className="text-lg text-amber-900 leading-relaxed font-serif">
              {message || "Yaptığım hata için gerçekten çok üzgünüm. Seni kırdığım için kendimi affetmiyorum. Umarım beni anlayışla karşılar ve özrümü kabul edersin."}
            </p>
          </div>
          
          {showAcceptButton && !isAccepted && (
            <Button 
              onClick={handleAccept}
              className="bg-rose-500 hover:bg-rose-400 text-white px-10 py-3 text-lg rounded-full shadow-lg hover:shadow-rose-300/50 transition-all duration-300 font-serif"
            >
              Mektubu Aç
            </Button>
          )}
          
          {isAccepted && (
            <div className="text-center">
              <div className="text-5xl mb-4">🌹</div>
              <p className="text-2xl text-rose-600 font-serif italic">Özürümü Kabul Ettiğin İçin Teşekkürler</p>
              {showAnimation && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-bounce"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    >
                      🌸
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMinimalistStyle = () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 text-center">
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-gray-500">Hazırlayan: {creatorName}</p>
          </div>
        )}
        
        <div className="mb-12">
          <div className="text-6xl mb-8 animate-pulse">💙</div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            {recipientName ? `${recipientName},` : 'Sevgili Arkadaşım,'}
          </h1>
          <h2 className="text-3xl text-blue-400 font-thin mb-8">
            Özür Dilerim
          </h2>
        </div>
        
        <div className="border-l-4 border-blue-400 pl-6 mb-12">
          <p className="text-lg text-gray-700 leading-relaxed font-light">
            {message || "Yaptığım hata için gerçekten çok üzgünüm. Seni kırdığım için kendimi affetmiyorum. Umarım beni anlayışla karşılar ve özrümü kabul edersin."}
          </p>
        </div>
        
        {showAcceptButton && !isAccepted && (
          <Button 
            onClick={handleAccept}
            variant="outline"
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-2 text-base rounded-none transition-all duration-300"
          >
            Kabul Et
          </Button>
        )}
        
        {isAccepted && (
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
              <div className="absolute inset-4 bg-blue-400/40 rounded-full animate-ping animation-delay-75"></div>
              <div className="absolute inset-8 bg-blue-400/60 rounded-full animate-ping animation-delay-150"></div>
            </div>
            <p className="text-xl text-blue-400 font-light">Teşekkürler</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderFunStyle = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['⭐', '🌟', '✨', '💫'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>
      
      <div className="max-w-3xl mx-auto p-8 text-center relative z-10">
        {creatorName && (
          <div className="mb-6">
            <p className="text-sm text-white/80">Hazırlayan: {creatorName}</p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">😔</div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg comic-font">
            {recipientName ? `${recipientName}!` : 'Hey Dostum!'}
          </h1>
          <div className="bg-white/90 p-6 rounded-3xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <h2 className="text-4xl text-purple-600 font-bold comic-font">
              Özür Dilerim! 🙏
            </h2>
          </div>
        </div>
        
        <div className="bg-white/90 p-8 rounded-3xl shadow-2xl mb-8 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
          <p className="text-xl text-gray-800 leading-relaxed comic-font">
            {message || "Yaptığım hata için gerçekten çok üzgünüm. Seni kırdığım için kendimi affetmiyorum. Umarım beni anlayışla karşılar ve özrümü kabul edersin."}
          </p>
        </div>
        
        {showAcceptButton && !isAccepted && (
          <div className="relative">
            <div className="text-6xl mb-4 animate-bounce">🧎‍♂️</div>
            <Button 
              onClick={handleAccept}
              className="bg-green-500 hover:bg-green-400 text-white px-12 py-4 text-xl rounded-full shadow-2xl hover:shadow-green-400/50 transition-all duration-300 hover:scale-110 comic-font"
            >
              Özürümü Kabul Et! 🌸
            </Button>
          </div>
        )}
        
        {isAccepted && (
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <div className="text-6xl mb-4">🌺</div>
            <p className="text-4xl text-white font-bold comic-font drop-shadow-lg">
              Yaşasın! Teşekkürler! 🥳
            </p>
            {showAnimation && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce text-4xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  >
                    🎊
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .comic-font {
          font-family: 'Comic Sans MS', cursive, sans-serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-75 {
          animation-delay: 0.75s;
        }
        
        .animation-delay-150 {
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );

  switch (designStyle) {
    case 'modern':
      return renderModernStyle();
    case 'classic':
      return renderClassicStyle();
    case 'minimalist':
      return renderMinimalistStyle();
    case 'eglenceli':
      return renderFunStyle();
    default:
      return renderClassicStyle();
  }
}