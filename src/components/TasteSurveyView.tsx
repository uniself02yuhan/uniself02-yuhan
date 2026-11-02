import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  BookMarked,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Check,
} from 'lucide-react';
import {
  ClassicBook,
  DifficultyLevel,
  MoodCategory,
  ReadingPurpose,
  RegionCategory,
  SIX_INSTITUTIONS,
  ThemeCategory,
} from '../data/classics100';
import {
  BookRecommendationResult,
  getRecommendedBooks,
  SurveyPreferences,
} from '../utils/recommendation';
import { BookCoverArt, EditorialImage } from './BookCoverArt';
import { EDITORIAL_IMAGES } from '../assets/editorialImages';

interface TasteSurveyViewProps {
  books: ClassicBook[];
  preferences: SurveyPreferences;
  onUpdatePreferences: (prefs: SurveyPreferences) => void;
  onSelectBook: (book: ClassicBook) => void;
  onWriteJournal: (book: ClassicBook) => void;
  onNavigateCatalog: () => void;
}

const THEME_OPTIONS: { value: ThemeCategory; desc: string }[] = [
  { value: '실존과 고독', desc: '부조리한 세계 속에서 나답게 존재하는 법' },
  { value: '사회와 권력', desc: '체제와 정의, 역사의 구조에 대한 날카로운 통찰' },
  { value: '사랑과 욕망', desc: '열정과 결핍, 인간 관계의 가장 내밀한 파동' },
  { value: '성장과 구원', desc: '시련을 통과하며 성숙해지는 영혼의 순례' },
  { value: '인간 본성', desc: '선과 악, 욕망과 위선이 교차하는 심리의 심연' },
  { value: '역사와 운명', desc: '거대한 시대의 소용돌이와 마주 선 인간의 의지' },
];

const MOOD_OPTIONS: { value: MoodCategory; desc: string }[] = [
  { value: '지적·성찰적', desc: '차분하고 깊이 있는 철학적 사유와 아포리즘' },
  { value: '강렬·비극적', desc: '숨 막히는 갈등과 내면을 뒤흔드는 카타르시스' },
  { value: '풍자·해학적', desc: '세상의 위선을 꼬집는 날카로운 기지와 유머' },
  { value: '서정·감성적', desc: '아름다운 문장미와 오래 남는 시적 여운' },
  { value: '장대·서사적', desc: '수많은 인물이 살아 움직이는 웅장한 스케일' },
];

const REGION_OPTIONS: (RegionCategory | '전체 문화권')[] = [
  '전체 문화권',
  '영미권',
  '유럽 대륙',
  '러시아',
  '한국',
  '동아시아·인도',
  '고대·중동·아프리카',
];

const DIFFICULTY_OPTIONS: { value: DifficultyLevel; desc: string }[] = [
  { value: '입문 추천', desc: '200~400쪽 내외 · 몰입감 높고 읽기 수월한 고전' },
  { value: '깊이 있는 사유', desc: '중후한 주제 의식과 정교한 문학적 구조' },
  { value: '대작 벽돌책', desc: '인생에 한 번은 꼭 넘어야 할 대하 명작' },
];

const PURPOSE_OPTIONS: { value: ReadingPurpose; desc: string }[] = [
  { value: '삶의 방향과 위로', desc: '흔들리는 일상에서 중심을 잡아줄 지혜' },
  { value: '시대를 읽는 통찰', desc: '세상과 문명을 바라보는 넓은 안목' },
  { value: '인간 심리의 탐구', desc: '타인과 나 자신의 내면을 깊이 이해하는 눈' },
  { value: '문학적 미학과 감동', desc: '인류 최고 문장가들이 빚어낸 예술적 감동' },
];

