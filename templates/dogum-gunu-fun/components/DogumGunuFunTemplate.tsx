'use client';

import { useState } from 'react';
import type { TemplateTextFields } from '../../shared/types';

function DogumGunuFunTemplate({ recipientName, message, designStyle, creatorName, textFields = {} }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
  textFields?: TemplateTextFields;
}) {
  const displayRecipientName = textFields.recipientName || recipientName;
  const displayAge = textFields.age;
  const displayMainMessage =
    textFields.mainMessage ||
    message ||
    "Bu özel günde sana en güzel dilekleri gönderiyorum. Yeni yaşın sana sağlık, mutluluk ve başarı getirsin. Doğum günün kutlu olsun!";
  const displayWishMessage = textFields.wishMessage;
  const displayFooterMessage = textFields.footerMessage;

  const baseProps: DogumGunuFunTemplateProps = {
    recipientName: displayRecipientName,
    mainMessage: displayMainMessage,
    creatorName,
    age: displayAge,
    wishMessage: displayWishMessage,
    footerMessage: displayFooterMessage,
  };

  switch (designStyle) {
    case 'modern':
      return <DogumGunuFunModernTemplate {...baseProps} />;
    case 'minimalist':
      return <DogumGunuFunMinimalistTemplate {...baseProps} />;
    case 'eglenceli':
      return <DogumGunuFunPlayfulTemplate {...baseProps} />;
    case 'classic':
    default:
      return <DogumGunuFunClassicTemplate {...baseProps} />;
  }
}

interface DogumGunuFunTemplateProps {
  recipientName?: string;
  mainMessage: string;
  creatorName?: string;
  age?: string;
  wishMessage?: string;
  footerMessage?: string;
}

