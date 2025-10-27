/**
 * AI Template Base Library
 * Premium template bases for AI-generated content
 */

export interface BaseTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  categories: string[]; // Which categories this template fits
  structure: string; // HTML structure with placeholders
  placeholders: string[]; // List of available placeholders
  styleGuide: string; // Color and style guidelines for AI
}

export const BASE_TEMPLATES: BaseTemplate[] = [
  {
    id: 'romantic-letter',
    name: 'Romantik Mektup',
    description: 'Zarflı mektup tasarımı, gül yaprakları animasyonu, vintage stil',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop&q=80',
    categories: ['romantic', 'thank-you', 'apology'],
    placeholders: ['TITLE', 'MESSAGE', 'SIGNATURE', 'RECIPIENT', 'CREATOR_NAME'],
    styleGuide: 'Warm beige tones (#f6f0e7, #e8d9c7), serif fonts, petal animations',
    structure: `<div class="relative min-h-screen w-full overflow-hidden bg-[#f6f0e7] text-[#53392b]">
  <!-- Background pattern -->
  <div class="absolute inset-0 opacity-80" style="
    background-image: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(246,240,231,0.95) 60%),
    url(\\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath fill='%23d8c8b5' fill-opacity='0.25' d='M0 40L40 0h120l40 40v120l-40 40H40L0 160z'/%3E%3C/svg%3E\\");
    background-size: cover, 200px 200px;
    background-blend-mode: multiply;
  "></div>

  <!-- Decorative border frame -->
  <div class="absolute inset-10 border-4 border-[#e8d9c7] rounded-[2rem] pointer-events-none" style="box-shadow: 0 20px 60px rgba(83,57,43,0.15)"></div>

  <!-- Falling petals animation -->
  <div class="absolute inset-0">
    <div class="absolute top-[-10%] left-[5%] h-16 w-12 animate-[petalFall_9s_linear_infinite]">
      <div class="w-full h-full rounded-full bg-gradient-radial from-[rgba(255,180,200,0.9)] to-[rgba(214,120,152,0.8)] blur-[0.6px]"></div>
    </div>
    <div class="absolute top-[-10%] left-[25%] h-16 w-12 animate-[petalFall_10s_linear_infinite_1.2s]">
      <div class="w-full h-full rounded-full bg-gradient-radial from-[rgba(255,180,200,0.9)] to-[rgba(214,120,152,0.8)] blur-[0.6px]"></div>
    </div>
    <div class="absolute top-[-10%] left-[45%] h-16 w-12 animate-[petalFall_8.5s_linear_infinite_0.6s]">
      <div class="w-full h-full rounded-full bg-gradient-radial from-[rgba(255,180,200,0.9)] to-[rgba(214,120,152,0.8)] blur-[0.6px]"></div>
    </div>
    <div class="absolute top-[-10%] left-[65%] h-16 w-12 animate-[petalFall_11s_linear_infinite_2.1s]">
      <div class="w-full h-full rounded-full bg-gradient-radial from-[rgba(255,180,200,0.9)] to-[rgba(214,120,152,0.8)] blur-[0.6px]"></div>
    </div>
    <div class="absolute top-[-10%] left-[85%] h-16 w-12 animate-[petalFall_9.8s_linear_infinite_2.7s]">
      <div class="w-full h-full rounded-full bg-gradient-radial from-[rgba(255,180,200,0.9)] to-[rgba(214,120,152,0.8)] blur-[0.6px]"></div>
    </div>
  </div>

  <!-- Main content -->
  <div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
    <!-- Creator name -->
    <div class="flex flex-col items-center gap-1 sm:gap-2 mb-6 sm:mb-8 text-center">
      <div class="text-[0.65rem] uppercase tracking-[0.4em] text-[#b28c78]" data-creator-name>
        Hazırlayan: {{CREATOR_NAME}}
      </div>
    </div>

    <!-- Envelope design -->
    <div class="relative w-full max-w-3xl">
      <div class="relative mx-auto h-[360px] sm:h-[460px] w-full max-w-xl sm:max-w-2xl">
        <!-- Envelope flap -->
        <div class="absolute inset-x-8 sm:inset-x-12 top-6 sm:top-8 h-32 sm:h-40 rounded-2xl bg-[#e5d4c4]"
             style="box-shadow: 0 10px 30px rgba(83,57,43,0.15); transform: rotateX(75deg); transform-origin: top; transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);">
        </div>

        <!-- Envelope body -->
        <div class="absolute inset-x-8 sm:inset-x-12 top-20 sm:top-24 bottom-8 sm:bottom-12 rounded-2xl bg-[#e5d4c4] border-2 border-[#d8c8b5]"
             style="box-shadow: 0 20px 60px rgba(83,57,43,0.2);">

          <!-- Letter paper -->
          <div class="absolute inset-4 sm:inset-6 bg-[#fdfcfa] rounded-xl overflow-y-auto custom-scrollbar"
               style="box-shadow: inset 0 2px 8px rgba(83,57,43,0.08);">
            <div class="p-6 sm:p-8">
              <!-- Recipient -->
              <div class="mb-6 sm:mb-8">
                <p class="text-base sm:text-lg text-[#8b7355] italic" data-editable="recipient">
                  {{RECIPIENT}}
                </p>
              </div>

              <!-- Title -->
              <h2 class="text-2xl sm:text-3xl font-serif text-[#53392b] mb-4 sm:mb-6" data-editable="title">
                {{TITLE}}
              </h2>

              <!-- Message -->
              <p class="text-sm sm:text-base leading-relaxed text-[#6b5d52] mb-6 sm:mb-8 whitespace-pre-wrap" data-editable="message">
                {{MESSAGE}}
              </p>

              <!-- Signature -->
              <div class="text-right">
                <p class="text-sm sm:text-base text-[#8b7355] italic font-serif" data-editable="signature">
                  {{SIGNATURE}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Keyframe animations -->
  <style>
    @keyframes petalFall {
      0% { transform: translateY(-10%) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
    }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(139,115,85,0.1); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139,115,85,0.3); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139,115,85,0.5); }
  </style>
</div>`
  },

  {
    id: 'glass-modern',
    name: 'Cam Efektli Modern',
    description: 'Glassmorphism, gradient arkaplan, kalp partikülleri, modern minimal',
    thumbnail: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop&q=80',
    categories: ['romantic', 'birthday', 'celebration'],
    placeholders: ['TITLE', 'SUBTITLE', 'MESSAGE', 'BUTTON_LABEL', 'CREATOR_NAME'],
    styleGuide: 'Glass effect (bg-white/20, backdrop-blur), pink-purple gradients, floating hearts',
    structure: `<div class="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(160deg,_#ffe5f4,_#fde9ff_45%,_#f2f6ff)]">
  <!-- Radial gradient overlay -->
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,192,203,0.45),_transparent_65%)]"></div>

  <!-- Floating heart particles -->
  <div class="absolute inset-0">
    <span class="absolute block rounded-full bg-gradient-to-br from-[#ff9ab5] via-[#ff80c0] to-[#fbc1ff] blur-[18px]"
          style="width: 120px; height: 120px; left: 15%; top: 20%; opacity: 0.2; animation: glass-heart-float 14s ease-in-out 0s infinite;"></span>
    <span class="absolute block rounded-full bg-gradient-to-br from-[#ff9ab5] via-[#ff80c0] to-[#fbc1ff] blur-[18px]"
          style="width: 180px; height: 180px; left: 65%; top: 40%; opacity: 0.18; animation: glass-heart-float 16s ease-in-out 1.5s infinite;"></span>
    <span class="absolute block rounded-full bg-gradient-to-br from-[#ff9ab5] via-[#ff80c0] to-[#fbc1ff] blur-[18px]"
          style="width: 140px; height: 140px; left: 85%; top: 65%; opacity: 0.22; animation: glass-heart-float 13s ease-in-out 2.8s infinite;"></span>
    <span class="absolute block rounded-full bg-gradient-to-br from-[#ff9ab5] via-[#ff80c0] to-[#fbc1ff] blur-[18px]"
          style="width: 100px; height: 100px; left: 25%; top: 75%; opacity: 0.15; animation: glass-heart-float 17s ease-in-out 1.2s infinite;"></span>
  </div>

  <!-- Glass card container -->
  <div class="relative z-10 flex min-h-screen items-center justify-center px-4 pb-20 pt-16 sm:px-8">
    <div class="relative w-full max-w-2xl overflow-hidden rounded-[34px] border border-white/40 bg-white/20 p-8 shadow-[0_40px_120px_rgba(255,160,190,0.45)] backdrop-blur-2xl transition-all duration-700 opacity-100 translate-y-0">
      <!-- Glass gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/0"></div>

      <!-- Content -->
      <div class="relative flex flex-col items-center gap-6 text-center">
        <!-- Creator name -->
        <div class="text-xs uppercase tracking-[0.3em] text-pink-600/70 mb-2" data-creator-name>
          Hazırlayan: {{CREATOR_NAME}}
        </div>

        <!-- Decorative heart icon -->
        <div class="relative">
          <div class="text-7xl animate-pulse" style="animation-duration: 2s;">❤️</div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600"
            data-editable="title">
          {{TITLE}}
        </h1>

        <!-- Subtitle -->
        <p class="text-lg sm:text-xl text-gray-700 font-medium max-w-xl" data-editable="subtitle">
          {{SUBTITLE}}
        </p>

        <!-- Message box -->
        <div class="w-full max-w-lg mt-4 p-6 rounded-2xl bg-white/30 border border-white/50 backdrop-blur-sm">
          <p class="text-base sm:text-lg text-gray-800 leading-relaxed whitespace-pre-wrap" data-editable="message">
            {{MESSAGE}}
          </p>
        </div>

        <!-- Action button (optional) -->
        <button class="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-[0_10px_30px_rgba(255,100,150,0.4)] hover:shadow-[0_15px_40px_rgba(255,100,150,0.6)] transition-all duration-300 hover:scale-105"
                data-editable="buttonLabel">
          {{BUTTON_LABEL}}
        </button>
      </div>
    </div>
  </div>

  <!-- Animations -->
  <style>
    @keyframes glass-heart-float {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-30px) scale(1.1); }
    }
  </style>
</div>`
  },

  {
    id: 'professional-frame',
    name: 'Profesyonel Çerçeve',
    description: 'Minimalist beyaz çerçeve, temiz tipografi, profesyonel görünüm',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop&q=80',
    categories: ['birthday', 'celebration', 'thank-you', 'classic'],
    placeholders: ['TITLE', 'MESSAGE', 'FOOTER', 'DATE', 'POSITION', 'CREATOR_NAME'],
    styleGuide: 'Clean white (#f8f7f4), minimal borders, sans-serif fonts, professional aesthetic',
    structure: `<div class="relative min-h-screen bg-[#f8f7f4] px-6 py-10 text-slate-800 sm:px-10 lg:px-16 lg:py-16">
  <!-- Subtle radial gradient -->
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(227,225,217,0.55),_transparent_55%)]"></div>

  <!-- Main card container -->
  <div class="relative mx-auto flex min-h-[82vh] max-w-4xl items-center justify-center">
    <div class="w-full max-w-3xl rounded-[36px] border border-[#E0E0E0] bg-white/95 p-8 shadow-[0_20px_60px_rgba(17,24,39,0.08)] transition-all duration-700 sm:p-12 opacity-100 translate-y-0">

      <div class="flex flex-col items-center text-center">
        <!-- Creator name -->
        <div class="text-xs uppercase tracking-[0.3em] text-slate-400 mb-6" data-creator-name>
          Hazırlayan: {{CREATOR_NAME}}
        </div>

        <!-- Meta information -->
        <div class="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-400">
          <span data-editable="date">{{DATE}}</span>
          <span class="hidden h-[1px] w-10 bg-slate-200 sm:block"></span>
          <span data-editable="position">{{POSITION}}</span>
        </div>

        <!-- Title -->
        <h2 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl" data-editable="title">
          {{TITLE}}
        </h2>

        <!-- Message -->
        <p class="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg whitespace-pre-wrap" data-editable="message">
          {{MESSAGE}}
        </p>
      </div>

      <!-- Decorative photo frame placeholder -->
      <div class="relative mt-10 flex justify-center">
        <div class="relative w-full max-w-[360px] overflow-hidden rounded-[28px] border border-[#E6E3DC] bg-[#f5f3ef] shadow-[0_14px_40px_rgba(30,41,59,0.08)]">
          <div class="flex aspect-[3/4] items-center justify-center text-sm text-slate-400">
            📷 Fotoğraf alanı
          </div>
        </div>
      </div>

      <!-- Footer message -->
      <div class="mt-10 flex flex-col items-center gap-3 border-t border-slate-200 pt-8">
        <p class="text-sm text-slate-500 max-w-md text-center" data-editable="footer">
          {{FOOTER}}
        </p>
      </div>
    </div>
  </div>
</div>`
  },

  {
    id: 'gradient-celebration',
    name: 'Gradient Kutlama',
    description: 'Canlı gradient, konfeti animasyonları, enerji dolu',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop&q=80',
    categories: ['birthday', 'celebration', 'fun'],
    placeholders: ['TITLE', 'SUBTITLE', 'MESSAGE', 'GREETING', 'CREATOR_NAME'],
    styleGuide: 'Vibrant gradients (pink, gold, purple), confetti, energetic animations',
    structure: `<div class="relative min-h-screen overflow-hidden" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffd700 100%); background-size: 400% 400%; animation: gradient-shift 15s ease infinite;">
  <!-- Floating confetti -->
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute w-3 h-3 bg-yellow-400 rounded-full animate-[confetti-fall_3s_linear_infinite]" style="left: 10%; animation-delay: 0s;"></div>
    <div class="absolute w-2 h-2 bg-pink-400 rounded-full animate-[confetti-fall_3.5s_linear_infinite]" style="left: 25%; animation-delay: 0.5s;"></div>
    <div class="absolute w-3 h-3 bg-purple-400 rounded-full animate-[confetti-fall_3.2s_linear_infinite]" style="left: 45%; animation-delay: 1s;"></div>
    <div class="absolute w-2 h-2 bg-blue-400 rounded-full animate-[confetti-fall_3.8s_linear_infinite]" style="left: 60%; animation-delay: 1.5s;"></div>
    <div class="absolute w-3 h-3 bg-red-400 rounded-full animate-[confetti-fall_3.3s_linear_infinite]" style="left: 80%; animation-delay: 0.8s;"></div>
    <div class="absolute w-2 h-2 bg-green-400 rounded-full animate-[confetti-fall_3.6s_linear_infinite]" style="left: 90%; animation-delay: 2s;"></div>
  </div>

  <!-- Sparkle effects -->
  <div class="absolute inset-0">
    <div class="absolute w-1 h-1 bg-white rounded-full animate-pulse" style="left: 15%; top: 20%; animation-duration: 2s;"></div>
    <div class="absolute w-1 h-1 bg-white rounded-full animate-pulse" style="left: 75%; top: 35%; animation-duration: 2.5s; animation-delay: 0.5s;"></div>
    <div class="absolute w-1 h-1 bg-white rounded-full animate-pulse" style="left: 35%; top: 65%; animation-duration: 1.8s; animation-delay: 1s;"></div>
    <div class="absolute w-1 h-1 bg-white rounded-full animate-pulse" style="left: 85%; top: 75%; animation-duration: 2.2s; animation-delay: 1.5s;"></div>
  </div>

  <!-- Main content -->
  <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
    <div class="text-center max-w-3xl">
      <!-- Creator name -->
      <div class="mb-8 text-xs uppercase tracking-[0.4em] text-white/80 animate-fade-in" data-creator-name>
        Hazırlayan: {{CREATOR_NAME}}
      </div>

      <!-- Emoji decoration -->
      <div class="text-6xl sm:text-8xl mb-8 animate-bounce">
        🎉
      </div>

      <!-- Greeting -->
      <p class="text-xl sm:text-2xl text-white font-light mb-4 animate-fade-in-up" style="animation-delay: 0.2s;" data-editable="greeting">
        {{GREETING}}
      </p>

      <!-- Title -->
      <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up drop-shadow-2xl"
          style="animation-delay: 0.4s;"
          data-editable="title">
        {{TITLE}}
      </h1>

      <!-- Subtitle -->
      <h2 class="text-2xl sm:text-3xl text-white/90 font-light mb-8 animate-fade-in-up"
          style="animation-delay: 0.6s;"
          data-editable="subtitle">
        {{SUBTITLE}}
      </h2>

      <!-- Message card -->
      <div class="mx-auto max-w-2xl bg-white/20 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-white/30 shadow-2xl animate-fade-in-up"
           style="animation-delay: 0.8s;">
        <p class="text-lg sm:text-xl text-white leading-relaxed whitespace-pre-wrap" data-editable="message">
          {{MESSAGE}}
        </p>
      </div>

      <!-- Decorative stars -->
      <div class="mt-8 flex justify-center gap-4 text-4xl animate-fade-in-up" style="animation-delay: 1s;">
        <span class="animate-spin-slow">⭐</span>
        <span class="animate-bounce" style="animation-delay: 0.2s;">✨</span>
        <span class="animate-spin-slow" style="animation-delay: 0.4s;">⭐</span>
      </div>
    </div>
  </div>

  <!-- Animations -->
  <style>
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes confetti-fall {
      0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-fade-in { animation: fade-in 1s ease-out forwards; }
    .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
    .animate-spin-slow { animation: spin-slow 8s linear infinite; }
  </style>
</div>`
  },

  {
    id: 'elegant-classic',
    name: 'Klasik Şık',
    description: 'Altın detaylar, serif fontlar, çiçek süslemeleri, klasik zarif',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&q=80',
    categories: ['romantic', 'thank-you', 'classic', 'apology'],
    placeholders: ['RECIPIENT', 'TITLE', 'MESSAGE', 'SPECIAL_MESSAGE', 'FOOTER', 'CREATOR_NAME'],
    styleGuide: 'Gold accents (#d4af37), ivory background (#fef7ed), serif fonts, flower decorations',
    structure: `<div class="relative min-h-screen" style="background: linear-gradient(45deg, #fef7ed 0%, #fdf2f8 50%, #fef3c7 100%);">
  <!-- Lace texture pattern -->
  <div class="absolute inset-0 opacity-10">
    <div class="w-full h-full" style='background-image: url("data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23d4af37\\' fill-opacity=\\'0.3\\'%3E%3Ccircle cx=\\'30\\' cy=\\'30\\' r=\\'2\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");'></div>
  </div>

  <!-- Floating flower decorations -->
  <div class="absolute top-10 left-10 text-pink-300 text-2xl opacity-60 animate-pulse">🌸</div>
  <div class="absolute top-20 right-16 text-pink-300 text-xl opacity-60 animate-pulse" style="animation-delay: 1s;">🌺</div>
  <div class="absolute bottom-20 left-20 text-pink-300 text-2xl opacity-60 animate-pulse" style="animation-delay: 2s;">🌹</div>
  <div class="absolute bottom-16 right-12 text-pink-300 text-xl opacity-60 animate-pulse" style="animation-delay: 0.5s;">🌷</div>

  <!-- Main content -->
  <div class="relative z-10 min-h-screen flex items-center justify-center p-8">
    <div class="max-w-4xl mx-auto text-center">
      <!-- Creator name -->
      <div class="mb-8">
        <p class="text-sm text-rose-600 font-serif italic" data-creator-name>
          Hazırlayan: {{CREATOR_NAME}}
        </p>
      </div>

      <!-- Decorative frame -->
      <div class="border-4 border-yellow-600 border-double rounded-3xl p-12 bg-white/80 backdrop-blur-sm shadow-2xl">
        <!-- Top decoration -->
        <div class="flex justify-center mb-8">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-px bg-yellow-600"></div>
            <div class="text-3xl">🌹</div>
            <div class="w-12 h-px bg-yellow-600"></div>
          </div>
        </div>

        <!-- Recipient -->
        <h1 class="text-4xl md:text-6xl font-serif text-rose-800 mb-6 italic" data-editable="recipient">
          {{RECIPIENT}}
        </h1>

        <!-- Title -->
        <h2 class="text-3xl md:text-5xl font-serif text-yellow-700 mb-8 leading-relaxed" data-editable="title">
          {{TITLE}}
        </h2>

        <!-- Message box -->
        <div class="bg-rose-50 border-l-4 border-rose-300 p-6 rounded-r-lg mb-8 max-w-2xl mx-auto">
          <p class="text-lg text-rose-800 leading-relaxed font-serif italic whitespace-pre-wrap" data-editable="message">
            {{MESSAGE}}
          </p>

          <!-- Special message -->
          <div class="mt-4 pt-4 border-t border-rose-200">
            <p class="text-base text-rose-700 italic" data-editable="specialMessage">
              "{{SPECIAL_MESSAGE}}"
            </p>
          </div>
        </div>

        <!-- Footer message -->
        <div class="mb-6">
          <p class="text-lg text-rose-600 font-serif" data-editable="footer">
            {{FOOTER}}
          </p>
        </div>

        <!-- Bottom decoration -->
        <div class="flex justify-center items-center space-x-6">
          <div class="text-2xl animate-pulse">💐</div>
          <div class="text-3xl animate-pulse" style="animation-delay: 0.5s;">💍</div>
          <div class="text-2xl animate-pulse" style="animation-delay: 1s;">💒</div>
        </div>
      </div>
    </div>
  </div>
</div>`
  },

  {
    id: 'minimalist-modern',
    name: 'Minimalist Modern',
    description: 'Beyaz arka plan, tek renk vurgu, temiz çizgiler, ultra minimalist',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&q=80',
    categories: ['birthday', 'thank-you', 'celebration', 'classic'],
    placeholders: ['RECIPIENT', 'TITLE', 'MESSAGE', 'TAGLINE', 'CREATOR_NAME'],
    styleGuide: 'Pure white background, single accent color (pink/purple), minimal animations',
    structure: `<div class="min-h-screen bg-white flex items-center justify-center p-8">
  <div class="max-w-3xl mx-auto text-center">
    <!-- Creator name -->
    <div class="mb-12">
      <p class="text-xs text-gray-400 font-light tracking-widest uppercase" data-creator-name>
        Hazırlayan: {{CREATOR_NAME}}
      </p>
    </div>

    <!-- Main content -->
    <div class="space-y-16">
      <div class="space-y-8">
        <!-- Recipient -->
        <h1 class="text-3xl md:text-4xl font-light text-gray-900 tracking-wide" data-editable="recipient">
          {{RECIPIENT}}
        </h1>

        <!-- Decorative line -->
        <div class="w-24 h-px bg-pink-400 mx-auto"></div>

        <!-- Title -->
        <h2 class="text-5xl md:text-7xl font-thin text-gray-800 leading-tight whitespace-pre-wrap" data-editable="title">
          {{TITLE}}
        </h2>
      </div>

      <!-- Message -->
      <div class="max-w-xl mx-auto">
        <p class="text-lg text-gray-600 leading-relaxed font-light whitespace-pre-wrap" data-editable="message">
          {{MESSAGE}}
        </p>

        <!-- Tagline -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <p class="text-base text-gray-500 italic" data-editable="tagline">
            {{TAGLINE}}
          </p>
        </div>
      </div>

      <!-- Minimal icon -->
      <div class="flex justify-center">
        <div class="w-16 h-16 border border-pink-400 rounded-full flex items-center justify-center">
          <span class="text-2xl">💍</span>
        </div>
      </div>
    </div>
  </div>
</div>`
  },

  {
    id: 'playful-fun',
    name: 'Eğlenceli Oyunlu',
    description: 'İnteraktif elementler, parlak renkler, oyuncu animasyonlar',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop&q=80',
    categories: ['fun', 'birthday', 'teen', 'celebration'],
    placeholders: ['TITLE', 'MESSAGE', 'BUTTON_YES', 'BUTTON_NO', 'AFTER_YES', 'CREATOR_NAME'],
    styleGuide: 'Bright colors (neon pinks, purples, blues), bouncing animations, interactive elements',
    structure: `<div class="relative min-h-screen overflow-hidden" style="background: linear-gradient(45deg, #ff69b4 0%, #ffd700 25%, #ff6b6b 50%, #4ecdc4 75%, #ff69b4 100%); background-size: 400% 400%; animation: gradient 8s ease infinite;">
  <!-- Animated background emoji -->
  <div class="absolute inset-0">
    <div class="absolute animate-pulse" style="left: 10%; top: 15%; animation-delay: 0s;">
      <span class="text-2xl opacity-30">💖</span>
    </div>
    <div class="absolute animate-pulse" style="left: 75%; top: 25%; animation-delay: 1s;">
      <span class="text-2xl opacity-30">⭐</span>
    </div>
    <div class="absolute animate-pulse" style="left: 25%; top: 60%; animation-delay: 2s;">
      <span class="text-2xl opacity-30">✨</span>
    </div>
    <div class="absolute animate-pulse" style="left: 85%; top: 70%; animation-delay: 0.5s;">
      <span class="text-2xl opacity-30">💫</span>
    </div>
  </div>

  <!-- Main content -->
  <div class="relative z-10 min-h-screen flex items-center justify-center p-8">
    <div class="max-w-4xl mx-auto text-center">
      <!-- Creator name -->
      <div class="mb-8">
        <p class="text-sm text-white font-bold tracking-wide animate-pulse" data-creator-name>
          Hazırlayan: {{CREATOR_NAME}}
        </p>
      </div>

      <!-- Fun card -->
      <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-2xl">
        <!-- Big emoji -->
        <div class="text-6xl mb-6 animate-bounce">💝</div>

        <!-- Title -->
        <h1 class="text-3xl md:text-5xl font-bold text-gray-800 mb-6" data-editable="title">
          {{TITLE}}
        </h1>

        <!-- Message -->
        <p class="text-lg text-gray-600 mb-8 whitespace-pre-wrap" data-editable="message">
          {{MESSAGE}}
        </p>

        <!-- Interactive buttons -->
        <div class="flex flex-col items-center space-y-8">
          <button class="bg-green-500 hover:bg-green-600 text-white text-2xl px-12 py-6 rounded-full transform hover:scale-110 transition-all duration-300 shadow-lg animate-pulse"
                  data-editable="buttonYes">
            {{BUTTON_YES}}
          </button>

          <button class="bg-red-500 hover:bg-red-600 text-white text-xl px-8 py-4 rounded-full transform transition-all duration-300 shadow-lg"
                  data-editable="buttonNo">
            {{BUTTON_NO}}
          </button>
        </div>

        <!-- After message (hidden initially) -->
        <div class="mt-8 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-300 hidden" id="afterYes">
          <p class="text-base text-gray-700 italic" data-editable="afterYes">
            {{AFTER_YES}}
          </p>
        </div>
      </div>

      <!-- Fun emoji row -->
      <div class="flex justify-center space-x-4 text-4xl">
        <span class="animate-spin" style="animation-duration: 3s;">💍</span>
        <span class="animate-bounce">💒</span>
        <span class="animate-pulse">👰</span>
        <span class="animate-bounce" style="animation-delay: 0.2s;">🤵</span>
      </div>
    </div>
  </div>

  <!-- Animations -->
  <style>
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  </style>
</div>`
  },
];

/**
 * Get template by ID
 */
export function getBaseTemplate(id: string): BaseTemplate | undefined {
  return BASE_TEMPLATES.find(t => t.id === id);
}

/**
 * Get templates filtered by category
 */
export function getTemplatesByCategory(category: string): BaseTemplate[] {
  return BASE_TEMPLATES.filter(t => t.categories.includes(category));
}

/**
 * Get all template IDs
 */
export function getAllTemplateIds(): string[] {
  return BASE_TEMPLATES.map(t => t.id);
}
