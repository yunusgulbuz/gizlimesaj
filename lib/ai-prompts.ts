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

CRITICAL SECURITY RULES:
🚫 NEVER use JavaScript event handlers (onClick, onLoad, onMouseOver, etc.)
🚫 NEVER include <script> tags or javascript: protocol in links
✅ Use ONLY CSS animations (Tailwind animate-bounce, animate-pulse, animate-spin, @keyframes, transitions)
✅ Generate pure static HTML with Tailwind CSS classes only

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
- The creator name (it will be added automatically and is NOT editable)

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
  CRITICAL: The creator name element MUST have data-creator-name attribute (not data-editable!)
  This element should NOT be editable by users.

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
- Use ONLY TailwindCSS classes (no JavaScript event handlers)
- Make it responsive and mobile-friendly
- Include smooth CSS animations only
- Add data-editable attributes to all text content
- Include the COLOR_SCHEME JSON comment
- Generate REAL CONTENT in Turkish - NOT placeholders like {{TITLE}}, {{MESSAGE}}, {{RECIPIENT}}
- Create contextual example text based on category and user's request
- Only use {{CREATOR_NAME}} placeholder (for system to inject creator name)

CONTENT EXAMPLES BY CATEGORY:
- Romantic: "Sevgilim", "Seni Çok Seviyorum", "Sen hayatımın anlamısın..."
- Birthday: "Canım Dostum", "Mutlu Yıllar!", "Bu özel günde sana en güzel dileklerimi gönderiyorum..."
- Apology: "Değerli Dostum", "Özür Dilerim", "Sana verdiğim acı için çok üzgünüm..."
- Thank You: "Sevgili Arkadaşım", "Teşekkür Ederim", "Yardımların için sana ne kadar minnettar olduğumu..."

Generate the complete HTML now:`;
}

/**
 * Generate prompt using a base template
 * This maintains the structure and animations of premium templates
 */
export function generatePromptWithBase(
  baseTemplateStructure: string,
  category: string,
  userPrompt: string
): string {
  const categoryPrompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['romantic'];

  return `You are creating a premium HTML template using the base template as INSPIRATION. Your task is to create a unique design that matches the user's vision while maintaining the same level of quality and sophistication.

BASE TEMPLATE (Use as inspiration for style level and quality):
${baseTemplateStructure}

${categoryPrompt}

DESIGN APPROACH - Use Base Template as Inspiration:

1. **STYLE LEVEL**: Match the overall sophistication level (elegant/playful/modern/romantic) from the base template
2. **QUALITY STANDARDS**: Maintain high-quality animations, modern effects, and responsive design standards
3. **CREATIVE FREEDOM**: Freely adapt layout, colors, fonts, animations, and visual elements to match user's vision
4. **ANIMATION QUALITY**: Use smooth, professional animations (you can change types: floating→bouncing, fade→slide, petal fall→star twinkle, etc.)
5. **MODERN EFFECTS**: Use contemporary web effects (gradients, backdrop-blur, shadows, particles, parallax) but customize them based on user's request
6. **RESPONSIVE DESIGN**: Ensure mobile-first, fully responsive design with proper spacing
7. **REAL CONTENT**: Generate real, contextual example content - NEVER use {{PLACEHOLDER}} syntax

WHAT YOU CAN FREELY MODIFY:
✅ **Layout Structure**: Change from grid to flex, adjust element positioning, add/remove sections
✅ **Colors & Gradients**: Completely change color palette based on user's theme
✅ **Fonts**: Change font families, sizes, weights to match desired tone
✅ **Animation Types**: Change animation styles (keep quality high: smooth transitions, professional keyframes)
✅ **Decorative Elements**: Add/modify/replace elements (if base has petals, you can use stars, hearts, confetti, etc.)
✅ **Background Patterns**: Create different backgrounds (gradients, shapes, particles)
✅ **Element Sizes**: Adjust spacing, padding, margins, element dimensions
✅ **Visual Effects**: Modify blur amounts, shadow styles, opacity levels

