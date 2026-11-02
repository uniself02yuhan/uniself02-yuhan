/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  BookClubGroup,
  CLASSICS_100,
  ClassicBook,
  CommunityReview,
  INITIAL_BOOK_CLUBS,
  INITIAL_COMMUNITY_REVIEWS,
  INITIAL_JOURNAL_ENTRIES,
  JournalEntry,
} from './data/classics100';
import { SurveyPreferences } from './utils/recommendation';
import { TasteSurveyView } from './components/TasteSurveyView';
import { Catalog100View } from './components/Catalog100View';
import { ReadingJournalView } from './components/ReadingJournalView';
import { CommunityView } from './components/CommunityView';
import { BookDetailModal } from './components/BookDetailModal';

type ActiveSection = 'survey' | 'catalog' | 'journal' | 'community';

const STORAGE_KEYS = {
  PREFS: 'classic100_survey_prefs_v1',
  JOURNAL: 'classic100_journal_entries_v1',
  REVIEWS: 'classic100_community_reviews_v1',
  CLUBS: 'classic100_book_clubs_v1',
};

const DEFAULT_PREFERENCES: SurveyPreferences = {
  theme: '실존과 고독',
  mood: '지적·성찰적',
  region: '전체 문화권',
  difficulty: '입문 추천',
  purpose: '삶의 방향과 위로',
};

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('survey');
  const [selectedBookForModal, setSelectedBookForModal] =
    useState<ClassicBook | null>(null);
  const [preselectedJournalBookId, setPreselectedJournalBookId] = useState<
    number | null
  >(null);
  const [communityInitialTab, setCommunityInitialTab] = useState<
    'reviews' | 'clubs'
  >('reviews');
  const [preselectedClubBookId, setPreselectedClubBookId] = useState<
    number | null
  >(null);

  // Persistent States
  const [preferences, setPreferences] = useState<SurveyPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREFS);
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });

  const [communityReviews, setCommunityReviews] = useState<CommunityReview[]>(
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
        return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_REVIEWS;
      } catch {
        return INITIAL_COMMUNITY_REVIEWS;
      }
    }
  );

  const [bookClubs, setBookClubs] = useState<BookClubGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLUBS);
      return saved ? JSON.parse(saved) : INITIAL_BOOK_CLUBS;
    } catch {
      return INITIAL_BOOK_CLUBS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(preferences));
    } catch {
      // ignore storage quota errors
    }
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.JOURNAL,
        JSON.stringify(journalEntries)
      );
    } catch {
      // ignore
    }
  }, [journalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.REVIEWS,
        JSON.stringify(communityReviews)
      );
    } catch {
      // ignore
    }
  }, [communityReviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(bookClubs));
    } catch {
      // ignore
    }
  }, [bookClubs]);

  // Handlers
  const handleOpenWriteJournal = (book: ClassicBook) => {
    setSelectedBookForModal(null);
    setPreselectedJournalBookId(book.id);
    setActiveSection('journal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreateClubForBook = (book: ClassicBook) => {
    setSelectedBookForModal(null);
    setCommunityInitialTab('clubs');
    setPreselectedClubBookId(book.id);
    setActiveSection('community');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveJournalEntry = (
    entryInput: Omit<JournalEntry, 'id' | 'createdAt'>,
    publishToCommunity: boolean
  ) => {
    const today = '2026-11-01';
    const newEntry: JournalEntry = {
      ...entryInput,
      id: `journal-${Date.now()}`,
      createdAt: today,
    };

    setJournalEntries((prev) => [newEntry, ...prev]);

    if (publishToCommunity) {
      const targetBook =
        CLASSICS_100.find((b) => b.id === entryInput.bookId) || CLASSICS_100[0];
      const newCommunityReview: CommunityReview = {
        id: `rev-${Date.now()}`,
        bookId: entryInput.bookId,
        authorName: '나의 서재 기록',
        authorRole: `${entryInput.status} · 독서 기록장 공유`,
        rating: entryInput.rating,
        title: `『${targetBook.title}』 독서 기록 — ${entryInput.reviewText.slice(0, 28)}...`,
        content: entryInput.reviewText,
        favoriteQuote: entryInput.favoriteQuote,
        likes: 1,
        likedByMe: true,
        createdAt: today,
        comments: [],
      };
      setCommunityReviews((prev) => [newCommunityReview, ...prev]);
    }
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleShareExistingEntryToCommunity = (entry: JournalEntry) => {
    setJournalEntries((prev) =>
      prev.map((item) =>
        item.id === entry.id ? { ...item, sharedToCommunity: true } : item
      )
    );
    const targetBook =
      CLASSICS_100.find((b) => b.id === entry.bookId) || CLASSICS_100[0];
    const newReview: CommunityReview = {
      id: `rev-${Date.now()}`,
      bookId: entry.bookId,
      authorName: '나의 서재 기록',
      authorRole: `${entry.status} · 독서 기록장 공유`,
      rating: entry.rating,
      title: `『${targetBook.title}』을 읽고 남긴 서재 노트`,
      content: entry.reviewText,
      favoriteQuote: entry.favoriteQuote,
      likes: 1,
      likedByMe: true,
      createdAt: '2026-11-01',
      comments: [],
    };
    setCommunityReviews((prev) => [newReview, ...prev]);
  };

  const handleAddCommunityReview = (input: {
    bookId: number;
    authorName: string;
    rating: number;
    title: string;
    content: string;
    favoriteQuote: string;
  }) => {
    const newReview: CommunityReview = {
      id: `rev-${Date.now()}`,
      bookId: input.bookId,
      authorName: input.authorName,
      authorRole: '고전 100선 독자',
      rating: input.rating,
      title: input.title,
      content: input.content,
      favoriteQuote: input.favoriteQuote,
      likes: 1,
      likedByMe: true,
      createdAt: '2026-11-01',
      comments: [],
    };
    setCommunityReviews((prev) => [newReview, ...prev]);
  };

  const handleToggleLikeReview = (reviewId: string) => {
    setCommunityReviews((prev) =>
      prev.map((rev) => {
        if (rev.id !== reviewId) return rev;
        const nextLiked = !rev.likedByMe;
        return {
          ...rev,
          likedByMe: nextLiked,
          likes: nextLiked ? rev.likes + 1 : Math.max(0, rev.likes - 1),
        };
      })
    );
  };

  const handleAddComment = (
    reviewId: string,
    authorName: string,
    content: string
  ) => {
    setCommunityReviews((prev) =>
      prev.map((rev) => {
        if (rev.id !== reviewId) return rev;
        return {
          ...rev,
          comments: [
            ...rev.comments,
            {
              id: `comment-${Date.now()}`,
              authorName,
              content,
              createdAt: '2026-11-01',
            },
          ],
        };
      })
    );
  };

  const handleCreateBookClub = (clubInput: {
    name: string;
    bookId: number;
    hostName: string;
    schedule: string;
    pace: string;
    format: '온라인 심야 살롱' | '오프라인 독서 모임' | '매일 필사 챌린지';
    description: string;
    discussionTopic: string;
    maxMembers: number;
  }) => {
    const targetBook =
      CLASSICS_100.find((b) => b.id === clubInput.bookId) || CLASSICS_100[0];
    const newClub: BookClubGroup = {
      id: `club-${Date.now()}`,
      name: clubInput.name,
      bookId: clubInput.bookId,
      hostName: clubInput.hostName,
      schedule: clubInput.schedule,
      pace: clubInput.pace,
      format: clubInput.format,
      description: clubInput.description,
      discussionTopic: clubInput.discussionTopic,
      memberCount: 1,
      maxMembers: clubInput.maxMembers,
      joinedByMe: true,
      tags: [targetBook.region, targetBook.themes[0], '신규 모임'],
    };
    setBookClubs((prev) => [newClub, ...prev]);
  };

  const handleToggleJoinClub = (clubId: string) => {
    setBookClubs((prev) =>
      prev.map((club) => {
        if (club.id !== clubId) return club;
        const nextJoined = !club.joinedByMe;
        return {
          ...club,
          joinedByMe: nextJoined,
          memberCount: nextJoined
            ? Math.min(club.maxMembers, club.memberCount + 1)
            : Math.max(1, club.memberCount - 1),
        };
      })
    );
  };

  const modalBookReviews = selectedBookForModal
    ? communityReviews.filter((r) => r.bookId === selectedBookForModal.id)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => setActiveSection('survey')}
            className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            고전의 서재 · ARCHIVE 100
          </button>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="주요 메뉴"
            className="flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-medium text-[#57534E] overflow-x-auto"
          >
            <button
              type="button"
              onClick={() => setActiveSection('survey')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'survey'
                  ? 'border-[#9A3412] text-[#1C1917] font-semibold'
                  : 'border-transparent hover:text-[#1C1917]'
              }`}
            >
              취향 맞춤 추천
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('catalog')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'catalog'
                  ? 'border-[#9A3412] text-[#1C1917] font-semibold'
                  : 'border-transparent hover:text-[#1C1917]'
              }`}
            >
              고전문학 100선
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('journal')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'journal'
                  ? 'border-[#9A3412] text-[#1C1917] font-semibold'
                  : 'border-transparent hover:text-[#1C1917]'
              }`}
            >
              독서 기록장
            </button>
            <button
              type="button"
              onClick={() => {
                setCommunityInitialTab('reviews');
                setActiveSection('community');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'community'
                  ? 'border-[#9A3412] text-[#1C1917] font-semibold'
                  : 'border-transparent hover:text-[#1C1917]'
              }`}
            >
              커뮤니티 · 모임
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveSection('survey');
                setTimeout(() => {
                  document
                    .getElementById('taste-survey-panel')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1C1917] rounded-sm hover:bg-[#292524] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              내 취향 진단하기
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {activeSection === 'survey' && (
          <TasteSurveyView
            books={CLASSICS_100}
            preferences={preferences}
            onUpdatePreferences={setPreferences}
            onSelectBook={(book) => setSelectedBookForModal(book)}
            onWriteJournal={handleOpenWriteJournal}
            onNavigateCatalog={() => {
              setActiveSection('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeSection === 'catalog' && (
          <Catalog100View
            books={CLASSICS_100}
            onSelectBook={(book) => setSelectedBookForModal(book)}
            onWriteJournal={handleOpenWriteJournal}
          />
        )}

        {activeSection === 'journal' && (
          <ReadingJournalView
            books={CLASSICS_100}
            entries={journalEntries}
            preselectedBookId={preselectedJournalBookId}
            onSaveEntry={handleSaveJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
            onShareEntryToCommunity={handleShareExistingEntryToCommunity}
            onSelectBook={(book) => setSelectedBookForModal(book)}
          />
        )}

        {activeSection === 'community' && (
          <CommunityView
            books={CLASSICS_100}
            reviews={communityReviews}
            clubs={bookClubs}
            initialSubTab={communityInitialTab}
            preselectedClubBookId={preselectedClubBookId}
            onAddReview={handleAddCommunityReview}
            onToggleLikeReview={handleToggleLikeReview}
            onAddComment={handleAddComment}
            onCreateClub={handleCreateBookClub}
            onToggleJoinClub={handleToggleJoinClub}
            onSelectBook={(book) => setSelectedBookForModal(book)}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#E5E0D5] bg-[#F5F2EB] py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#68625B]">
          <div>
            <strong className="font-editorial text-[#1C1917]">
              고전의 서재 · ARCHIVE 100
            </strong>{' '}
            — 국내외 6대 기관(서울대·고려대·연세대·미국 대학위원회·뉴욕타임스·랜덤하우스) 추천 고전문학 100선 큐레이션 및 독서 아카이브
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveSection('catalog')}
              className="hover:text-[#1C1917] cursor-pointer"
            >
              100선 전체 목록
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveSection('journal')}
              className="hover:text-[#1C1917] cursor-pointer"
            >
              독서 기록장
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveSection('community')}
              className="hover:text-[#1C1917] cursor-pointer"
            >
              독서 모임 살롱
            </button>
          </div>
        </div>
      </footer>

      {/* Book Plot Summary & Curatorial Dossier Modal */}
      <BookDetailModal
        book={selectedBookForModal}
        onClose={() => setSelectedBookForModal(null)}
        onWriteJournal={handleOpenWriteJournal}
        onCreateClubForBook={handleOpenCreateClubForBook}
        bookReviews={modalBookReviews}
      />
    </div>
  );
}
