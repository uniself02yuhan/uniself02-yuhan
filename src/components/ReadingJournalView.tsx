import React, { useEffect, useState } from 'react';
import {
  BookMarked,
  CheckCircle2,
  Share2,
  Trash2,
  Quote,
  BookOpen,
  Plus,
} from 'lucide-react';
import { ClassicBook, JournalEntry } from '../data/classics100';
import {
  computeJournalStats,
  validateJournalForm,
} from '../utils/recommendation';
import { BookCoverArt, EditorialImage } from './BookCoverArt';
import { EDITORIAL_IMAGES } from '../assets/editorialImages';

interface ReadingJournalViewProps {
  books: ClassicBook[];
  entries: JournalEntry[];
  preselectedBookId: number | null;
  onSaveEntry: (
    entry: Omit<JournalEntry, 'id' | 'createdAt'>,
    publishToCommunity: boolean
  ) => void;
  onDeleteEntry: (id: string) => void;
  onShareEntryToCommunity: (entry: JournalEntry) => void;
  onSelectBook: (book: ClassicBook) => void;
}

export const ReadingJournalView: React.FC<ReadingJournalViewProps> = ({
  books,
  entries,
  preselectedBookId,
  onSaveEntry,
  onDeleteEntry,
  onShareEntryToCommunity,
  onSelectBook,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<number>(
    preselectedBookId || 1
  );
  const [status, setStatus] = useState<'완독' | '읽는 중' | '읽고 싶은 책'>('완독');
  const [rating, setRating] = useState<number>(5);
  const [startDate, setStartDate] = useState<string>('2026-11-01');
  const [endDate, setEndDate] = useState<string>('2026-11-01');
  const [favoriteQuote, setFavoriteQuote] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [shareToCommunity, setShareToCommunity] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    '전체' | '완독' | '읽는 중' | '읽고 싶은 책'
  >('전체');

  useEffect(() => {
    if (preselectedBookId) {
      setSelectedBookId(preselectedBookId);
      const found = books.find((b) => b.id === preselectedBookId);
      if (found && !favoriteQuote) {
        setFavoriteQuote(found.summary.famousQuote);
      }
    }
  }, [preselectedBookId, books]);

  const currentBook =
    books.find((b) => b.id === selectedBookId) || books[0];

  const stats = computeJournalStats(entries, books);

  const filteredEntries =
    statusFilter === '전체'
      ? entries
      : entries.filter((e) => e.status === statusFilter);

  const handleLoadBookQuote = () => {
    if (currentBook) {
      setFavoriteQuote(currentBook.summary.famousQuote);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const validation = validateJournalForm({
      bookId: selectedBookId,
      reviewText,
    });
    if (!validation.valid) {
      setErrorMsg(validation.error || '입력 내용을 확인해 주세요.');
      return;
    }

    onSaveEntry(
      {
        bookId: selectedBookId,
        status,
        rating,
        startDate,
        endDate: status === '완독' ? endDate : '',
        favoriteQuote:
          favoriteQuote.trim() || currentBook.summary.famousQuote,
        reviewText: reviewText.trim(),
        sharedToCommunity: shareToCommunity,
      },
      shareToCommunity
    );

    setReviewText('');
    setSuccessMsg(
      shareToCommunity
        ? `『${currentBook.title}』 독서 기록이 저장되었으며 커뮤니티 감상평 게시판에도 공유되었습니다.`
        : `『${currentBook.title}』 독서 기록이 내 서재에 저장되었습니다.`
    );
  };

  return (
    <div className="space-y-12">
      {/* Header & Metrics */}
      <section className="border-b border-[#E5E0D5] pb-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-mono-num tracking-wider text-[#9A3412] uppercase font-semibold">
              PERSONAL READING ARCHIVE
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight text-balance">
              나의 고전 독서 기록장
            </h1>
            <p className="text-sm sm:text-base text-[#44403C] leading-relaxed max-w-2xl">
              읽은 고전의 밑줄 친 문장과 사유를 나만의 서재에 기록하세요. 작성한 감상평은 원클릭으로 커뮤니티 게시판에 공유하여 다른 독자들과 깊이 있는 대화를 나눌 수 있습니다.
            </p>
          </div>

          <div className="lg:col-span-5">
            <EditorialImage
              src={EDITORIAL_IMAGES.spotReadingJournal}
              alt="만년필과 황동 책갈피가 놓인 고전 독서 기록장"
              aspectClass="aspect-[16/9]"
            />
          </div>
        </div>

        {/* 4-Column Tabular Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E0D5] p-5">
            <div className="text-xs text-[#68625B]">총 기록한 고전</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono-num text-[#1C1917]">
              {stats.totalCount}권
            </div>
            <div className="mt-1 text-xs text-[#78716C]">
              100선 중 {stats.totalCount}% 아카이빙
            </div>
          </div>

          <div className="bg-white border border-[#E5E0D5] p-5">
            <div className="text-xs text-[#68625B]">완독한 도서</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono-num text-[#9A3412]">
              {stats.completedCount}권
            </div>
            <div className="mt-1 text-xs text-[#78716C]">
              읽는 중 {stats.readingCount}권 · 관심 {stats.wishlistCount}권
            </div>
          </div>

          <div className="bg-white border border-[#E5E0D5] p-5">
            <div className="text-xs text-[#68625B]">누적 완독 페이지</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono-num text-[#1C1917]">
              {stats.totalPagesRead.toLocaleString()}쪽
            </div>
            <div className="mt-1 text-xs text-[#78716C]">
              완독 도서 기준 합산
            </div>
          </div>

          <div className="bg-white border border-[#E5E0D5] p-5">
            <div className="text-xs text-[#68625B]">커뮤니티 공유 감상평</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono-num text-[#1C1917]">
              {stats.sharedCount}건
            </div>
            <div className="mt-1 text-xs text-[#78716C]">
              평균 평점 ★ {stats.averageRating}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Split: Editor Form (Left 5 cols) + Saved Entries (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: New Journal Entry Form */}
        <section
          aria-labelledby="journal-form-heading"
          className="lg:col-span-5 bg-white border border-[#DED8CE] p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-[#E5E0D5] pb-4">
            <h2
              id="journal-form-heading"
              className="font-editorial text-xl font-bold text-[#1C1917] flex items-center gap-2"
            >
              <Plus className="w-5 h-5 text-[#9A3412]" />
              새 독서 기록 작성하기
            </h2>
            <p className="mt-1 text-xs text-[#68625B]">
              고전문학 100선 중 읽었거나 읽고 있는 책의 문장과 감상을 남겨보세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="journal-book-select"
                className="block text-xs font-semibold text-[#1C1917]"
              >
                기록할 고전 도서 (100선)
              </label>
              <select
                id="journal-book-select"
                value={selectedBookId}
                onChange={(e) => {
                  const nextId = Number(e.target.value);
                  setSelectedBookId(nextId);
                  const nextBook = books.find((b) => b.id === nextId);
                  if (nextBook) {
                    setFavoriteQuote(nextBook.summary.famousQuote);
                  }
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm focus:outline-none focus:border-[#9A3412]"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {String(b.id).padStart(3, '0')}. {b.title} — {b.author}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Book Quick Plot Summary Preview */}
            {currentBook && (
              <div className="p-3.5 bg-[#F6F3EC] border border-[#E5E0D5] flex items-center justify-between gap-3">
                <div className="text-xs text-[#44403C] min-w-0">
                  <span className="font-semibold text-[#1C1917]">
                    『{currentBook.title}』
                  </span>{' '}
                  · {currentBook.themes.join(' / ')} · 약 {currentBook.pageEstimate}쪽
                </div>
                <button
                  type="button"
                  onClick={() => onSelectBook(currentBook)}
                  className="text-xs font-semibold text-[#9A3412] hover:underline shrink-0 cursor-pointer"
                >
                  줄거리 보기
                </button>
              </div>
            )}

            {/* Status & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-[#1C1917]">
                  독서 상태
                </span>
                <div className="flex gap-1.5">
                  {(['완독', '읽는 중', '읽고 싶은 책'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`flex-1 py-2 text-xs font-medium border rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                        status === st
                          ? 'bg-[#1C1917] text-white border-[#1C1917]'
                          : 'bg-[#FBF9F5] text-[#44403C] border-[#D6D0C4]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="journal-rating-select"
                  className="block text-xs font-semibold text-[#1C1917]"
                >
                  나의 평점
                </label>
                <select
                  id="journal-rating-select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                >
                  <option value={5}>★★★★★ (5점 · 인생 고전)</option>
                  <option value={4}>★★★★☆ (4점 · 깊은 울림)</option>
                  <option value={3}>★★★☆☆ (3점 · 유익한 독서)</option>
                  <option value={2}>★★☆☆☆ (2점 · 아쉬움)</option>
                  <option value={1}>★☆☆☆☆ (1점 · 읽기 힘듦)</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="journal-start-date"
                  className="block text-xs font-semibold text-[#1C1917]"
                >
                  시작일
                </label>
                <input
                  id="journal-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-num bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="journal-end-date"
                  className="block text-xs font-semibold text-[#1C1917]"
                >
                  완독일
                </label>
                <input
                  id="journal-end-date"
                  type="date"
                  value={endDate}
                  disabled={status !== '완독'}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-num bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Favorite Quote */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="journal-quote-input"
                  className="block text-xs font-semibold text-[#1C1917]"
                >
                  밑줄 친 문장 (명문장 기록)
                </label>
                <button
                  type="button"
                  onClick={handleLoadBookQuote}
                  className="text-xs text-[#9A3412] hover:underline cursor-pointer"
                >
                  대표 명문장 자동 채우기
                </button>
              </div>
              <input
                id="journal-quote-input"
                type="text"
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.target.value)}
                placeholder="기억하고 싶은 책 속의 한 문장을 적어보세요..."
                className="w-full px-3.5 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm focus:outline-none focus:border-[#9A3412]"
              />
            </div>

            {/* Review Text */}
            <div className="space-y-1.5">
              <label
                htmlFor="journal-review-textarea"
                className="block text-xs font-semibold text-[#1C1917]"
              >
                감상평 및 독서 노트 (필수)
              </label>
              <textarea
                id="journal-review-textarea"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="책을 읽으며 느낀 점이나 질문, 오늘의 나에게 남기는 사유를 자유롭게 기록해 주세요 (5자 이상)..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm focus:outline-none focus:border-[#9A3412]"
              />
            </div>

            {/* Share to Community Checkbox */}
            <label className="flex items-center gap-2.5 text-xs text-[#292524] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shareToCommunity}
                onChange={(e) => setShareToCommunity(e.target.checked)}
                className="w-4 h-4 accent-[#9A3412]"
              />
              <span>저장 시 커뮤니티 ‘감상평 게시판’에도 함께 공유하기</span>
            </label>

            {errorMsg && (
              <div
                role="alert"
                className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]"
              >
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div
                role="status"
                className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534] flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#9A3412] text-white text-sm font-medium rounded-sm hover:bg-[#7C2D12] transition-colors cursor-pointer"
            >
              독서 기록장에 저장하기
            </button>
          </form>
        </section>

        {/* Right: Saved Reading Journal List */}
        <section
          aria-labelledby="saved-journals-heading"
          className="lg:col-span-7 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-4">
            <h2
              id="saved-journals-heading"
              className="font-editorial text-2xl font-bold text-[#1C1917] flex items-center gap-2"
            >
              <BookMarked className="w-5 h-5 text-[#9A3412]" />
              내가 기록한 서재 노트 ({filteredEntries.length})
            </h2>

            <div className="flex items-center gap-1.5">
              {(['전체', '완독', '읽는 중', '읽고 싶은 책'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-medium border rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    statusFilter === tab
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white text-[#57534E] border-[#E5E0D5] hover:border-[#A8A29E]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="bg-white border border-[#E5E0D5] p-12 text-center space-y-2">
              <p className="font-editorial text-base text-[#1C1917]">
                해당 상태의 독서 기록이 아직 없습니다.
              </p>
              <p className="text-xs text-[#68625B]">
                왼쪽 작성 폼에서 새로운 고전 독서 노트를 남겨보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => {
                const book =
                  books.find((b) => b.id === entry.bookId) || books[0];
                return (
                  <article
                    key={entry.id}
                    className="bg-white border border-[#E5E0D5] p-6 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <BookCoverArt
                          book={book}
                          size="sm"
                          className="w-16 h-24 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#68625B]">
                            <span className="font-semibold text-[#9A3412]">
                              {entry.status}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-num">
                              {'★'.repeat(entry.rating)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-num">
                              기록일 {entry.createdAt}
                            </span>
                            {entry.sharedToCommunity && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#166534] font-medium">
                                  커뮤니티 공유됨
                                </span>
                              </>
                            )}
                          </div>

                          <h3 className="font-editorial text-xl font-bold text-[#1C1917]">
                            {book.title}
                          </h3>
                          <p className="text-xs text-[#57534E]">
                            {book.author} · 고전 100선 NO.
                            {String(book.id).padStart(3, '0')}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteEntry(entry.id)}
                        aria-label={`${book.title} 독서 기록 삭제`}
                        className="p-1.5 text-[#78716C] hover:text-[#991B1B] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {entry.favoriteQuote && (
                      <blockquote className="p-3.5 bg-[#F6F3EC] border border-[#E5E0D5] text-xs font-editorial italic text-[#292524] flex items-start gap-2">
                        <Quote className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                        <span>“{entry.favoriteQuote}”</span>
                      </blockquote>
                    )}

                    <p className="text-sm text-[#292524] leading-relaxed">
                      {entry.reviewText}
                    </p>

                    <div className="pt-3 border-t border-[#E5E0D5] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => onSelectBook(book)}
                        className="inline-flex items-center gap-1 font-medium text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        도서 줄거리 요약 다시 보기
                      </button>

                      {!entry.sharedToCommunity && (
                        <button
                          type="button"
                          onClick={() => onShareEntryToCommunity(entry)}
                          className="inline-flex items-center gap-1 font-semibold text-[#9A3412] hover:underline cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          커뮤니티 감상평 게시판에 공유하기
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
