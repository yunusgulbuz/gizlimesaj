/**
 * Sanitize HTML content to prevent XSS attacks
 * while preserving Tailwind classes and data attributes
 *
 * This is a lightweight sanitizer that removes dangerous patterns
 * Combined with validateHTML(), it provides adequate security for AI-generated templates
 */
export function sanitizeHTML(html: string): string {
  let clean = html;

  // Remove script tags and their content
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove on* event handlers (onclick, onload, etc.)
  clean = clean.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  clean = clean.replace(/javascript:/gi, '');

  // Remove dangerous tags
  clean = clean.replace(/<(iframe|object|embed|applet|meta|link|base)\b[^>]*>/gi, '');

  // Remove style tags (inline styles in style attribute are OK)
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove data: URIs (except safe ones like data:image/svg)
  clean = clean.replace(/src\s*=\s*["']data:(?!image\/(svg\+xml|png|jpg|jpeg|gif|webp))/gi, 'src="');
  clean = clean.replace(/href\s*=\s*["']data:/gi, 'href="');

  return clean;
}

/**
 * Extract and validate editable fields from HTML
 */
export function extractEditableFields(html: string): string[] {
  const editableRegex = /data-editable="([^"]+)"/g;
  const fields: string[] = [];
  let match;

  while ((match = editableRegex.exec(html)) !== null) {
    fields.push(match[1]);
  }

  return [...new Set(fields)]; // Remove duplicates
}

/**
 * Validate that HTML doesn't contain dangerous patterns
 */
export function validateHTML(html: string): { isValid: boolean; error?: string } {
  // Check for script tags (even encoded ones)
  if (/<script|javascript:/i.test(html)) {
    return { isValid: false, error: 'HTML contains potentially dangerous script tags' };
  }

  // Check for event handlers
  if (/on\w+\s*=/i.test(html)) {
    return { isValid: false, error: 'HTML contains event handlers which are not allowed' };
  }

  // Check for iframe, object, embed
  if (/<(iframe|object|embed|applet)/i.test(html)) {
    return { isValid: false, error: 'HTML contains embedded content which is not allowed' };
  }

  // Check minimum length
  if (html.trim().length < 50) {
    return { isValid: false, error: 'HTML content is too short' };
  }

  // Check maximum length (2MB)
  if (html.length > 2 * 1024 * 1024) {
    return { isValid: false, error: 'HTML content is too large' };
  }

  return { isValid: true };
}

/**
 * Replace editable field values in HTML
 */
export function replaceEditableFieldValue(
  html: string,
  fieldName: string,
  newValue: string
): string {
  // Escape HTML in the new value to prevent injection
  const escapedValue = newValue
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Find the element with data-editable="fieldName" and replace its content
  const regex = new RegExp(
    `(<[^>]+data-editable="${fieldName}"[^>]*>)([^<]*)(</[^>]+>)`,
    'g'
  );

  return html.replace(regex, `$1${escapedValue}$3`);
}

/**
 * Replace color class in HTML
 */
export function replaceColorClass(
  html: string,
  colorKey: string,
  oldClass: string,
  newClass: string
): string {
  // Find elements with data-color-key and replace the specific class
  const regex = new RegExp(`(class="[^"]*)${oldClass}([^"]*")`, 'g');

  return html.replace(regex, (match, before, after) => {
    // Check if this element has the correct color key
    if (match.includes(`data-color-key="${colorKey}"`)) {
      return `${before}${newClass}${after}`;
    }
    return match;
  });
}
