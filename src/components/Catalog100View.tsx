import React, { useState } from 'react';
import { Search, BookOpen, BookMarked, RotateCcw } from 'lucide-react';
import {
  ClassicBook,
  DifficultyLevel,
  RegionCategory,
  SIX_INSTITUTIONS,
  ThemeCategory,
} from '../data/classics100';
import { filterClassicsCatalog } from '../utils/recommendation';
import { BookCoverArt, EditorialImage } from './BookCoverArt';
import { EDITORIAL_IMAGES } from '../assets/editorialImages';

interface Catalog100ViewProps {
  books: ClassicBook[];
  onSelectBook: (book: ClassicBook) => void;
  onWriteJournal: (book: ClassicBook) => void;
}

const CHOSUNG_TABS = [
  '전체',
  '숫자',
  'ㄱ',
  'ㄴ',
  'ㄷ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅅ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const THEMES: (ThemeCategory | '전체')[] = [
  '전체',
  '실존과 고독',
  '사회와 권력',
  '사랑과 욕망',
  '성장과 구원',
  '인간 본성',
  '역사와 운명',
];

const REGIONS: (RegionCategory | '전체')[] = [
  '전체',
  '영미권',
  '유럽 대륙',
  '러시아',
  '한국',
  '동아시아·인도',
  '고대·중동·아프리카',
];

const DIFFICULTIES: (DifficultyLevel | '전체')[] = [
  '전체',
  '입문 추천',
  '깊이 있는 사유',
  '대작 벽돌책',
];

