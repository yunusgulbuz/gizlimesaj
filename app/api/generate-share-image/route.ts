import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { shortId, format } = await request.json();

    if (!shortId || !format) {
      return NextResponse.json(
        { error: 'Missing shortId or format' },
        { status: 400 }
      );
    }

    // Validate format
    const validFormats = ['instagram-square', 'instagram-story', 'whatsapp', 'web-banner'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format' },
        { status: 400 }
      );
    }

    // Get personal page data
    const supabase = await createServerSupabaseClient();
    const { data: personalPage, error } = await supabase
      .from('personal_pages')
      .select(`
        id,
        short_id,
        recipient_name,
        sender_name,
        message,
        templates!inner (
          title,
          slug,
          preview_url
        )
      `)
      .eq('short_id', shortId)
      .eq('is_active', true)
      .single();

    if (error || !personalPage) {
      return NextResponse.json(
        { error: 'Personal page not found' },
        { status: 404 }
      );
    }

    // Generate image based on format
    const dimensions = {
      'instagram-square': { width: 1080, height: 1080 },
      'instagram-story': { width: 1080, height: 1920 },
      'whatsapp': { width: 800, height: 800 },
      'web-banner': { width: 1920, height: 1080 }
    };

    const { width, height } = dimensions[format as keyof typeof dimensions];
    
    // Create SVG content for the share image
    const template = personalPage.templates?.[0]; // Access first element since Supabase returns joined data as arrays
    const svgContent = generateShareImageSVG({
      width,
      height,
      recipientName: personalPage.recipient_name,
      senderName: personalPage.sender_name,
      templateTitle: template?.title || 'Gizli Mesaj',
      message: personalPage.message.substring(0, 150) + (personalPage.message.length > 150 ? '...' : ''),
      url: `${process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://gizlimesaj.com'}/m/${shortId}`,
      format
    });

    // Return the SVG as a downloadable file
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="gizli-mesaj-${format}-${shortId}.svg"`,
      },
    });

  } catch (error) {
    console.error('Share image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateShareImageSVG({
  width,
  height,
  recipientName,
  senderName,
  templateTitle,
  message,
  url,
  format
}: {
  width: number;
  height: number;
  recipientName: string;
  senderName: string;
  templateTitle: string;
  message: string;
  url: string;
  format: string;
}) {
  const isStory = format === 'instagram-story';
  const isSquare = format === 'instagram-square';
  const isWebBanner = format === 'web-banner';
  const isWhatsApp = format === 'whatsapp';
  
  // Color scheme
  const primaryColor = '#8B5CF6'; // Purple
  const secondaryColor = '#EC4899'; // Pink
  const textColor = '#1F2937'; // Dark gray
  const lightBg = '#F9FAFB'; // Light gray

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:0.1" />
        </linearGradient>
        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${primaryColor}" />
          <stop offset="100%" style="stop-color:${secondaryColor}" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bgGradient)"/>
      
      <!-- Header -->
      <rect x="0" y="0" width="100%" height="${isStory ? 200 : 150}" fill="url(#headerGradient)"/>
      
      <!-- Logo/Brand -->
      <text x="${width/2}" y="${isStory ? 80 : 60}" 
            text-anchor="middle" 
            fill="white" 
            font-family="Arial, sans-serif" 
            font-size="${isStory ? 48 : 36}" 
            font-weight="bold">
        💌 Gizli Mesaj
      </text>
      
      <text x="${width/2}" y="${isStory ? 130 : 100}" 
            text-anchor="middle" 
            fill="white" 
            font-family="Arial, sans-serif" 
            font-size="${isStory ? 24 : 18}" 
            opacity="0.9">
        ${templateTitle}
      </text>
      
      <!-- Main Content -->
      <rect x="${width * 0.1}" y="${isStory ? 250 : 200}" 
            width="${width * 0.8}" height="${isStory ? height - 500 : height - 400}" 
            fill="white" 
            rx="20" 
            stroke="${primaryColor}" 
            stroke-width="2"/>
      
      <!-- Recipient Name -->
      <text x="${width/2}" y="${isStory ? 320 : 260}" 
            text-anchor="middle" 
            fill="${textColor}" 
            font-family="Arial, sans-serif" 
            font-size="${isStory ? 36 : 28}" 
            font-weight="bold">
        ${recipientName} için özel mesaj
      </text>
      
      <!-- Message Preview -->
      <foreignObject x="${width * 0.15}" y="${isStory ? 380 : 300}" 
                     width="${width * 0.7}" height="${isStory ? 400 : 200}">
        <div xmlns="http://www.w3.org/1999/xhtml" 
             style="font-family: Arial, sans-serif; 
                    font-size: ${isStory ? 24 : 18}px; 
                    line-height: 1.5; 
                    color: ${textColor}; 
                    text-align: center; 
                    padding: 20px;">
          "${message}"
        </div>
      </foreignObject>
      
      <!-- Sender -->
      <text x="${width/2}" y="${isStory ? height - 200 : height - 120}" 
            text-anchor="middle" 
            fill="${primaryColor}" 
            font-family="Arial, sans-serif" 
            font-size="${isStory ? 28 : 22}" 
            font-weight="bold">
        - ${senderName}
      </text>
      
      <!-- QR Code Placeholder -->
      <rect x="${width - 150}" y="${height - 150}" 
            width="120" height="120" 
            fill="white" 
            stroke="${primaryColor}" 
            stroke-width="2" 
            rx="10"/>
      
      <text x="${width - 90}" y="${height - 80}" 
            text-anchor="middle" 
            fill="${primaryColor}" 
            font-family="Arial, sans-serif" 
            font-size="12">
        QR Kod
      </text>
      
      <!-- URL -->
      <text x="${width/2}" y="${height - 50}" 
            text-anchor="middle" 
            fill="${primaryColor}" 
            font-family="Arial, sans-serif" 
            font-size="${isStory ? 20 : 16}">
        gizlimesaj.com/m/${url.split('/').pop()}
      </text>
      
      <!-- Decorative Elements -->
      <circle cx="${width * 0.2}" cy="${isStory ? 400 : 250}" r="30" fill="${secondaryColor}" opacity="0.2"/>
      <circle cx="${width * 0.8}" cy="${isStory ? 600 : 350}" r="40" fill="${primaryColor}" opacity="0.2"/>
      <circle cx="${width * 0.3}" cy="${isStory ? height - 300 : height - 200}" r="25" fill="${secondaryColor}" opacity="0.2"/>
    </svg>
  `;
}