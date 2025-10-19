import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * while preserving Tailwind classes and data attributes
 */
export function sanitizeHTML(html: string): string {
  // Configure DOMPurify to allow data attributes and common HTML elements
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'img', 'ul', 'ol', 'li', 'br', 'hr', 'strong', 'em',
      'b', 'i', 'u', 'section', 'article', 'header', 'footer',
      'nav', 'main', 'aside', 'figure', 'figcaption', 'svg',
      'path', 'circle', 'rect', 'line', 'polyline', 'polygon'
    ],
    ALLOWED_ATTR: [
      'class', 'id', 'style', 'data-editable', 'data-color-key',
      'href', 'src', 'alt', 'title', 'width', 'height',
      'viewBox', 'd', 'fill', 'stroke', 'stroke-width',
      'xmlns', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry',
      'points', 'x1', 'y1', 'x2', 'y2'
    ],
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    KEEP_CONTENT: true,
  });

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