export const Catalog100View: React.FC<Catalog100ViewProps> = ({
  books,
  onSelectBook,
  onWriteJournal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chosung, setChosung] = useState('전체');
  const [theme, setTheme] = useState<ThemeCategory | '전체'>('전체');
  const [region, setRegion] = useState<RegionCategory | '전체'>('전체');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | '전체'>('전체');
  const [sortBy, setSortBy] = useState<'id' | 'citation' | 'pageAsc'>('id');

  const filteredBooks = filterClassicsCatalog(books, {
    searchQuery,
    chosung,
    theme,
    region,
    difficulty,
    sortBy,
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setChosung('전체');
    setTheme('전체');
    setRegion('전체');
    setDifficulty('전체');
    setSortBy('id');
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#E5E0D5] pb-10">
        <div className="lg:col-span-8 space-y-4">
          <div className="text-xs font-mono-num tracking-wider text-[#9A3412] uppercase font-semibold">
            CANONICAL ARCHIVE · NO.001 — NO.100
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight text-balance">
            국내외 6대 기관 선정 고전문학 100선 총람 및 줄거리 요약
          </h1>
          <p className="text-sm sm:text-base text-[#44403C] leading-relaxed max-w-2xl">
            서울대·고려대·연세대·미국 대학위원회·뉴욕타임스·랜덤하우스 추천 목록에서 3회 이상 거론된 42권과 2회 이상 거론된 58권을 가나다순(1번 『1984』부터 100번 『황무지』까지)으로 전권 수록했습니다. 각 도서의 3단 줄거리 요약과 문학사적 의의를 확인해 보세요.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#68625B] pt-1">
            {SIX_INSTITUTIONS.map((inst, idx) => (
              <React.Fragment key={inst}>
                <span>{inst}</span>
                {idx < SIX_INSTITUTIONS.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <EditorialImage
            src={EDITORIAL_IMAGES.spotCuratedClassics}
            alt="고전문학 양장본 아카이브 컬렉션"
            aspectClass="aspect-[16/10]"
          />
        </div>
      </section>

      {/* Search & Filter Control Panel */}
      <section
        aria-label="고전문학 100선 검색 및 필터"
        className="bg-white border border-[#DED8CE] p-6 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 relative">
            <label htmlFor="catalog-search-input" className="sr-only">
              도서명, 저자, 줄거리 키워드 검색
            </label>
            <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="catalog-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도서명, 저자(예: 카프카, 박지원), 줄거리 키워드 검색..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm focus:outline-none focus:border-[#9A3412]"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="catalog-region-select" className="sr-only">
              문화권 필터
            </label>
            <select
              id="catalog-region-select"
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionCategory | '전체')}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm focus:outline-none focus:border-[#9A3412]"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  문화권: {r}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="catalog-sort-select" className="sr-only">
              정렬 기준
            </label>
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'id' | 'citation' | 'pageAsc')
              }
              className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6D0C4] rounded-sm focus:outline-none focus:border-[#9A3412]"
            >
              <option value="id">정렬: 가나다 목록 번호순 (1~100)</option>
              <option value="citation">정렬: 6대 기관 추천 빈도순</option>
              <option value="pageAsc">정렬: 분량 짧은 순 (입문용)</option>
            </select>
          </div>
        </div>

        {/* Chosung Index Rail */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#57534E]">
            가나다 초성 색인:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CHOSUNG_TABS.map((tab) => {
              const active = chosung === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setChosung(tab)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-[#FBF9F5] text-[#44403C] border-[#E5E0D5] hover:border-[#A8A29E]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme & Difficulty Filter Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-[#E5E0D5]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#57534E] mr-1">주제별:</span>
            {THEMES.map((t) => {
              const active = theme === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 text-xs font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#9A3412] text-white border-[#9A3412]'
                      : 'bg-[#FBF9F5] text-[#44403C] border-[#E5E0D5] hover:border-[#A8A29E]'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#57534E]">독서 호흡:</span>
            {DIFFICULTIES.map((d) => {
              const active = difficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1 text-xs font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-[#FBF9F5] text-[#44403C] border-[#E5E0D5] hover:border-[#A8A29E]'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Count & Reset */}
        <div className="flex items-center justify-between pt-2 text-xs text-[#68625B]">
          <div>
            전체 100권 중{' '}
            <strong className="font-mono-num text-[#1C1917]">
              {filteredBooks.length}권
            </strong>{' '}
            표시 중
          </div>
          {(searchQuery ||
            chosung !== '전체' ||
            theme !== '전체' ||
            region !== '전체' ||
            difficulty !== '전체') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[#9A3412] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              필터 모두 초기화
            </button>
          )}
        </div>
      </section>

      {/* Catalog Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white border border-[#E5E0D5] p-12 text-center space-y-4">
          <p className="font-editorial text-lg text-[#1C1917]">
            조건에 일치하는 고전문학 도서가 없습니다.
          </p>
          <p className="text-sm text-[#68625B]">
            검색어를 변경하거나 초성·주제 필터를 초기화해 보세요.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-medium rounded-sm hover:bg-[#292524] transition-colors cursor-pointer"
          >
            전체 100선 다시 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <article
              key={book.id}
              className="bg-white border border-[#E5E0D5] p-6 flex flex-col justify-between hover:border-[#A8A29E] transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <BookCoverArt
                    book={book}
                    size="sm"
                    className="w-20 h-28 shrink-0"
                  />
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-mono-num text-[#68625B]">
                      <span className="font-semibold text-[#9A3412]">
                        NO.{String(book.id).padStart(3, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{book.region}</span>
                      <span aria-hidden="true">·</span>
                      <span>{book.citationCount}개 기관</span>
                    </div>

                    <h3 className="font-editorial text-lg font-bold text-[#1C1917] leading-snug">
                      {book.title}
                    </h3>

                    <p className="text-xs font-medium text-[#44403C]">
                      {book.author} · {book.era}
                    </p>

                    <div className="text-xs text-[#68625B]">
                      {book.themes[0]} · {book.themes[1]} · {book.difficulty}
                    </div>
                  </div>
                </div>

                {/* Plot Summary Hook & Beginning Preview */}
                <div className="space-y-2 pt-2 border-t border-[#F2EFE9]">
                  <p className="text-xs font-semibold text-[#1C1917] leading-relaxed">
                    {book.summary.hook}
                  </p>
                  <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
                    <strong className="text-[#1C1917]">[줄거리 요약]</strong>{' '}
                    {book.summary.beginning} {book.summary.development}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E5E0D5] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectBook(book)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A3412] hover:text-[#7C2D12] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  3단 줄거리 요약 보기
                </button>
                <button
                  type="button"
                  onClick={() => onWriteJournal(book)}
                  className="inline-flex items-center gap-1 text-xs text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  기록장 담기
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
