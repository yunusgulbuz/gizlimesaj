'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SimpleJoyCardProps {
  recipientName: string;
  message: string;
  creatorName?: string;
  textFields?: Record<string, string>;
  isEditable?: boolean;
  onTextFieldChange?: (key: string, value: string) => void;
}

const DEFAULTS = {
  minimalTitle: 'Doğum Günün Kutlu Olsun 🎂',
  minimalSubtitle: 'Mutlu yıllar dilerim!',
  minimalButtonLabel: '🎈',
  minimalWishText: 'Dileğini tuttun mu?',
  minimalPhotoHint: 'Fotoğraf',
};

type FieldKey =
  | 'minimalTitle'
  | 'minimalSubtitle'
  | 'minimalButtonLabel'
  | 'minimalWishText'
  | 'minimalPhotoUrl'
  | 'minimalPhotoHint';

export default function SimpleJoyCard({
  recipientName,
  message,
  creatorName,
  textFields,
  isEditable = false,
  onTextFieldChange,
}: SimpleJoyCardProps) {
  const [showWish, setShowWish] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const photoRef = useRef<HTMLDivElement | null>(null);

  const initialValues = useMemo(
    () => ({
      minimalTitle: textFields?.minimalTitle || DEFAULTS.minimalTitle,
      minimalSubtitle: textFields?.minimalSubtitle || message || DEFAULTS.minimalSubtitle,
      minimalButtonLabel: textFields?.minimalButtonLabel || DEFAULTS.minimalButtonLabel,
      minimalWishText: textFields?.minimalWishText || DEFAULTS.minimalWishText,
      minimalPhotoUrl: textFields?.minimalPhotoUrl || 'https://i.hizliresim.com/mojpwcv.png',
      minimalPhotoHint: textFields?.minimalPhotoHint || DEFAULTS.minimalPhotoHint,
    }),
    [textFields, message]
  );

  const [localFields, setLocalFields] = useState(initialValues);

  useEffect(() => {
    setLocalFields(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (showPhoto && !isEditable) {
      const handleClickOutside = (event: MouseEvent) => {
        if (photoRef.current && !photoRef.current.contains(event.target as Node)) {
          setShowPhoto(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPhoto, isEditable]);

  const displayValue = (key: FieldKey) => {
    if (isEditable) {
      return localFields[key];
    }
    return textFields?.[key] || initialValues[key];
  };

  const handleContentChange = (key: FieldKey, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
    onTextFieldChange?.(key, value);
  };

  const handleButtonClick = () => {
    setShowWish(true);
    setTimeout(() => setShowWish(false), 3000);
  };

  const minimalPhotoUrl = displayValue('minimalPhotoUrl').trim();

  return (
    <div className="relative min-h-screen w-full bg-white">
      <div className="flex min-h-screen flex-col items-center justify-center px-[10%] py-12">
        <div className="w-full max-w-xl space-y-12 animate-[fadeIn_0.8s_ease-out]">
          {minimalPhotoUrl ? (
            <div className="flex flex-col items-center gap-3">
              {(isEditable || !showPhoto) &&
                (isEditable ? (
                  <div
                    className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleContentChange('minimalPhotoHint', e.currentTarget.textContent?.trim() || '')
                    }
                  >
                    {displayValue('minimalPhotoHint')}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPhoto(true);
                    }}
                    className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
                  >
                    {displayValue('minimalPhotoHint')}
                  </button>
                ))}

              {(isEditable || showPhoto) && (
                <div
                  ref={photoRef}
                  className="polaroid relative bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                >
                  <div className="h-48 w-48 overflow-hidden bg-gray-50">
                    <img src={minimalPhotoUrl} alt="Doğum günü fotoğrafı" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}

              {isEditable && (
                <div className="mt-2 flex w-full max-w-md flex-col gap-2">
                  <label className="text-xs font-medium text-gray-700">Fotoğraf URL</label>
                  <input
                    type="url"
                    value={minimalPhotoUrl}
                    onChange={(e) => handleContentChange('minimalPhotoUrl', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              )}
            </div>
          ) : (
            isEditable && (
              <div className="mx-auto flex w-full max-w-md flex-col gap-2">
                <label className="text-xs font-medium text-gray-700">Fotoğraf URL</label>
                <input
                  type="url"
                  value={minimalPhotoUrl}
                  onChange={(e) => handleContentChange('minimalPhotoUrl', e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            )
          )}

          <div className="text-center">
            <h1
              className={`font-['DM_Sans',sans-serif] mb-6 text-5xl font-normal text-gray-900 sm:text-6xl ${
                isEditable ? 'cursor-text rounded-xl px-4 py-3 hover:bg-gray-50' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('minimalTitle', e.currentTarget.textContent || '')}
            >
              {displayValue('minimalTitle')}
            </h1>

            <p
              className={`font-['DM_Sans',sans-serif] mb-10 text-lg text-gray-600 sm:text-xl ${
                isEditable ? 'cursor-text rounded-lg px-4 py-2 hover:bg-gray-50' : ''
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange('minimalSubtitle', e.currentTarget.textContent || '')}
            >
              {displayValue('minimalSubtitle')}
            </p>

            {showWish && (
              <div className="mb-8 animate-[bounceIn_0.5s_ease-out]">
                <p
                  className={`font-['DM_Sans',sans-serif] text-2xl text-[#FF9F8F] ${
                    isEditable ? 'cursor-text rounded-lg px-4 py-3 hover:bg-gray-50' : ''
                  }`}
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange('minimalWishText', e.currentTarget.textContent || '')}
                >
                  {displayValue('minimalWishText')}
                </p>
              </div>
            )}

            <Button
              onClick={handleButtonClick}
              className="rounded-full bg-gray-900 px-8 py-7 text-4xl transition-all hover:scale-110 hover:bg-gray-800 active:scale-95"
            >
              <span
                className={`${isEditable ? 'cursor-text' : 'pointer-events-none'}`}
                {...(isEditable
                  ? {
                      contentEditable: true,
                      suppressContentEditableWarning: true,
                      onBlur: (e: React.FocusEvent<HTMLSpanElement>) =>
                        handleContentChange('minimalButtonLabel', e.currentTarget.textContent || ''),
                    }
                  : {})}
              >
                {displayValue('minimalButtonLabel')}
              </span>
            </Button>

            {creatorName && (
              <p className="font-['DM_Sans',sans-serif] mt-12 text-sm text-gray-400">
                — {creatorName}
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .polaroid {
          transform: rotate(-2deg);
          transition: transform 0.3s ease;
        }

        .polaroid:hover {
          transform: rotate(0deg);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