function DogumGunuFunModernTemplate({ recipientName, mainMessage, creatorName, age, wishMessage, footerMessage }: DogumGunuFunTemplateProps) {
  const [showPartyEffects, setShowPartyEffects] = useState(false);

  const triggerPartyEffects = () => {
    setShowPartyEffects(true);
    setTimeout(() => setShowPartyEffects(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-400/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-400/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-purple-400/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-300/30 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Neon Lines */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60"></div>
        <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-40"></div>
        <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40"></div>
      </div>

      {/* Floating Balloons Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-10 text-4xl animate-float-up-1">🎈</div>
        <div className="absolute bottom-0 left-32 text-3xl animate-float-up-2">🎈</div>
        <div className="absolute bottom-0 right-20 text-4xl animate-float-up-3">🎈</div>
        <div className="absolute bottom-0 right-40 text-3xl animate-float-up-1">🎈</div>
      </div>

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 text-2xl animate-confetti-1">🎊</div>
        <div className="absolute top-32 right-1/3 text-xl animate-confetti-2">🎉</div>
        <div className="absolute top-40 left-1/2 text-2xl animate-confetti-3">🎊</div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Creator Name */}
          {creatorName && (
            <div className="mb-8">
              <p className="text-white/80 text-sm font-medium">Hazırlayan: {creatorName}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-lg">
                {recipientName ? `${recipientName},` : 'Canım,'}
                {age && <span className="block text-4xl md:text-5xl mt-4">{age} Yaşında! ✨</span>}
              </h1>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-8">
                Doğum Günün Kutlu Olsun! 🎂
              </h2>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <p className="text-xl md:text-2xl text-white leading-relaxed font-medium">{mainMessage}</p>
              {wishMessage && (
                <p className="text-lg md:text-xl text-white/90 mt-4 leading-relaxed">{wishMessage}</p>
              )}
            </div>

            {footerMessage && (
              <div className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm rounded-xl p-6 mb-8">
                <p className="text-lg text-white font-medium">{footerMessage}</p>
              </div>
            )}

            {/* Gift Button with Neon Glow */}
            <button
              onClick={triggerPartyEffects}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold text-xl shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">🎉 Kutlama</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Party Effects */}
            {showPartyEffects && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 text-4xl animate-bounce">🎊</div>
                <div className="absolute top-32 right-32 text-3xl animate-pulse">🎉</div>
                <div className="absolute bottom-32 left-32 text-4xl animate-spin">✨</div>
                <div className="absolute bottom-20 right-20 text-3xl animate-bounce">🎈</div>
                <div className="absolute top-1/2 left-1/4 text-2xl animate-ping">💫</div>
                <div className="absolute top-1/3 right-1/4 text-2xl animate-pulse">🌟</div>
                <div className="absolute bottom-1/3 left-1/2 text-3xl animate-bounce">🎊</div>
                <div className="absolute top-3/4 right-1/3 text-2xl animate-spin">✨</div>
              </div>
            )}

            <div className="flex justify-center space-x-6 text-4xl mt-8">
              <span className="animate-bounce">🎈</span>
              <span className="animate-pulse">🎁</span>
              <span className="animate-bounce">🎊</span>
              <span className="animate-pulse">🎉</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-up-1 {
          0% { transform: translateY(100vh) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(360deg); }
        }
        @keyframes float-up-2 {
          0% { transform: translateY(100vh) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(-360deg); }
        }
        @keyframes float-up-3 {
          0% { transform: translateY(100vh) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(180deg); }
        }
        @keyframes confetti-1 {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes confetti-2 {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(-720deg); opacity: 0; }
        }
        @keyframes confetti-3 {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-float-up-1 { animation: float-up-1 8s infinite linear; }
        .animate-float-up-2 { animation: float-up-2 10s infinite linear; }
        .animate-float-up-3 { animation: float-up-3 12s infinite linear; }
        .animate-confetti-1 { animation: confetti-1 6s infinite linear; }
        .animate-confetti-2 { animation: confetti-2 7s infinite linear; }
        .animate-confetti-3 { animation: confetti-3 8s infinite linear; }
      `}</style>
    </div>
  );
}

export default DogumGunuFunTemplate;

function DogumGunuFunClassicTemplate({ recipientName, mainMessage, creatorName, age, wishMessage, footerMessage }: DogumGunuFunTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-300 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
      </div>

      {/* Golden Dust Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-amber-300 rounded-full animate-ping"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Creator Name */}
          {creatorName && (
            <div className="mb-8">
              <p className="text-amber-700 text-sm font-serif">Hazırlayan: {creatorName}</p>
            </div>
          )}

          {/* Decorative Golden Frame */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl border-4 border-amber-300 p-12">
            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-amber-400"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-amber-400"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-amber-400"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-amber-400"></div>

            <div className="mb-8">
              <div className="text-6xl mb-6">🎂</div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-800 mb-6">
                {recipientName ? `Sevgili ${recipientName},` : 'Sevgili Dostum,'}
                {age && <span className="block text-3xl md:text-4xl mt-4 text-amber-700">{age} Yaşını Kutluyoruz ✨</span>}
              </h1>
              <h2 className="text-3xl md:text-4xl font-serif text-amber-700 mb-8">Doğum Günün Kutlu Olsun</h2>
            </div>
            
            {/* Decorative Divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <span className="px-4 text-3xl">🌹</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>

            <div className="bg-amber-50/80 rounded-lg p-8 mb-8 border-2 border-amber-200">
              <p className="text-lg md:text-xl text-amber-900 leading-relaxed font-serif">{mainMessage}</p>
              {wishMessage && (
                <p className="text-md md:text-lg text-amber-800 mt-4 leading-relaxed font-serif">{wishMessage}</p>
              )}
            </div>

            {footerMessage && (
              <div className="bg-pink-50/80 rounded-lg p-6 mb-8 border border-pink-200">
                <p className="text-md text-pink-800 font-serif">{footerMessage}</p>
              </div>
            )}

            <div className="flex justify-center space-x-6 text-3xl">
              <span className="animate-pulse">🌸</span>
              <span className="animate-bounce">🎁</span>
              <span className="animate-pulse">🌹</span>
              <span className="animate-bounce">✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DogumGunuFunMinimalistTemplate({ recipientName, mainMessage, creatorName, age, wishMessage, footerMessage }: DogumGunuFunTemplateProps) {
  const [showPartyEffects, setShowPartyEffects] = useState(false);

  const triggerPartyEffects = () => {
    setShowPartyEffects(true);
    setTimeout(() => setShowPartyEffects(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gray-400"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-px bg-gray-400"></div>
        <div className="absolute bottom-1/3 left-1/2 w-px h-24 bg-gray-400"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Creator Name */}
          {creatorName && (
            <div className="mb-12">
              <p className="text-gray-500 text-sm font-light">Hazırlayan: {creatorName}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-8">
                {recipientName || 'Sevgili Dostum'}
                {age && <span className="block text-3xl md:text-4xl mt-4 text-gray-600">{age} Yaş</span>}
              </h1>
              <h2 className="text-2xl md:text-3xl font-normal text-gray-600 mb-8">Doğum Günün Kutlu Olsun</h2>
              <div className="w-16 h-1 bg-orange-400 mx-auto mb-8"></div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200 text-left">
              <p className="text-base md:text-lg text-gray-800 leading-relaxed font-normal">{mainMessage}</p>
              {wishMessage && (
                <p className="text-base text-gray-600 mt-4 leading-relaxed">{wishMessage}</p>
              )}
            </div>

            {footerMessage && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-gray-600">
                {footerMessage}
              </div>
            )}

            <button
              onClick={triggerPartyEffects}
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-normal"
            >
              Kutlama
            </button>

            {showPartyEffects && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 text-2xl animate-bounce text-orange-400">🎊</div>
                <div className="absolute top-32 right-32 text-xl animate-pulse text-orange-400">🎉</div>
                <div className="absolute bottom-32 left-32 text-2xl animate-ping text-orange-400">✨</div>
                <div className="absolute bottom-20 right-20 text-xl animate-bounce text-orange-400">🎈</div>
                <div className="absolute top-1/2 left-1/4 text-lg animate-pulse text-orange-400">💫</div>
                <div className="absolute top-1/3 right-1/4 text-lg animate-ping text-orange-400">🌟</div>
              </div>
            )}

            <div className="flex justify-center space-x-8 text-2xl mt-8 text-gray-400">
              <span>🎂</span>
              <span>🎁</span>
              <span>🎉</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DogumGunuFunPlayfulTemplate({ recipientName, mainMessage, creatorName, age, wishMessage, footerMessage }: DogumGunuFunTemplateProps) {
  const [showSurprise, setShowSurprise] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 relative overflow-hidden">
      {/* Cartoon Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 text-6xl animate-bounce">🎂</div>
        <div className="absolute top-32 right-32 text-4xl animate-spin-slow">🎈</div>
        <div className="absolute bottom-32 left-32 text-5xl animate-bounce">🎁</div>
        <div className="absolute bottom-20 right-20 text-4xl animate-pulse">🎊</div>
      </div>

      {/* Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 text-3xl animate-float-left">🎉</div>
        <div className="absolute top-1/3 right-10 text-3xl animate-float-right">🎂</div>
        <div className="absolute bottom-1/4 left-20 text-3xl animate-float-left">🎈</div>
        <div className="absolute bottom-1/3 right-20 text-3xl animate-float-right">🎊</div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Creator Name */}
          {creatorName && (
            <div className="mb-8">
              <p className="text-white/90 text-sm font-bold">Hazırlayan: {creatorName}</p>
            </div>
          )}

          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 border-4 border-yellow-300 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="mb-8">
              <div className="text-8xl mb-6 animate-bounce">🎂</div>
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text mb-6">
                {recipientName ? `${recipientName}!` : 'Canım!'}
                {age && <span className="block text-3xl md:text-4xl mt-2">{age} Yaş Partisi 🎉</span>}
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8 animate-pulse">Doğum Günün Kutlu Olsun! 🎉</h2>
            </div>
            
            <div className="bg-yellow-100 rounded-2xl p-8 mb-8 border-2 border-yellow-300">
              <p className="text-lg md:text-xl text-orange-800 leading-relaxed font-bold">{mainMessage}</p>
              {wishMessage && (
                <p className="text-lg text-orange-700 mt-4 font-semibold">{wishMessage}</p>
              )}
            </div>

            {footerMessage && (
              <div className="bg-pink-100 rounded-xl p-6 mb-6 border-2 border-pink-300">
                <p className="text-md text-pink-800 font-bold">{footerMessage}</p>
              </div>
            )}

            <button
              onClick={() => setShowSurprise(!showSurprise)}
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white font-black text-xl shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110 transform"
            >
              🎁 Kutlama!
            </button>

            {showSurprise && (
              <div className="mt-8 animate-bounce">
                <div className="text-6xl mb-4">🎊🎉🎊</div>
                <p className="text-2xl font-bold text-pink-600">Mutlu Yıllar! 🎂✨</p>
              </div>
            )}

            <div className="flex justify-center space-x-4 text-4xl mt-8">
              <span className="animate-bounce">🎈</span>
              <span className="animate-pulse">🎁</span>
              <span className="animate-bounce">🎊</span>
              <span className="animate-pulse">🎉</span>
              <span className="animate-bounce">🎂</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-left {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-20px) translateY(-10px); }
        }
        @keyframes float-right {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(20px) translateY(-10px); }
        }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        .animate-float-left { animation: float-left 3s ease-in-out infinite; }
        .animate-float-right { animation: float-right 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
