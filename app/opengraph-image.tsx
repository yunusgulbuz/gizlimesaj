import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'Heartnote - Sevdiklerinize Özel Sürpriz Mesajlar'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f43f5e 0%, #9333ea 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 75 C30 75 20 60 20 45 C20 30 30 25 40 25 C45 25 48 28 50 32 C52 28 55 25 60 25 C70 25 80 30 80 45 C80 60 70 75 50 75 Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
          }}
        >
          Heartnote
        </div>
        <div
          style={{
            fontSize: 36,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Sevdiklerinize Özel Sürpriz Mesajlar ve Hediyeler
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
