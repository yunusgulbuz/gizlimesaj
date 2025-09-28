'use client';

import type { TemplateTextFields } from '../../shared/types';

function DogumGunuStandardTemplate({ recipientName, message, designStyle, creatorName, textFields = {} }: {
  recipientName: string;
  message: string;
  designStyle: 'modern' | 'classic' | 'minimalist' | 'eglenceli';
  creatorName?: string;
  textFields?: TemplateTextFields;
}) {
  // Metin alanlarını al, yoksa default değerleri kullan
  const displayRecipientName = textFields.recipientName || recipientName;
  const displayAge = textFields.age;
  const displayMainMessage = textFields.mainMessage || message || "Bu özel günde sana en güzel dilekleri gönderiyorum. Yeni yaşın sana sağlık, mutluluk ve başarı getirsin. Doğum günün kutlu olsun!";
  const displayWishMessage = textFields.wishMessage;
  const displayFooterMessage = textFields.footerMessage;

  if (designStyle === 'eglenceli') {
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
                <p className="text-white/90 text-sm font-bold">
                  Hazırlayan: {creatorName}
                </p>
              </div>
            )}

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 border-4 border-yellow-300 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="mb-8">
                <div className="text-8xl mb-6 animate-bounce">🎂</div>
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text mb-6">
                  {displayRecipientName ? `${displayRecipientName}!` : 'Canım!'}
                  {displayAge && <span className="block text-3xl md:text-4xl mt-2">{displayAge} Yaşında! 🎉</span>}
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8 animate-pulse">
                  Doğum Günün Kutlu Olsun! 🎉
                </h2>
              </div>
              
              <div className="bg-yellow-100 rounded-2xl p-8 mb-8 border-2 border-yellow-300">
                <p className="text-lg md:text-xl text-orange-800 leading-relaxed font-bold">
                  {displayMainMessage}
                </p>
                {displayWishMessage && (
                  <p className="text-lg text-orange-700 mt-4 font-semibold">
                    {displayWishMessage}
                  </p>
                )}
              </div>

              {displayFooterMessage && (
                <div className="bg-pink-100 rounded-xl p-6 mb-6 border-2 border-pink-300">
                  <p className="text-md text-pink-800 font-bold">
                    {displayFooterMessage}
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-6 text-4xl">
                <span className="animate-bounce">🎈</span>
                <span className="animate-pulse">🎁</span>
                <span className="animate-bounce">🎊</span>
                <span className="animate-pulse">🎉</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern, Classic, Minimalist styles
  // const styles = getDesignStyles(designStyle);
  
  if (designStyle === 'modern') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Neon Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Creator Name */}
            {creatorName && (
              <div className="mb-8">
                <p className="text-white/70 text-sm font-medium">
                  Hazırlayan: {creatorName}
                </p>
              </div>
            )}

            <div className="mb-12">
              <div className="text-8xl mb-8 animate-bounce">🎂</div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-6">
                {displayRecipientName ? `${displayRecipientName}` : 'Canım'}
                {displayAge && <span className="block text-4xl md:text-5xl mt-4">{displayAge} Yaşında! ✨</span>}
              </h1>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-8">
                Doğum Günün Kutlu Olsun! 🎂
              </h2>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <p className="text-xl md:text-2xl text-white leading-relaxed font-medium">
                {displayMainMessage}
              </p>
              {displayWishMessage && (
                <p className="text-lg md:text-xl text-white/90 mt-4 leading-relaxed">
                  {displayWishMessage}
                </p>
              )}
            </div>

            {displayFooterMessage && (
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 mb-8">
                <p className="text-lg text-white font-medium">
                  {displayFooterMessage}
                </p>
              </div>
            )}

            <div className="flex justify-center space-x-6 text-4xl">
              <span className="animate-bounce">🎈</span>
              <span className="animate-pulse">🎁</span>
              <span className="animate-bounce">🎊</span>
              <span className="animate-pulse">🎉</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (designStyle === 'minimalist') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Creator Name */}
            {creatorName && (
              <div className="mb-8">
                <p className="text-gray-500 text-sm">
                  Hazırlayan: {creatorName}
                </p>
              </div>
            )}

            <div className="mb-12">
              <div className="text-6xl mb-8">🎂</div>
              <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
                {displayRecipientName ? `${displayRecipientName}` : 'Sevgili Dostum'}
                {displayAge && <span className="block text-3xl md:text-4xl mt-4 text-gray-600">{displayAge} Yaşında</span>}
              </h1>
              <h2 className="text-2xl md:text-3xl font-light text-gray-600 mb-8">
                Doğum Günün Kutlu Olsun
              </h2>
            </div>
            
            <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                {displayMainMessage}
              </p>
              {displayWishMessage && (
                <p className="text-md md:text-lg text-gray-600 mt-4 leading-relaxed">
                  {displayWishMessage}
                </p>
              )}
            </div>

            {displayFooterMessage && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-100">
                <p className="text-md text-gray-600">
                  {displayFooterMessage}
                </p>
              </div>
            )}

            <div className="flex justify-center space-x-4 text-2xl text-gray-400">
              <span>🎈</span>
              <span>🎁</span>
              <span>🎊</span>
              <span>🎉</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic style
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-300 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
      </div>

      {/* Lace Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-200/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-200/30 to-transparent"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Creator Name */}
          {creatorName && (
            <div className="mb-8">
              <p className="text-amber-600 text-sm font-medium">
                Hazırlayan: {creatorName}
              </p>
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border-2 border-amber-200 shadow-xl">
            <div className="mb-8">
              <div className="text-6xl mb-6">🎂</div>
              <h1 className="text-4xl md:text-6xl font-serif text-amber-800 mb-6">
                {displayRecipientName ? `${displayRecipientName}` : 'Sevgili Dostum'}
                {displayAge && <span className="block text-3xl md:text-4xl mt-4 text-amber-700">{displayAge} Yaşında</span>}
              </h1>
              <h2 className="text-3xl md:text-4xl font-serif text-amber-700 mb-8">
                Doğum Günün Kutlu Olsun
              </h2>
            </div>
            
            {/* Decorative Divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <span className="px-4 text-3xl">🌹</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>

            <div className="bg-amber-50/80 rounded-lg p-8 mb-8 border-2 border-amber-200">
              <p className="text-lg md:text-xl text-amber-900 leading-relaxed font-serif">
                {displayMainMessage}
              </p>
              {displayWishMessage && (
                <p className="text-md md:text-lg text-amber-800 mt-4 leading-relaxed font-serif">
                  {displayWishMessage}
                </p>
              )}
            </div>

            {displayFooterMessage && (
              <div className="bg-pink-50/80 rounded-lg p-6 mb-8 border border-pink-200">
                <p className="text-md text-pink-800 font-serif">
                  {displayFooterMessage}
                </p>
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

export default DogumGunuStandardTemplate;