const PERSONA_PRESETS: {
  label: string;
  subtitle: string;
  prefs: SurveyPreferences;
}[] = [
  {
    label: '실존을 묻는 산책자',
    subtitle: '카뮈 · 베케트 · 헤세 취향',
    prefs: {
      theme: '실존과 고독',
      mood: '지적·성찰적',
      region: '유럽 대륙',
      difficulty: '입문 추천',
      purpose: '삶의 방향과 위로',
    },
  },
  {
    label: '시대를 꿰뚫는 지성',
    subtitle: '조지 오웰 · 마키아벨리 · 루쉰 취향',
    prefs: {
      theme: '사회와 권력',
      mood: '풍자·해학적',
      region: '전체 문화권',
      difficulty: '입문 추천',
      purpose: '시대를 읽는 통찰',
    },
  },
  {
    label: '심연과 열정의 탐구자',
    subtitle: '도스토옙스키 · 셰익스피어 · 브론테 취향',
    prefs: {
      theme: '인간 본성',
      mood: '강렬·비극적',
      region: '전체 문화권',
      difficulty: '깊이 있는 사유',
      purpose: '인간 심리의 탐구',
    },
  },
  {
    label: '우리 고전의 멋과 숨결',
    subtitle: '박지원 · 김만중 · 박경리 취향',
    prefs: {
      theme: '역사와 운명',
      mood: '장대·서사적',
      region: '한국',
      difficulty: '깊이 있는 사유',
      purpose: '시대를 읽는 통찰',
    },
  },
];

