import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Users,
  Heart,
  Plus,
  BookOpen,
  Send,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  BookClubGroup,
  ClassicBook,
  CommunityReview,
} from '../data/classics100';
import { validateBookClubForm } from '../utils/recommendation';
import { BookCoverArt, EditorialImage } from './BookCoverArt';

interface CommunityViewProps {
  books: ClassicBook[];
  reviews: CommunityReview[];
  clubs: BookClubGroup[];
  initialSubTab?: 'reviews' | 'clubs';
  preselectedClubBookId?: number | null;
  onAddReview: (review: {
    bookId: number;
    authorName: string;
    rating: number;
    title: string;
    content: string;
    favoriteQuote: string;
  }) => void;
  onToggleLikeReview: (reviewId: string) => void;
  onAddComment: (reviewId: string, authorName: string, content: string) => void;
  onCreateClub: (club: {
    name: string;
    bookId: number;
    hostName: string;
    schedule: string;
    pace: string;
    format: '온라인 심야 살롱' | '오프라인 독서 모임' | '매일 필사 챌린지';
    description: string;
    discussionTopic: string;
    maxMembers: number;
  }) => void;
  onToggleJoinClub: (clubId: string) => void;
  onSelectBook: (book: ClassicBook) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  books,
  reviews,
  clubs,
  initialSubTab = 'reviews',
  preselectedClubBookId = null,
  onAddReview,
  onToggleLikeReview,
  onAddComment,
  onCreateClub,
  onToggleJoinClub,
  onSelectBook,
}) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'clubs'>(initialSubTab);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revBookId, setRevBookId] = useState<number>(1);
  const [revAuthor, setRevAuthor] = useState<string>('고전산책자');
  const [revRating, setRevRating] = useState<number>(5);
  const [revTitle, setRevTitle] = useState<string>('');
  const [revQuote, setRevQuote] = useState<string>('');
  const [revContent, setRevContent] = useState<string>('');
  const [revError, setRevError] = useState<string | null>(null);

  // Comment input map
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Book club form state
  const [showClubForm, setShowClubForm] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubBookId, setClubBookId] = useState<number>(
    preselectedClubBookId || 15
  );
  const [clubHost, setClubHost] = useState('서재지기');
  const [clubSchedule, setClubSchedule] = useState('매주 토요일 오전 10:30 · 4주');
  const [clubPace, setClubPace] = useState('주 150쪽 완독 및 자유 발제');
  const [clubFormat, setClubFormat] = useState<
    '온라인 심야 살롱' | '오프라인 독서 모임' | '매일 필사 챌린지'
  >('온라인 심야 살롱');
  const [clubDesc, setClubDesc] = useState('');
  const [clubTopic, setClubTopic] = useState('');
  const [clubMaxMembers, setClubMaxMembers] = useState(12);
  const [clubError, setClubError] = useState<string | null>(null);
  const [clubSuccess, setClubSuccess] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    if (preselectedClubBookId) {
      setActiveTab('clubs');
      setClubBookId(preselectedClubBookId);
      setShowClubForm(true);
    }
  }, [preselectedClubBookId]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRevError(null);
    if (!revTitle.trim() || revTitle.trim().length < 3) {
      setRevError('감상평 제목을 3자 이상 입력해 주세요.');
      return;
    }
    if (!revContent.trim() || revContent.trim().length < 5) {
      setRevError('감상평 본문을 5자 이상 입력해 주세요.');
      return;
    }
    const targetBook = books.find((b) => b.id === revBookId) || books[0];
    onAddReview({
      bookId: revBookId,
      authorName: revAuthor.trim() || '익명의 독서가',
      rating: revRating,
      title: revTitle.trim(),
      content: revContent.trim(),
      favoriteQuote: revQuote.trim() || targetBook.summary.famousQuote,
    });
    setRevTitle('');
    setRevQuote('');
    setRevContent('');
    setShowReviewForm(false);
  };

  const handleClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClubError(null);
    setClubSuccess(null);

    const validation = validateBookClubForm({
      name: clubName,
      bookId: clubBookId,
      schedule: clubSchedule,
      description: clubDesc,
    });
    if (!validation.valid) {
      setClubError(validation.error || '입력 항목을 확인해 주세요.');
      return;
    }

    const targetBook = books.find((b) => b.id === clubBookId) || books[0];
    onCreateClub({
      name: clubName.trim(),
      bookId: clubBookId,
      hostName: clubHost.trim() || '서재지기',
      schedule: clubSchedule.trim(),
      pace: clubPace.trim() || '매주 분량 함께 읽기',
      format: clubFormat,
      description: clubDesc.trim(),
      discussionTopic:
        clubTopic.trim() ||
        `『${targetBook.title}』에서 오늘날 우리에게 가장 깊은 울림을 주는 장면은 무엇인가요?`,
      maxMembers: clubMaxMembers,
    });

    setClubName('');
    setClubDesc('');
    setClubTopic('');
    setShowClubForm(false);
    setClubSuccess(
      `‘${clubName.trim()}’ 독서 모임이 성공적으로 개설되었습니다.`
    );
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#E5E0D5] pb-10">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono-num tracking-wider text-[#9A3412] uppercase font-semibold">
            LITERARY SALON & READING GROUPS
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight text-balance">
            고전 감상평 게시판 & 독서 모임 살롱
          </h1>
          <p className="text-sm sm:text-base text-[#44403C] leading-relaxed max-w-2xl">
            혼자 읽기 벅찬 대작도 함께 읽으면 끝까지 완독할 수 있습니다. 읽은 책의 깊은 여운을 감상평으로 나누고, 취향이 맞는 독자들과 새로운 독서 그룹을 만들어 보세요.
          </p>

          {/* Sub-navigation Segmented Control */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'reviews'
                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                  : 'bg-white text-[#44403C] border-[#D6D0C4] hover:border-[#1C1917]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              감상평 공유 게시판 ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clubs')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'clubs'
                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                  : 'bg-white text-[#44403C] border-[#D6D0C4] hover:border-[#1C1917]'
              }`}
            >
              <Users className="w-4 h-4" />
              고전 독서 모임 · 그룹 ({clubs.length})
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <EditorialImage
            src={EDITORIAL_IMAGES.spotBookClub}
            alt="따뜻한 조명 아래 고전문학을 함께 읽고 토론하는 독서 모임"
            aspectClass="aspect-[16/9]"
          />
        </div>
      </section>

      {/* TAB 1: SHARED REVIEWS BOARD */}
      {activeTab === 'reviews' && (
        <section aria-labelledby="community-reviews-heading" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-4">
            <div>
              <h2
                id="community-reviews-heading"
                className="font-editorial text-2xl font-bold text-[#1C1917]"
              >
                독자 감상평 아카이브
              </h2>
              <p className="text-xs text-[#68625B] mt-1">
                고전문학 100선을 읽은 독자들의 생생한 서평과 밑줄 친 문장들입니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm((prev) => !prev)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9A3412] text-white text-sm font-medium rounded-sm hover:bg-[#7C2D12] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              {showReviewForm ? '감상평 작성 닫기' : '새 감상평 공유하기'}
            </button>
          </div>

          {/* Inline New Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="bg-white border border-[#DED8CE] p-6 sm:p-8 space-y-5"
              noValidate
            >
              <h3 className="font-editorial text-lg font-bold text-[#1C1917]">
                커뮤니티에 감상평 남기기
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-1.5">
                  <label
                    htmlFor="rev-book-select"
                    className="block text-xs font-semibold text-[#1C1917]"
                  >
                    대상 고전 도서
                  </label>
                  <select
                    id="rev-book-select"
                    value={revBookId}
                    onChange={(e) => setRevBookId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {String(b.id).padStart(3, '0')}. {b.title} ({b.author})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="rev-author-input"
                    className="block text-xs font-semibold text-[#1C1917]"
                  >
                    필명 (작성자)
                  </label>
                  <input
                    id="rev-author-input"
                    type="text"
                    value={revAuthor}
                    onChange={(e) => setRevAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="rev-rating-select"
                    className="block text-xs font-semibold text-[#1C1917]"
                  >
                    평점
                  </label>
                  <select
                    id="rev-rating-select"
                    value={revRating}
                    onChange={(e) => setRevRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                  >
                    <option value={5}>★★★★★ (5점)</option>
                    <option value={4}>★★★★☆ (4점)</option>
                    <option value={3}>★★★☆☆ (3점)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="rev-title-input"
                  className="block text-xs font-semibold text-[#1C1917]"
                >
                  감상평 제목
                </label>
                <input
                  id="rev-title-input"
                  type="text"
                  value={revTitle}
                  onChange={(e) => setRevTitle(e.target.value)}
                  placeholder="예: 시대를 초월해 오늘의 나를 돌아보게 만든 한 권의 고전"
                  className="w-full px-3.5 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="rev-quote-input"
                  className="block text-xs font-semibold text-[#1C1917]"
                >
                  인상 깊었던 문장 (선택)
                </label>
                <input
                  id="rev-quote-input"
                  type="text"
                  value={revQuote}
                  onChange={(e) => setRevQuote(e.target.value)}
                  placeholder="함께 나누고 싶은 책 속 구절을 입력해 주세요..."
                  className="w-full px-3.5 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="rev-content-textarea"
                  className="block text-xs font-semibold text-[#1C1917]"
                >
                  감상평 본문
                </label>
                <textarea
                  id="rev-content-textarea"
                  rows={4}
                  value={revContent}
                  onChange={(e) => setRevContent(e.target.value)}
                  placeholder="작품의 줄거리나 인물, 문장에 대한 솔직한 감상을 들려주세요..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                />
              </div>

              {revError && (
                <div
                  role="alert"
                  className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]"
                >
                  {revError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-xs text-[#57534E] border border-[#D6D0C4] rounded-sm cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#9A3412] text-white text-xs font-medium rounded-sm hover:bg-[#7C2D12] cursor-pointer"
                >
                  게시판에 등록하기
                </button>
              </div>
            </form>
          )}

          {/* Review Cards */}
          <div className="space-y-6">
            {reviews.map((rev) => {
              const book =
                books.find((b) => b.id === rev.bookId) || books[0];
              const commentText = commentInputs[rev.id] || '';
              return (
                <article
                  key={rev.id}
                  className="bg-white border border-[#E5E0D5] p-6 sm:p-8 space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E5E0D5] pb-4">
                    <div className="flex items-start gap-4">
                      <BookCoverArt
                        book={book}
                        size="sm"
                        className="w-16 h-24 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#68625B]">
                          <strong className="text-[#1C1917]">
                            {rev.authorName}
                          </strong>
                          <span aria-hidden="true">·</span>
                          <span>{rev.authorRole}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num text-[#9A3412]">
                            {'★'.repeat(rev.rating)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num">{rev.createdAt}</span>
                        </div>

                        <h3 className="font-editorial text-xl font-bold text-[#1C1917]">
                          {rev.title}
                        </h3>

                        <button
                          type="button"
                          onClick={() => onSelectBook(book)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9A3412] hover:underline cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          대상 도서: 『{book.title}』 ({book.author}) — 줄거리 요약 보기
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleLikeReview(rev.id)}
                      aria-label={`감상평 공감하기 (현재 ${rev.likes}명)`}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono-num border rounded-sm transition-colors cursor-pointer shrink-0 ${
                        rev.likedByMe
                          ? 'bg-[#FEF2F2] border-[#9A3412] text-[#9A3412] font-semibold'
                          : 'bg-[#FBF9F5] border-[#D6D0C4] text-[#44403C] hover:border-[#1C1917]'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          rev.likedByMe ? 'fill-[#9A3412] text-[#9A3412]' : ''
                        }`}
                      />
                      공감 {rev.likes}
                    </button>
                  </div>

                  {rev.favoriteQuote && (
                    <blockquote className="p-4 bg-[#F6F3EC] border border-[#E5E0D5] font-editorial italic text-sm text-[#1C1917]">
                      “{rev.favoriteQuote}”
                    </blockquote>
                  )}

                  <p className="text-sm sm:text-base text-[#292524] leading-relaxed">
                    {rev.content}
                  </p>

                  {/* Comments Section */}
                  <div className="pt-4 border-t border-[#E5E0D5] space-y-3">
                    {rev.comments.length > 0 && (
                      <div className="space-y-2">
                        {rev.comments.map((c) => (
                          <div
                            key={c.id}
                            className="p-3 bg-[#FBF9F5] border border-[#E5E0D5] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                          >
                            <div>
                              <strong className="text-[#1C1917] mr-2">
                                {c.authorName}
                              </strong>
                              <span className="text-[#44403C]">{c.content}</span>
                            </div>
                            <span className="font-mono-num text-[#78716C] shrink-0">
                              {c.createdAt}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <label htmlFor={`comment-input-${rev.id}`} className="sr-only">
                        감상평 댓글 입력
                      </label>
                      <input
                        id={`comment-input-${rev.id}`}
                        type="text"
                        value={commentText}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [rev.id]: e.target.value,
                          }))
                        }
                        placeholder="이 감상평에 대한 생각이나 질문을 댓글로 남겨보세요..."
                        className="flex-1 px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm focus:outline-none focus:border-[#9A3412]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!commentText.trim()) return;
                          onAddComment(rev.id, '서재독자', commentText.trim());
                          setCommentInputs((prev) => ({
                            ...prev,
                            [rev.id]: '',
                          }));
                        }}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-[#1C1917] text-white text-xs font-medium rounded-sm hover:bg-[#292524] cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Send className="w-3 h-3" />
                        댓글 등록
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: BOOK CLUB GROUPS */}
      {activeTab === 'clubs' && (
        <section aria-labelledby="book-clubs-heading" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-4">
            <div>
              <h2
                id="book-clubs-heading"
                className="font-editorial text-2xl font-bold text-[#1C1917]"
              >
                고전 함께 읽기 · 독서 그룹 ({clubs.length})
              </h2>
              <p className="text-xs text-[#68625B] mt-1">
                고전문학 100선 중 함께 읽고 싶은 책으로 독서 모임을 직접 개설하거나 참여해 보세요.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowClubForm((prev) => !prev)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9A3412] text-white text-sm font-medium rounded-sm hover:bg-[#7C2D12] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              {showClubForm ? '모임 개설 폼 닫기' : '새 독서 그룹 만들기'}
            </button>
          </div>

          {clubSuccess && (
            <div
              role="status"
              className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534] flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{clubSuccess}</span>
            </div>
          )}

          {/* Create New Book Club Form */}
          {showClubForm && (
            <form
              onSubmit={handleClubSubmit}
              className="bg-white border border-[#DED8CE] p-6 sm:p-8 space-y-5"
              noValidate
            >
              <h3 className="font-editorial text-xl font-bold text-[#1C1917]">
                새로운 고전 독서 그룹 개설하기
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="club-name-input"
                    className="block text-xs font-semibold text-[#1C1917]"
                  >
                    독서 그룹(모임) 이름 (필수)
                  </label>
                  <input
                    id="club-name-input"
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="예: 금요 고전 산책 — 『돈키호테』 한 달 완독반"
                    className="w-full px-3.5 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="club-book-select"
                    className="block text-xs font-semibold text-[#1C1917]"
                  >
                    함께 읽을 고전 100선 도서
                  </label>
                  <select
                    id="club-book-select"
                    value={clubBookId}
                    onChange={(e) => setClubBookId(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {String(b.id).padStart(3, '0')}. {b.title} — {b.author}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="club-host-input"
                    className="block text-xs font-semibold text-[#1C1917]"
                  >
                    모임장 이름
                  </label>
                  <input
                    id="club-host-input"
                    type="text"
                    value={clubHost}
                    onChange={(e) => setClubHost(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="club-format-select"
                    className="block text-xs font-semibold text-[#1C1917]"
                  >
                    진행 방식
                  </label>
                  <select
                    id="club-format-select"
                    value={clubFormat}
                    onChange={(e) =>
                      setClubFormat(
                        e.target.value as
                          | '온라인 심야 살롱'
                          | '오프라인 독서 모임'
                          | '매일 필사 챌린지'
                      )
                    }
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                  >
                    <option value="온라인 심야 살롱">온라인 심야 살롱</option>
                    <option value="오프라인 독서 모임">오프라인 독서 모임</option>
                    <option value="매일 필사 챌린지">매일 필사 챌린지</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="club-schedule-input"
                    className="block text-xs font-semibold text-[#1C1917]"
                  >
                    모임 일정 (필수)
                  </label>
                  <input
                    id="club-schedule-input"
                    type="text"
                    value={clubSchedule}
                    onChange={(e) => setClubSchedule(e.target.value)}
                    placeholder="예: 매주 토요일 오전 10:30"
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="club-capacity-input"
                    className="block text-xs font-semibold text-[#1C1917]"
                  >
                    정원 (명)
                  </label>
                  <input
                    id="club-capacity-input"
                    type="number"
                    min={4}
                    max={50}
                    value={clubMaxMembers}
                    onChange={(e) => setClubMaxMembers(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono-num bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="club-desc-textarea"
                  className="block text-xs font-semibold text-[#1C1917]"
                >
                  모임 소개 및 진도 계획 (필수)
                </label>
                <textarea
                  id="club-desc-textarea"
                  rows={3}
                  value={clubDesc}
                  onChange={(e) => setClubDesc(e.target.value)}
                  placeholder="모임의 분위기와 주간 독서 분량, 어떤 분들과 함께 읽고 싶은지 소개해 주세요..."
                  className="w-full px-3.5 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="club-topic-input"
                  className="block text-xs font-semibold text-[#1C1917]"
                >
                  첫 모임 대표 발제 질문 (선택)
                </label>
                <input
                  id="club-topic-input"
                  type="text"
                  value={clubTopic}
                  onChange={(e) => setClubTopic(e.target.value)}
                  placeholder="함께 토론해 보고 싶은 질문을 적어주세요..."
                  className="w-full px-3.5 py-2 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm"
                />
              </div>

              {clubError && (
                <div
                  role="alert"
                  className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]"
                >
                  {clubError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClubForm(false)}
                  className="px-4 py-2 text-xs text-[#57534E] border border-[#D6D0C4] rounded-sm cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#9A3412] text-white text-xs font-medium rounded-sm hover:bg-[#7C2D12] cursor-pointer"
                >
                  독서 그룹 개설 완료
                </button>
              </div>
            </form>
          )}

          {/* Book Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clubs.map((club) => {
              const book =
                books.find((b) => b.id === club.bookId) || books[0];
              return (
                <article
                  key={club.id}
                  className="bg-white border border-[#E5E0D5] p-6 sm:p-8 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <BookCoverArt
                        book={book}
                        size="sm"
                        className="w-20 h-28 shrink-0"
                      />
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#68625B]">
                          <span className="font-semibold text-[#9A3412]">
                            {club.format}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>모임장 {club.hostName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num">
                            참여 {club.memberCount}/{club.maxMembers}명
                          </span>
                        </div>

                        <h3 className="font-editorial text-xl font-bold text-[#1C1917] leading-snug">
                          {club.name}
                        </h3>

                        <button
                          type="button"
                          onClick={() => onSelectBook(book)}
                          className="text-xs font-medium text-[#57534E] hover:text-[#9A3412] cursor-pointer text-left"
                        >
                          함께 읽는 책: 『{book.title}』 ({book.author}) · 줄거리 요약 보기 →
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#44403C] pt-2 border-t border-[#F2EFE9]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#9A3412]" />
                        {club.schedule}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{club.pace}</span>
                    </div>

                    <p className="text-sm text-[#292524] leading-relaxed">
                      {club.description}
                    </p>

                    <div className="p-3.5 bg-[#F6F3EC] border border-[#E5E0D5] space-y-1">
                      <div className="text-xs font-semibold text-[#9A3412]">
                        대표 토론 발제문
                      </div>
                      <p className="text-xs text-[#1C1917] leading-relaxed">
                        “{club.discussionTopic}”
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E0D5] flex items-center justify-between gap-4">
                    <div className="text-xs text-[#68625B]">
                      {club.tags.join(' · ')}
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleJoinClub(club.id)}
                      className={`px-4 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        club.joinedByMe
                          ? 'bg-[#166534] text-white hover:bg-[#14532D]'
                          : 'bg-[#1C1917] text-white hover:bg-[#292524]'
                      }`}
                    >
                      {club.joinedByMe
                        ? '참여 중인 모임 (참여 취소)'
                        : '모임 참여하기'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
