"use client";

interface PreviewHeaderProps {
  onExpand: () => void;
  onCompress: () => void;
  onFullscreen: () => void;
  onOpenPreview: () => void;
  widthLabel: string;
}

export default function PreviewHeader({ onExpand, onCompress, onFullscreen, onOpenPreview, widthLabel }: PreviewHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
      <div className="space-y-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Önizleme</span>
        <p className="text-xs text-gray-500">Genişlik: {widthLabel}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onCompress}
          className="rounded-full border border-transparent bg-gradient-to-r from-rose-500/90 to-rose-400 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          Daralt
        </button>
        <button
          type="button"
          onClick={onExpand}
          className="rounded-full border border-transparent bg-gradient-to-r from-purple-500 to-indigo-500 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
        >
          Genişlet
        </button>
        <button
          type="button"
          onClick={onFullscreen}
          className="rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 shadow-sm transition hover:border-purple-200 hover:text-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
        >
          Tam Ekran
        </button>
        <button
          type="button"
          onClick={onOpenPreview}
          className="rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          Yeni Sekme
        </button>
      </div>
    </div>
  );
}