export const TasteSurveyView: React.FC<TasteSurveyViewProps> = ({
  books,
  preferences,
  onUpdatePreferences,
  onSelectBook,
  onWriteJournal,
  onNavigateCatalog,
}) => {
  const [hasSubmittedSurvey, setHasSubmittedSurvey] = useState(true);
  const [surveyHighlightFlash, setSurveyHighlightFlash] = useState(false);

  const recommendations: BookRecommendationResult[] = getRecommendedBooks(
    books,
    preferences,
    6
  );
  const topRecommendation = recommendations[0];
  const secondaryRecommendations = recommendations.slice(1);

  const handleApplySurvey = () => {
    setHasSubmittedSurvey(true);
    setSurveyHighlightFlash(true);
    setTimeout(() => setSurveyHighlightFlash(false), 600);
    const el = document.getElementById('recommendation-results-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-16">
      {/* 1. Institutional Hero & Operational Utility Bar */}
      <section className="border-b border-[#E5E0D5] pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-num tracking-wider text-[#68625B] uppercase">
                <span>CURATED ARCHIVE 100</span>
                <span aria-hidden="true">·</span>
                <span>국내외 6대 기관 통합 선정</span>
                <span aria-hidden="true">·</span>
                <span>맞춤형 고전 큐레이션</span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#1C1917] leading-[1.18] tracking-tight text-balance">
                수백 년의 시간을 견딘 백 권의 고전 중, 지금 당신의 영혼에 응답할 한 권
              </h1>

              <p className="text-base sm:text-lg text-[#44403C] leading-relaxed max-w-2xl">
                서울대·고려대·연세대·미국 대학위원회·뉴욕타임스·랜덤하우스 6대 권장 도서 목록에서 중복 선정된 핵심 고전문학 100선을 수록했습니다. 다섯 가지 독서 취향 설문을 통해 나와 가장 깊이 공명하는 고전을 발견하고, 3단 줄거리 요약과 독서 기록장, 독서 모임까지 한곳에서 경험하세요.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#taste-survey-panel"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#9A3412] text-white text-sm font-medium rounded-sm hover:bg-[#7C2D12] transition-colors whitespace-nowrap shrink-0"
              >
                <Compass className="w-4 h-4" />
                취향 설문으로 맞춤 고전 찾기
              </a>
              <button
                type="button"
                onClick={onNavigateCatalog}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1C1917] border border-[#D6D0C4] text-sm font-medium rounded-sm hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-4 h-4" />
                고전문학 100선 전체 목록 보기
              </button>
            </div>

            {/* Operational Provenance Strip */}
            <div className="pt-4 border-t border-[#E5E0D5] flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#68625B]">
              <span className="font-semibold text-[#1C1917]">수록 기준 6대 목록:</span>
              {SIX_INSTITUTIONS.map((inst, i) => (
                <React.Fragment key={inst}>
                  <span>{inst}</span>
                  {i < SIX_INSTITUTIONS.length - 1 && (
                    <span aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between">
            <EditorialImage
              src={EDITORIAL_IMAGES.heroClassicLibrary}
              alt="햇살이 비치는 고전 서재와 만년필, 펼쳐진 고전문학 원서"
              caption="Fig. 1 — 아카이브 100선: 3회 이상 중복 추천 도서 42권 및 2회 이상 중복 추천 도서 58권 통합 컬렉션"
              aspectClass="aspect-[16/10]"
              className="h-full"
            />
          </div>
        </div>
      </section>

      {/* 2. Interactive 5-Step Literary Taste Survey */}
      <section
        id="taste-survey-panel"
        aria-labelledby="survey-section-title"
        className="bg-white border border-[#DED8CE] p-6 sm:p-10 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E0D5] pb-6">
          <div className="space-y-2">
            <div className="text-xs font-mono-num tracking-wider text-[#9A3412] uppercase font-semibold">
              01. LITERARY TASTE DIAGNOSTIC
            </div>
            <h2
              id="survey-section-title"
              className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1917]"
            >
              나의 고전문학 취향 설문 (5문항)
            </h2>
            <p className="text-sm text-[#57534E]">
              현재 마음이 끌리는 주제와 분위기, 독서 호흡을 선택하시면 고전문학 100선 중 최적의 도서를 추천해 드립니다.
            </p>
          </div>

          {/* Quick Persona Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#68625B] mr-1">빠른 취향 프리셋:</span>
            {PERSONA_PRESETS.map((preset) => {
              const isSelected =
                preferences.theme === preset.prefs.theme &&
                preferences.mood === preset.prefs.mood &&
                preferences.region === preset.prefs.region;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    onUpdatePreferences(preset.prefs);
                    setHasSubmittedSurvey(true);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-[#FBF9F5] text-[#44403C] border-[#D6D0C4] hover:border-[#1C1917]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 1: Theme */}
        <div className="space-y-3">
          <label className="block font-editorial text-base font-bold text-[#1C1917]">
            문항 1. 지금 가장 깊이 탐구하고 싶은 삶의 주제는 무엇인가요?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {THEME_OPTIONS.map((opt) => {
              const active = preferences.theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onUpdatePreferences({ ...preferences, theme: opt.value })
                  }
                  className={`text-left p-4 border rounded-sm transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F6F1EB] border-[#9A3412] text-[#1C1917]'
                      : 'bg-[#FBF9F5] border-[#E5E0D5] text-[#44403C] hover:border-[#A8A29E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#1C1917]">
                      {opt.value}
                    </span>
                    {active && <Check className="w-4 h-4 text-[#9A3412]" />}
                  </div>
                  <p className="mt-1 text-xs text-[#68625B] leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2: Mood */}
        <div className="space-y-3">
          <label className="block font-editorial text-base font-bold text-[#1C1917]">
            문항 2. 어떤 서사 분위기와 문체의 작품을 선호하시나요?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {MOOD_OPTIONS.map((opt) => {
              const active = preferences.mood === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onUpdatePreferences({ ...preferences, mood: opt.value })
                  }
                  className={`text-left p-3.5 border rounded-sm transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F6F1EB] border-[#9A3412] text-[#1C1917]'
                      : 'bg-[#FBF9F5] border-[#E5E0D5] text-[#44403C] hover:border-[#A8A29E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#1C1917]">
                      {opt.value}
                    </span>
                    {active && <Check className="w-4 h-4 text-[#9A3412]" />}
                  </div>
                  <p className="mt-1 text-xs text-[#68625B] leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 3, 4, 5 in a balanced 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Question 3: Region */}
          <div className="space-y-3">
            <label className="block font-editorial text-base font-bold text-[#1C1917]">
              문항 3. 관심 있는 시대 및 문화권은?
            </label>
            <div className="flex flex-wrap gap-2">
              {REGION_OPTIONS.map((region) => {
                const active = preferences.region === region;
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() =>
                      onUpdatePreferences({ ...preferences, region })
                    }
                    className={`px-3.5 py-2 text-xs font-medium border rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#9A3412] text-white border-[#9A3412]'
                        : 'bg-[#FBF9F5] text-[#44403C] border-[#E5E0D5] hover:border-[#A8A29E]'
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 4: Difficulty */}
          <div className="space-y-3">
            <label className="block font-editorial text-base font-bold text-[#1C1917]">
              문항 4. 선호하는 독서 호흡과 분량은?
            </label>
            <div className="space-y-2">
              {DIFFICULTY_OPTIONS.map((opt) => {
                const active = preferences.difficulty === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onUpdatePreferences({
                        ...preferences,
                        difficulty: opt.value,
                      })
                    }
                    className={`w-full text-left px-3.5 py-2.5 border rounded-sm transition-colors cursor-pointer flex items-center justify-between ${
                      active
                        ? 'bg-[#F6F1EB] border-[#9A3412] text-[#1C1917]'
                        : 'bg-[#FBF9F5] border-[#E5E0D5] text-[#44403C] hover:border-[#A8A29E]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-[#1C1917]">
                        {opt.value}
                      </span>
                      <span className="ml-2 text-xs text-[#68625B]">
                        {opt.desc}
                      </span>
                    </div>
                    {active && <Check className="w-4 h-4 text-[#9A3412] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 5: Purpose */}
          <div className="space-y-3">
            <label className="block font-editorial text-base font-bold text-[#1C1917]">
              문항 5. 이번 독서를 통해 얻고 싶은 가치는?
            </label>
            <div className="space-y-2">
              {PURPOSE_OPTIONS.map((opt) => {
                const active = preferences.purpose === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onUpdatePreferences({
                        ...preferences,
                        purpose: opt.value,
                      })
                    }
                    className={`w-full text-left px-3.5 py-2.5 border rounded-sm transition-colors cursor-pointer flex items-center justify-between ${
                      active
                        ? 'bg-[#F6F1EB] border-[#9A3412] text-[#1C1917]'
                        : 'bg-[#FBF9F5] border-[#E5E0D5] text-[#44403C] hover:border-[#A8A29E]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-[#1C1917]">
                        {opt.value}
                      </span>
                      <span className="ml-2 text-xs text-[#68625B]">
                        {opt.desc}
                      </span>
                    </div>
                    {active && <Check className="w-4 h-4 text-[#9A3412] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit & Live Match Summary Bar */}
        <div className="pt-5 border-t border-[#E5E0D5] flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#FBF9F5] p-4 border border-[#E5E0D5]">
          <div className="space-y-1">
            <div className="text-xs text-[#57534E]">
              현재 선택 취향:{' '}
              <strong className="text-[#1C1917]">{preferences.theme}</strong> ·{' '}
              <strong className="text-[#1C1917]">{preferences.mood}</strong> ·{' '}
              <strong className="text-[#1C1917]">{preferences.region}</strong> ·{' '}
              <strong className="text-[#1C1917]">{preferences.difficulty}</strong> ·{' '}
              <strong className="text-[#1C1917]">{preferences.purpose}</strong>
            </div>
            {topRecommendation && (
              <div className="text-xs text-[#9A3412] font-medium">
                실시간 1위 매칭 고전:{' '}
                <strong className="font-editorial text-sm text-[#1C1917]">
                  『{topRecommendation.book.title}』
                </strong>{' '}
                ({topRecommendation.book.author}) — 일치도{' '}
                <span className="font-mono-num font-bold">
                  {topRecommendation.matchPercentage}%
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onUpdatePreferences(PERSONA_PRESETS[0].prefs)
              }
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] bg-white border border-[#D6D0C4] rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              기본값 초기화
            </button>
            {topRecommendation && (
              <button
                type="button"
                onClick={() => onSelectBook(topRecommendation.book)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#1C1917] bg-white border border-[#1C1917] rounded-sm hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                1위 도서 줄거리 바로 보기
              </button>
            )}
            <button
              type="button"
              onClick={handleApplySurvey}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#9A3412] text-white text-sm font-medium rounded-sm hover:bg-[#7C2D12] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              나와 맞는 고전문학 추천받기
            </button>
          </div>
        </div>
      </section>

      {/* 3. Curated Recommendation Results (3-Tier Editorial Salience) */}
      {hasSubmittedSurvey && topRecommendation && (
        <section
          id="recommendation-results-section"
          aria-labelledby="results-heading"
          className={`space-y-10 transition-opacity duration-200 ${
            surveyHighlightFlash ? 'opacity-90' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E0D5] pb-4">
            <div>
              <div className="text-xs font-mono-num tracking-wider text-[#9A3412] uppercase font-semibold">
                02. PERSONALIZED CURATION RESULTS
              </div>
              <h2
                id="results-heading"
                className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1"
              >
                당신의 취향에 응답하는 맞춤 고전문학 Top 6
              </h2>
            </div>
            <p className="text-xs text-[#68625B]">
              도서 카드를 클릭하면 기·승·전·결 3단 줄거리 요약과 명문장 해제를 확인할 수 있습니다.
            </p>
          </div>

          {/* Tier 1: #1 Best Match Lead Spotlight */}
          <article className="bg-white border border-[#DED8CE] p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4">
                <BookCoverArt
                  book={topRecommendation.book}
                  size="lg"
                  className="w-full"
                />
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#68625B]">
                  <span className="font-mono-num font-bold text-[#9A3412]">
                    최적 매칭 1위 · 취향 일치도 {topRecommendation.matchPercentage}%
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    고전 100선 NO.{String(topRecommendation.book.id).padStart(3, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{topRecommendation.book.region}</span>
                  <span aria-hidden="true">·</span>
                  <span>{topRecommendation.book.genre}</span>
                </div>

                <div>
                  <h3 className="font-editorial text-2xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
                    {topRecommendation.book.title}
                  </h3>
                  <p className="mt-1.5 text-base text-[#57534E]">
                    {topRecommendation.book.author} · {topRecommendation.book.era}
                  </p>
                </div>

                <div className="p-4 bg-[#F6F3EC] border border-[#E5E0D5] space-y-2">
                  <div className="text-xs font-semibold text-[#9A3412]">
                    큐레이터 추천 이유
                  </div>
                  <p className="text-sm text-[#292524] leading-relaxed">
                    {topRecommendation.recommendationReason}
                  </p>
                </div>

                {/* Plot Summary Preview */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                    줄거리 요약 미리보기
                  </div>
                  <p className="text-sm text-[#44403C] leading-relaxed">
                    <strong className="text-[#1C1917]">[도입]</strong>{' '}
                    {topRecommendation.book.summary.beginning}{' '}
                    <strong className="text-[#1C1917]">[전개]</strong>{' '}
                    {topRecommendation.book.summary.development}
                  </p>
                </div>

                <blockquote className="py-3 border-y border-[#E5E0D5] font-editorial italic text-sm text-[#292524]">
                  “{topRecommendation.book.summary.famousQuote}”
                </blockquote>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectBook(topRecommendation.book)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white text-sm font-medium rounded-sm hover:bg-[#292524] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    전체 줄거리 요약 및 해설 보기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onWriteJournal(topRecommendation.book)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1C1917] border border-[#D6D0C4] text-sm font-medium rounded-sm hover:bg-[#F2EFE9] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <BookMarked className="w-4 h-4 text-[#9A3412]" />
                    내 독서 기록장에 추가
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Tier 2: #2 ~ #6 Recommended Classics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryRecommendations.map((item, idx) => (
              <article
                key={item.book.id}
                className="bg-white border border-[#E5E0D5] p-6 flex flex-col justify-between hover:border-[#A8A29E] transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <BookCoverArt
                      book={item.book}
                      size="sm"
                      className="w-20 h-28 shrink-0"
                    />
                    <div className="space-y-1.5 min-w-0">
                      <div className="text-xs font-mono-num text-[#9A3412] font-semibold">
                        추천 {idx + 2}위 · 일치도 {item.matchPercentage}%
                      </div>
                      <h4 className="font-editorial text-lg font-bold text-[#1C1917] leading-snug">
                        {item.book.title}
                      </h4>
                      <p className="text-xs text-[#57534E]">
                        {item.book.author} · NO.{String(item.book.id).padStart(3, '0')}
                      </p>
                      <div className="text-xs text-[#68625B]">
                        {item.book.themes[0]} · {item.book.mood}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#44403C] leading-relaxed line-clamp-3">
                    {item.book.summary.hook} {item.book.summary.beginning}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E0D5] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectBook(item.book)}
                    className="text-xs font-semibold text-[#1C1917] hover:text-[#9A3412] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    줄거리 요약 보기 →
                  </button>
                  <button
                    type="button"
                    onClick={() => onWriteJournal(item.book)}
                    className="text-xs text-[#68625B] hover:text-[#1C1917] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    + 서재 기록
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
