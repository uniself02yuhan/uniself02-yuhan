import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { ClassicBook, ThemeCategory } from '../data/classics100';

const THEME_PALETTES: Record<
  ThemeCategory,
  { bg: string; accent: string; border: string; paper: string }
> = {
  '실존과 고독': {
    bg: 'bg-[#1F2933]',
    accent: 'text-[#D8CBB8]',
    border: 'border-[#D8CBB8]/30',
    paper: 'bg-[#F5F2EB]',
  },
  '사회와 권력': {
    bg: 'bg-[#4A1D1A]',
    accent: 'text-[#E6D5C3]',
    border: 'border-[#E6D5C3]/30',
    paper: 'bg-[#F7F3EE]',
  },
  '사랑과 욕망': {
    bg: 'bg-[#3D222E]',
    accent: 'text-[#EAD7D1]',
    border: 'border-[#EAD7D1]/30',
    paper: 'bg-[#F9F4F2]',
  },
  '성장과 구원': {
    bg: 'bg-[#1D3628]',
    accent: 'text-[#D6E2D8]',
    border: 'border-[#D6E2D8]/30',
    paper: 'bg-[#F3F6F3]',
  },
  '인간 본성': {
    bg: 'bg-[#33291F]',
    accent: 'text-[#E5DACB]',
    border: 'border-[#E5DACB]/30',
    paper: 'bg-[#F7F4EF]',
  },
  '역사와 운명': {
    bg: 'bg-[#1E2D40]',
    accent: 'text-[#D6DFEB]',
    border: 'border-[#D6DFEB]/30',
    paper: 'bg-[#F3F5F8]',
  },
};

interface BookCoverArtProps {
  book: ClassicBook;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookCoverArt: React.FC<BookCoverArtProps> = ({
  book,
  size = 'md',
  className = '',
}) => {
  const palette = THEME_PALETTES[book.themes[0]] || THEME_PALETTES['실존과 고독'];
  const accessionNo = `NO.${String(book.id).padStart(3, '0')}`;

  if (size === 'sm') {
    return (
      <div
        className={`relative select-none overflow-hidden rounded-sm ${palette.bg} text-[#FBF9F5] shadow-sm flex flex-col justify-between p-2 border border-black/15 ${className}`}
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 left-1.5 w-[1px] bg-white/15" />
        <div className="pl-2 flex items-center justify-between text-[9px] font-mono-num tracking-wider opacity-75">
          <span>{accessionNo}</span>
        </div>
        <div className="pl-2 my-auto py-0.5">
          <p className="font-editorial text-[11px] font-semibold leading-tight line-clamp-3 break-keep">
            {book.title}
          </p>
        </div>
        <div className="pl-2 text-[9px] opacity-75 truncate">{book.author}</div>
      </div>
    );
  }

  return (
    <div
      className={`relative select-none overflow-hidden rounded-sm ${palette.bg} text-[#FBF9F5] shadow-md flex flex-col justify-between ${
        size === 'lg' ? 'p-6 min-h-[280px]' : 'p-4 min-h-[210px]'
      } border border-black/20 ${className}`}
      aria-hidden="true"
    >
      {/* Clothbound spine groove */}
      <div className="absolute inset-y-0 left-3 w-[1px] bg-white/20" />
      <div className="absolute inset-y-0 left-0 w-3 bg-black/20" />

      {/* Inner archival frame */}
      <div
        className={`ml-2 flex-1 border ${palette.border} p-3.5 flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between text-[10px] font-mono-num tracking-widest uppercase opacity-80">
          <span>ARCHIVE · {accessionNo}</span>
          <span>{book.region.split('·')[0]}</span>
        </div>

        <div className="my-3 py-2 border-y border-white/15">
          <p
            className={`font-editorial font-semibold tracking-tight leading-snug text-balance ${
              size === 'lg' ? 'text-xl' : 'text-base'
            }`}
          >
            {book.title}
          </p>
          <p className={`mt-1.5 text-xs ${palette.accent} opacity-90`}>
            {book.author}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] opacity-75">
          <span className="truncate">{book.themes[0]}</span>
          <span className="font-mono-num">★ {book.citationCount}/6</span>
        </div>
      </div>
    </div>
  );
};

interface EditorialImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClass?: string;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  caption,
  className = '',
  aspectClass = 'aspect-[16/9]',
}) => {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={`overflow-hidden ${className}`}>
      <div
        className={`relative w-full ${aspectClass} bg-[#EBE6DF] border border-[#E2DDD5] overflow-hidden`}
      >
        {!failed ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F2EFE9] to-[#E5DFD3] text-[#57534E]">
            <BookOpen className="w-8 h-8 mb-2 stroke-[1.5]" />
            <span className="font-editorial text-sm font-medium text-[#1C1917]">
              {alt}
            </span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="text-xs font-editorial italic text-[#68625B] mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
