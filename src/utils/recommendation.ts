import {
  ClassicBook,
  DifficultyLevel,
  JournalEntry,
  MoodCategory,
  ReadingPurpose,
  RegionCategory,
  ThemeCategory,
} from '../data/classics100';

export interface SurveyPreferences {
  theme: ThemeCategory;
  mood: MoodCategory;
  region: RegionCategory | '전체 문화권';
  difficulty: DifficultyLevel;
  purpose: ReadingPurpose;
}

export interface BookRecommendationResult {
  book: ClassicBook;
  matchPercentage: number;
  rawScore: number;
  matchedDimensions: string[];
  recommendationReason: string;
}

export interface CatalogFilterOptions {
  searchQuery?: string;
  chosung?: string; // '전체' | '숫자' | 'ㄱ' | 'ㄴ' | 'ㄷ' | 'ㄹ' | 'ㅁ' | 'ㅂ' | 'ㅅ' | 'ㅇ' | 'ㅈ' | 'ㅊ' | 'ㅋ' | 'ㅌ' | 'ㅍ' | 'ㅎ'
  theme?: ThemeCategory | '전체';
  region?: RegionCategory | '전체';
  difficulty?: DifficultyLevel | '전체';
  sortBy?: 'id' | 'citation' | 'pageAsc';
}

export interface JournalStats {
  totalCount: number;
  completedCount: number;
  readingCount: number;
  wishlistCount: number;
  sharedCount: number;
  totalPagesRead: number;
  averageRating: number;
}

const CHOSUNG_LIST = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const;

export function getFirstChosungGroup(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return '기타';
  const firstChar = trimmed[0];
  if (/[0-9]/.test(firstChar)) {
    return '숫자';
  }
  const code = firstChar.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) {
    return '기타';
  }
  const chosungIndex = Math.floor(code / 588);
  const chosung = CHOSUNG_LIST[chosungIndex];
  const normalizedMap: Record<string, string> = {
    ㄲ: 'ㄱ',
    ㄸ: 'ㄷ',
    ㅃ: 'ㅂ',
    ㅆ: 'ㅅ',
    ㅉ: 'ㅈ',
  };
  return normalizedMap[chosung] || chosung;
}

export function calculateBookMatch(
  book: ClassicBook,
  prefs: SurveyPreferences
): BookRecommendationResult {
  let score = 0;
  const matchedDimensions: string[] = [];

  // 1. Theme match (up to 32 pts)
  if (book.themes[0] === prefs.theme) {
    score += 32;
    matchedDimensions.push(`핵심 주제 ‘${prefs.theme}’ 일치`);
  } else if (book.themes[1] === prefs.theme) {
    score += 24;
    matchedDimensions.push(`연관 주제 ‘${prefs.theme}’ 부합`);
  }

  // 2. Mood match (up to 24 pts)
  if (book.mood === prefs.mood) {
    score += 24;
    matchedDimensions.push(`‘${prefs.mood}’ 서사 분위기`);
  }

  // 3. Purpose match (up to 22 pts)
  if (book.purpose === prefs.purpose) {
    score += 22;
    matchedDimensions.push(`‘${prefs.purpose}’ 독서 목적`);
  }

  // 4. Difficulty match (up to 12 pts)
  if (book.difficulty === prefs.difficulty) {
    score += 12;
    matchedDimensions.push(`‘${prefs.difficulty}’ 호흡`);
  } else if (
    (prefs.difficulty === '깊이 있는 사유' && book.difficulty === '입문 추천') ||
    (prefs.difficulty === '대작 벽돌책' && book.difficulty === '깊이 있는 사유')
  ) {
    score += 6;
  }

  // 5. Region match (up to 10 pts)
  if (prefs.region === '전체 문화권' || book.region === prefs.region) {
    score += 10;
    if (prefs.region !== '전체 문화권') {
      matchedDimensions.push(`${prefs.region} 고전`);
    }
  }

  // Institutional citation bonus (up to 4 pts for tie-breaking & authority)
  const authorityBonus = Math.min(4, Math.max(1, book.citationCount - 2));
  const rawScore = score + authorityBonus;

  // Map rawScore into a realistic 62% ~ 99% match percentage
  const matchPercentage = Math.min(99, Math.max(62, Math.round(54 + score * 0.45)));

  const reasonParts =
    matchedDimensions.length > 0
      ? matchedDimensions.slice(0, 3).join(', ')
      : `${book.themes[0]} 주제와 ${book.mood} 분위기`;

  const recommendationReason = `선택하신 ${reasonParts} 취향에 깊이 공명하는 작품입니다. 6대 권장 목록 중 ${book.citationCount}개 기관이 선정한 고전으로, ${book.summary.hook}`;

  return {
    book,
    matchPercentage,
    rawScore,
    matchedDimensions,
    recommendationReason,
  };
}

