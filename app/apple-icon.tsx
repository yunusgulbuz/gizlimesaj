import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f43f5e 0%, #9333ea 100%)',
          borderRadius: '40px',
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
    ),
    {
      ...size,
    }
  )
}
