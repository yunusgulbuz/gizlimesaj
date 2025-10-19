/**
 * AI Template Generation Prompts
 * System prompts for different template categories
 */

export const CATEGORY_PROMPTS: Record<string, string> = {
  romantic: `You are creating a romantic message template. The design should be:
- Beautiful and elegant with romantic color schemes (pinks, reds, purples)
- Include heart symbols, love-themed decorations
- Warm and emotional typography
- Smooth animations (floating hearts, gentle fades)`,

  teen: `You are creating a fun, vibrant template for teenagers. The design should be:
- Energetic with bright colors (blues, purples, neon accents)
- Modern and trendy
- Include fun emojis and playful elements
- Cool animations (bouncing, rotating effects)`,

  classic: `You are creating a timeless classic template. The design should be:
- Traditional and elegant
- Classic color schemes (ivory, gold, dark greens)
- Serif fonts for headers
- Gentle, classic animations`,

  fun: `You are creating an entertaining, playful template. The design should be:
- Vibrant and colorful
- Include playful elements and fun patterns
- Interactive-looking design
- Energetic animations`,

  elegant: `You are creating an elegant, refined template. The design should be:
- Sophisticated and luxurious
- Muted, premium color palette
- Clean lines and spacious layout
- Smooth, graceful animations`,

  birthday: `You are creating a birthday celebration template. The design should be:
- Festive with balloons, confetti, cake imagery
- Bright, celebratory colors
- Party-themed decorations
- Joyful animations (confetti falling, balloons floating)`,

  apology: `You are creating an apology/forgiveness template. The design should be:
- Soft, calming colors (pastels, light blues)
- Gentle and sincere aesthetic
- Include peaceful imagery (flowers, dove symbols)
- Subtle, calming animations`,

  'thank-you': `You are creating a thank you/gratitude template. The design should be:
- Warm and appreciative colors (yellows, oranges, warm greens)
- Include gratitude symbols (hands, flowers, hearts)
- Friendly and welcoming design
- Gentle, appreciative animations`,

  celebration: `You are creating a celebration template. The design should be:
- Festive and energetic
- Bright, celebratory colors with gold accents
- Include celebration elements (stars, sparkles, ribbons)
- Dynamic, celebratory animations (sparkles, fireworks effects)`,
};

export const SYSTEM_PROMPT = `You are an expert frontend developer specializing in creating beautiful, responsive HTML templates using TailwindCSS.

IMPORTANT REQUIREMENTS:
1. Use ONLY HTML and TailwindCSS classes - NO external CSS files or <style> tags
2. Make the template fully responsive (mobile-first design)
3. Use semantic HTML5 elements
4. Include smooth CSS animations using Tailwind's animation utilities
5. The template should be a single, self-contained HTML structure
6. Use Tailwind's gradient, shadow, and backdrop utilities for modern effects
7. Ensure text is readable with proper contrast
8. Include appropriate spacing and padding
9. The template must work in a div container (not a full page)

EDITABLE ELEMENTS (VERY IMPORTANT):
You MUST make ALL text content editable by wrapping them with data-editable attributes.
Examples:
- Main title/recipient: <h1 class="..." data-editable="recipientName">Sevgilim</h1>
- Subtitle: <h2 class="..." data-editable="subtitle">Seni Çok Seviyorum</h2>
- Main message: <p class="..." data-editable="mainMessage">Bu özel mesaj...</p>
- Secondary messages: <p class="..." data-editable="message2">İkinci mesaj...</p>
- Footer: <p class="..." data-editable="footerMessage">Seni düşünen...</p>
- Quotes: <blockquote class="..." data-editable="quote">Alıntı...</blockquote>
- Any other text content: <div class="..." data-editable="customText1">...</div>

Make EVERY text element editable except:
- Decorative emojis/icons that are not part of the message
- Background/design elements
- The creator name (it will be added automatically)

STRUCTURE:
- Minimum height: min-h-screen
- Center content vertically and horizontally
- Use Tailwind's flex or grid for layouts
- Include decorative background elements (gradients, shapes)
- Add animated elements (floating, pulsing, rotating)
- IMPORTANT: Add a creator name section near the top (inside the main container):
  <div class="text-center mb-8">
    <p class="text-sm opacity-70" data-creator-name>Hazırlayan: {{CREATOR_NAME}}</p>
  </div>

COLOR SCHEME METADATA:
After the HTML, include a JSON comment with editable color classes:
<!-- COLOR_SCHEME
{
  "primary": "bg-rose-500",
  "secondary": "bg-purple-500",
  "accent": "bg-pink-400",
  "text": "text-gray-800",
  "background": "bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50"
}
-->

RETURN ONLY THE HTML CODE - no explanations, no markdown code blocks, just the raw HTML.`;

export function generatePrompt(category: string, userPrompt: string): string {
  const categoryPrompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['romantic'];

  return `${SYSTEM_PROMPT}

${categoryPrompt}

USER REQUEST:
${userPrompt}

Generate a beautiful, responsive HTML template that fulfills this request. Remember to:
- Use ONLY TailwindCSS classes
- Make it responsive and mobile-friendly
- Include smooth animations
- Add data-editable attributes to recipient name, main message, and footer
- Include the COLOR_SCHEME JSON comment

Generate the complete HTML now:`;
}

export function extractColorScheme(html: string): Record<string, string> {
  const colorSchemeMatch = html.match(/<!--\s*COLOR_SCHEME\s*([\s\S]*?)\s*-->/);
  if (colorSchemeMatch) {
    try {
      return JSON.parse(colorSchemeMatch[1]);
    } catch (e) {
      console.error('Failed to parse color scheme:', e);
    }
  }

  // Default color scheme
  return {
    primary: 'bg-rose-500',
    secondary: 'bg-purple-500',
    accent: 'bg-pink-400',
    text: 'text-gray-800',
    background: 'bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50'
  };
}