export function getRecommendedBooks(
  books: ClassicBook[],
  prefs: SurveyPreferences,
  limit = 6
): BookRecommendationResult[] {
  return books
    .map((book) => calculateBookMatch(book, prefs))
    .sort((a, b) => {
      if (b.rawScore !== a.rawScore) {
        return b.rawScore - a.rawScore;
      }
      if (b.book.citationCount !== a.book.citationCount) {
        return b.book.citationCount - a.book.citationCount;
      }
      return a.book.id - b.book.id;
    })
    .slice(0, limit);
}

export function filterClassicsCatalog(
  books: ClassicBook[],
  options: CatalogFilterOptions
): ClassicBook[] {
  const query = (options.searchQuery || '').trim().toLowerCase();
  const chosung = options.chosung || '전체';
  const theme = options.theme || '전체';
  const region = options.region || '전체';
  const difficulty = options.difficulty || '전체';
  const sortBy = options.sortBy || 'id';

  const filtered = books.filter((book) => {
    if (query) {
      const searchable = [
        book.title,
        book.author,
        book.genre,
        book.era,
        book.summary.hook,
        book.summary.famousQuote,
        ...book.themes,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(query)) {
        return false;
      }
    }

    if (chosung !== '전체') {
      if (getFirstChosungGroup(book.title) !== chosung) {
        return false;
      }
    }

    if (theme !== '전체' && !book.themes.includes(theme)) {
      return false;
    }

    if (region !== '전체' && book.region !== region) {
      return false;
    }

    if (difficulty !== '전체' && book.difficulty !== difficulty) {
      return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'citation') {
      return b.citationCount - a.citationCount || a.id - b.id;
    }
    if (sortBy === 'pageAsc') {
      return a.pageEstimate - b.pageEstimate || a.id - b.id;
    }
    return a.id - b.id;
  });
}

export function computeJournalStats(
  entries: JournalEntry[],
  books: ClassicBook[]
): JournalStats {
  const bookMap = new Map<number, ClassicBook>(books.map((b) => [b.id, b]));
  let completedCount = 0;
  let readingCount = 0;
  let wishlistCount = 0;
  let sharedCount = 0;
  let totalPagesRead = 0;
  let ratingSum = 0;

  for (const entry of entries) {
    if (entry.status === '완독') {
      completedCount += 1;
      const b = bookMap.get(entry.bookId);
      if (b) {
        totalPagesRead += b.pageEstimate;
      }
    } else if (entry.status === '읽는 중') {
      readingCount += 1;
    } else if (entry.status === '읽고 싶은 책') {
      wishlistCount += 1;
    }
    if (entry.sharedToCommunity) {
      sharedCount += 1;
    }
    ratingSum += entry.rating;
  }

  const averageRating =
    entries.length > 0 ? Number((ratingSum / entries.length).toFixed(1)) : 0;

  return {
    totalCount: entries.length,
    completedCount,
    readingCount,
    wishlistCount,
    sharedCount,
    totalPagesRead,
    averageRating,
  };
}

export function validateJournalForm(input: {
  bookId: number;
  reviewText: string;
}): { valid: boolean; error?: string } {
  if (!input.bookId || input.bookId < 1 || input.bookId > 100) {
    return { valid: false, error: '고전문학 100선 중 기록할 도서를 선택해 주세요.' };
  }
  if (!input.reviewText || input.reviewText.trim().length < 5) {
    return { valid: false, error: '감상평이나 독서 메모를 5자 이상 입력해 주세요.' };
  }
  return { valid: true };
}

export function validateBookClubForm(input: {
  name: string;
  bookId: number;
  schedule: string;
  description: string;
}): { valid: boolean; error?: string } {
  if (!input.name || input.name.trim().length < 3) {
    return { valid: false, error: '독서 모임 이름을 3자 이상 입력해 주세요.' };
  }
  if (!input.bookId || input.bookId < 1 || input.bookId > 100) {
    return { valid: false, error: '함께 읽을 고전 도서를 선택해 주세요.' };
  }
  if (!input.schedule || input.schedule.trim().length < 3) {
    return { valid: false, error: '모임 일정(예: 매주 토요일 오전 10시)을 입력해 주세요.' };
  }
  if (!input.description || input.description.trim().length < 5) {
    return { valid: false, error: '모임 소개 및 진행 방식을 5자 이상 입력해 주세요.' };
  }
  return { valid: true };
}
