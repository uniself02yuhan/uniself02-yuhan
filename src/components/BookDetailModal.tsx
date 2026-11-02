import React, { useEffect } from 'react';
import { X, BookMarked, Users, Sparkles, MessageSquare } from 'lucide-react';
import { ClassicBook, CommunityReview } from '../data/classics100';
import { BookCoverArt } from './BookCoverArt';

interface BookDetailModalProps {
  book: ClassicBook | null;
  onClose: () => void;
  onWriteJournal: (book: ClassicBook) => void;
  onCreateClubForBook: (book: ClassicBook) => void;
  bookReviews: CommunityReview[];
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onWriteJournal,
  onCreateClubForBook,
  bookReviews,
}) => {
  useEffect(() => {
    if (!book) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, onClose]);

  if (!book) return null;

  const accessionCode = `ARCHIVE NO.${String(book.id).padStart(3, '0')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1917]/65 backdrop-blur-[2px] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-book-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FBF9F5] border border-[#DED8CE] shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top utility bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#FBF9F5]/95 backdrop-blur border-b border-[#E5E0D5]">
          <div className="flex items-center gap-2 text-xs font-mono-num tracking-wider text-[#68625B]">
            <span>{accessionCode}</span>
            <span aria-hidden="true">·</span>
            <span>{book.era}</span>
            <span aria-hidden="true">·</span>
            <span>6대 기관 중 {book.citationCount}곳 추천</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="도서 상세 모달 닫기"
            className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#EBE6DF] rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          {/* Header Dossier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <BookCoverArt book={book} size="lg" className="w-full" />
            </div>

            <div className="md:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#68625B]">
                <span>{book.region}</span>
                <span aria-hidden="true">·</span>
                <span>{book.genre}</span>
                <span aria-hidden="true">·</span>
                <span>{book.themes[0]}</span>
                <span aria-hidden="true">/</span>
                <span>{book.themes[1]}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">약 {book.pageEstimate}쪽</span>
              </div>

              <div>
                <h2
                  id="modal-book-title"
                  className="font-editorial text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight text-balance"
                >
                  {book.title}
                </h2>
                <p className="mt-2 text-base font-medium text-[#57534E]">
                  {book.author} 지음
                </p>
              </div>

              <p className="text-base leading-relaxed text-[#292524] bg-[#F2EFE9] p-4 border border-[#E5E0D5]">
                {book.summary.hook}
              </p>

              {/* Accession Metadata Definition List */}
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-[#E5E0D5] text-xs">
                <div>
                  <dt className="text-[#78716C] uppercase tracking-wider">서사 분위기</dt>
                  <dd className="mt-1 font-medium text-[#1C1917]">{book.mood}</dd>
                </div>
                <div>
                  <dt className="text-[#78716C] uppercase tracking-wider">독서 호흡</dt>
                  <dd className="mt-1 font-medium text-[#1C1917]">{book.difficulty}</dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-[#78716C] uppercase tracking-wider">권장 목적</dt>
                  <dd className="mt-1 font-medium text-[#1C1917]">{book.purpose}</dd>
                </div>
              </dl>

              {/* Recommended Institutions */}
              <div className="pt-2 text-xs text-[#68625B]">
                <span className="font-semibold text-[#1C1917]">선정 기관: </span>
                {book.institutions.join(' · ')}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onWriteJournal(book)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9A3412] text-white text-sm font-medium rounded-sm hover:bg-[#7C2D12] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookMarked className="w-4 h-4" />
                  내 독서 기록장에 담기
                </button>
                <button
                  type="button"
                  onClick={() => onCreateClubForBook(book)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1C1917] border border-[#D6D0C4] text-sm font-medium rounded-sm hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Users className="w-4 h-4" />
                  이 책으로 독서 모임 열기
                </button>
              </div>
            </div>
          </div>

          {/* Pull Quote */}
          <blockquote className="py-6 px-4 sm:px-8 border-y border-[#DED8CE] text-center bg-[#F6F3EC]">
            <p className="font-editorial italic text-lg sm:text-xl text-[#1C1917] leading-relaxed max-w-2xl mx-auto text-balance">
              “{book.summary.famousQuote}”
            </p>
            <footer className="mt-2 text-xs text-[#68625B]">
              — 『{book.title}』 대표 문장
            </footer>
          </blockquote>

          {/* 3-Act Plot Summary Service */}
          <section aria-labelledby="plot-summary-heading" className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3">
              <h3
                id="plot-summary-heading"
                className="font-editorial text-xl font-bold text-[#1C1917] flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-[#9A3412]" />
                도서 핵심 줄거리 요약 (3단 구성)
              </h3>
              <span className="text-xs text-[#68625B]">기 · 승전 · 결 심층 요약</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-white border border-[#E5E0D5] space-y-2.5">
                <div className="text-xs font-mono-num tracking-wider text-[#9A3412] font-semibold">
                  01. 도입 (발단)
                </div>
                <p className="text-sm leading-relaxed text-[#292524]">
                  {book.summary.beginning}
                </p>
              </div>

              <div className="p-5 bg-white border border-[#E5E0D5] space-y-2.5">
                <div className="text-xs font-mono-num tracking-wider text-[#9A3412] font-semibold">
                  02. 전개와 절정 (갈등)
                </div>
                <p className="text-sm leading-relaxed text-[#292524]">
                  {book.summary.development}
                </p>
              </div>

              <div className="p-5 bg-white border border-[#E5E0D5] space-y-2.5">
                <div className="text-xs font-mono-num tracking-wider text-[#9A3412] font-semibold">
                  03. 결말과 여운 (대단원)
                </div>
                <p className="text-sm leading-relaxed text-[#292524]">
                  {book.summary.resolution}
                </p>
              </div>
            </div>
          </section>

          {/* Literary Significance */}
          <section className="p-6 bg-[#F2EFE9] border border-[#E5E0D5] space-y-2">
            <h3 className="font-editorial text-base font-bold text-[#1C1917]">
              문학사적 의의 및 큐레이터 해설
            </h3>
            <p className="text-sm leading-relaxed text-[#292524] max-w-3xl">
              {book.summary.significance}
            </p>
          </section>

          {/* Reader Reviews for this book */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-2">
              <h3 className="font-editorial text-lg font-bold text-[#1C1917] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#9A3412]" />
                독자 감상평 ({bookReviews.length})
              </h3>
            </div>

            {bookReviews.length === 0 ? (
              <div className="p-6 bg-white border border-[#E5E0D5] text-center space-y-3">
                <p className="text-sm text-[#68625B]">
                  아직 이 도서에 등록된 커뮤니티 감상평이 없습니다. 첫 번째 감상평의 주인공이 되어보세요.
                </p>
                <button
                  type="button"
                  onClick={() => onWriteJournal(book)}
                  className="px-4 py-2 text-xs font-medium bg-[#1C1917] text-white rounded-sm hover:bg-[#292524] transition-colors cursor-pointer"
                >
                  첫 감상평 기록하기
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookReviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="p-5 bg-white border border-[#E5E0D5] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-[#68625B]">
                      <span>
                        <strong className="text-[#1C1917]">{rev.authorName}</strong> ·{' '}
                        {rev.authorRole}
                      </span>
                      <span className="font-mono-num">
                        평점 {'★'.repeat(rev.rating)} · {rev.createdAt}
                      </span>
                    </div>
                    <h4 className="font-editorial text-base font-bold text-[#1C1917]">
                      {rev.title}
                    </h4>
                    <p className="text-sm text-[#292524] leading-relaxed">
                      {rev.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
