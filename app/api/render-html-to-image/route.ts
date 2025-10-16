import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Serverless için Chromium konfigürasyonu
const isDev = process.env.NODE_ENV === 'development';

async function getBrowser() {
  if (isDev) {
    // Local development - sistem Chrome kullan
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath:
        process.platform === 'win32'
          ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          : process.platform === 'darwin'
          ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          : '/usr/bin/google-chrome',
    });
  } else {
    // Production (Vercel) - @sparticuz/chromium kullan
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
}

export async function POST(req: NextRequest) {
  let browser;

  try {
    const { html, width = 1080, height = 1920 } = await req.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    console.log('Starting browser...');
    browser = await getBrowser();

    console.log('Creating page...');
    const page = await browser.newPage();

    // Viewport ayarla (2x scale ile yüksek kalite)
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2,
    });

    console.log('Loading HTML content...');
    // HTML içeriğini yükle
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'load'],
      timeout: 30000,
    });

    // Fontların yüklenmesi için ekstra bekleme
    await page.evaluate(() => document.fonts.ready);
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Taking screenshot...');
    // Screenshot al
    const screenshot = await page.screenshot({
      type: 'png',
      omitBackground: false,
      encoding: 'base64',
      fullPage: false,
    });

    console.log('Screenshot complete, closing browser...');
    await browser.close();

    console.log('Returning image...');
    // Base64 olarak dön
    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${screenshot}`,
    });
  } catch (error) {
    console.error('Screenshot generation error:', error);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Vercel için timeout ayarı
export const maxDuration = 60; // 60 saniye max
export const dynamic = 'force-dynamic';