WHAT YOU MUST KEEP:
🔒 **data-editable attributes**: All text content must have data-editable attributes
🔒 **{{CREATOR_NAME}} placeholder**: Include creator name section with data-creator-name attribute
   IMPORTANT: Creator name element structure MUST be:
   <p class="..." data-creator-name>Hazırlayan: {{CREATOR_NAME}}</p>
   DO NOT add data-editable to this element! Only data-creator-name attribute.
🔒 **Responsive design**: Mobile-first approach, works on all screen sizes
🔒 **High quality**: Maintain smooth animations and professional appearance
🔒 **Overall style level**: Keep the sophistication level (if base is elegant, result should be elegant)

CONTENT GENERATION RULES:
📝 **NO PLACEHOLDERS**: NEVER use {{TITLE}}, {{MESSAGE}}, {{RECIPIENT}}, {{FOOTER}} or similar placeholders
📝 **REAL EXAMPLES**: Generate real, contextual text content based on category and user's prompt
📝 **CATEGORY-APPROPRIATE**: Match content tone to category (romantic=loving, birthday=celebratory, apology=sincere, etc.)
📝 **TURKISH LANGUAGE**: Write all content in Turkish (except {{CREATOR_NAME}} which is a system placeholder)

CRITICAL SECURITY RULES:
🚫 **NO JavaScript**: NEVER use event handlers (onClick, onLoad, onMouseOver, etc.) or inline JavaScript
🚫 **NO Script Tags**: Never include <script> tags or javascript: protocol
✅ **CSS Animations ONLY**: Use ONLY CSS animations (Tailwind animate-bounce, animate-pulse, animate-spin, @keyframes, transitions)
✅ **Static HTML**: Generate pure HTML with Tailwind CSS classes only

EXAMPLES OF USER-DRIVEN CHANGES WITH REAL CONTENT:

1. **Romantic Category** + "Uzay temalı mesaj":
   - Recipient: "Sevgilim" or "Canım Aşkım"
   - Title: "Sen Benim Yıldızımsın"
   - Main Message: "Seni ilk gördüğüm günden beri hayatım bir galaksi kadar genişledi. Sen benim parlak yıldızımsın, karanlık gecelerimde bana ışık tutuyorsun."
   - Footer: "Sonsuzluğa kadar seninle olmak isteyen birinden 💫"
   - Design: Replace petals with twinkling stars, dark blue/purple gradients, constellation patterns

2. **Birthday Category** + "Renkli kutlama":
   - Recipient: "Canım Kardeşim"
   - Title: "Mutlu Yıllar!"
   - Main Message: "Bu özel günde sana en güzel dileklerimi gönderiyorum. Yeni yaşın renkli anılarla, neşeyle ve mutlulukla dolu olsun!"
   - Footer: "Seni çok seven kardeşinden 🎉"
   - Design: Vibrant colors, confetti animations, bouncy effects

3. **Apology Category** + "Özür dilemek istiyorum":
   - Recipient: "Değerli Dostum"
   - Title: "Özür Dilerim"
   - Main Message: "Sana verdiğim acı için çok üzgünüm. Yaptığım hatayı fark ettim ve bunun bir daha tekrarlanmaması için elimden geleni yapacağım."
   - Footer: "Affını dileyen arkadaşından 🙏"
   - Design: Soft pastels, calming animations, gentle effects

USER REQUEST:
${userPrompt}

Now create a unique, premium HTML template that fulfills this request.

IMPORTANT REMINDERS:
✅ Use the base template as inspiration for quality level, but freely adapt all visual aspects
✅ Generate REAL CONTENT in Turkish - not placeholders like {{TITLE}} or {{MESSAGE}}
✅ Create contextual example text based on the category and user's request
✅ Only use {{CREATOR_NAME}} placeholder (for the system to inject creator name)
✅ Make all text elements have data-editable attributes
✅ Use pure HTML + Tailwind CSS (no JavaScript event handlers)

Return ONLY the HTML code - no explanations, no markdown blocks.`;
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
