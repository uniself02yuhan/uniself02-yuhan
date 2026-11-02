import test from 'node:test';
import assert from 'node:assert/strict';
import { CLASSICS_100, INITIAL_JOURNAL_ENTRIES } from '../data/classics100';
import {
  calculateBookMatch,
  computeJournalStats,
  filterClassicsCatalog,
  getFirstChosungGroup,
  getRecommendedBooks,
  SurveyPreferences,
  validateBookClubForm,
  validateJournalForm,
} from './recommendation';

test('CLASSICS_100 contains all 100 classic literature books in exact order from monzaq.tistory.com/429', () => {
  assert.equal(CLASSICS_100.length, 100);
  assert.equal(CLASSICS_100[0].id, 1);
  assert.equal(CLASSICS_100[0].title, '1984');
  assert.equal(CLASSICS_100[0].author, '조지 오웰');

  assert.equal(CLASSICS_100[1].id, 2);
  assert.equal(CLASSICS_100[1].title, '걸리버 여행기');

  assert.equal(CLASSICS_100[63].id, 64);
  assert.equal(CLASSICS_100[63].title, '이방인');

  assert.equal(CLASSICS_100[97].id, 98);
  assert.equal(CLASSICS_100[97].title, '홍길동전');

  assert.equal(CLASSICS_100[99].id, 100);
  assert.equal(CLASSICS_100[99].title, '황무지');

  // Verify every book has complete 3-act plot summary, significance, and famous quote
  for (const book of CLASSICS_100) {
    assert.ok(book.summary.hook.length > 10, `Book ${book.id} missing hook`);
    assert.ok(book.summary.beginning.length > 10, `Book ${book.id} missing beginning`);
    assert.ok(book.summary.development.length > 10, `Book ${book.id} missing development`);
    assert.ok(book.summary.resolution.length > 10, `Book ${book.id} missing resolution`);
    assert.ok(book.summary.significance.length > 10, `Book ${book.id} missing significance`);
    assert.ok(book.summary.famousQuote.length > 5, `Book ${book.id} missing famousQuote`);
  }
});

test('getRecommendedBooks ranks matching classics accurately based on survey preferences', () => {
  const prefs: SurveyPreferences = {
    theme: '실존과 고독',
    mood: '지적·성찰적',
    region: '유럽 대륙',
    difficulty: '입문 추천',
    purpose: '삶의 방향과 위로',
  };

  const results = getRecommendedBooks(CLASSICS_100, prefs, 5);
  assert.equal(results.length, 5);
  // Top match should have high matchPercentage (>= 90%) and include 이방인 or 고도를 기다리며
  assert.ok(results[0].matchPercentage >= 90);
  const topTitles = results.map((r) => r.book.title);
  assert.ok(
    topTitles.includes('이방인') || topTitles.includes('고도를 기다리며'),
    `Expected 이방인 or 고도를 기다리며 in top matches, got: ${topTitles.join(', ')}`
  );

  // Check calculateBookMatch reason generation
  const stranger = CLASSICS_100.find((b) => b.id === 64)!;
  const match = calculateBookMatch(stranger, prefs);
  assert.equal(match.matchPercentage, 99);
  assert.ok(match.recommendationReason.includes('실존과 고독'));
});

test('filterClassicsCatalog supports search query, Korean chosung, theme, region, and difficulty', () => {
  assert.equal(getFirstChosungGroup('1984'), '숫자');
  assert.equal(getFirstChosungGroup('걸리버 여행기'), 'ㄱ');
  assert.equal(getFirstChosungGroup('홍루몽'), 'ㅎ');

  const koreanBooks = filterClassicsCatalog(CLASSICS_100, { region: '한국' });
  assert.ok(koreanBooks.length >= 6);
  assert.ok(koreanBooks.some((b) => b.title === '구운몽'));
  assert.ok(koreanBooks.some((b) => b.title === '토지'));

  const chosungH = filterClassicsCatalog(CLASSICS_100, { chosung: 'ㅎ' });
  const hTitles = chosungH.map((b) => b.title);
  assert.deepEqual(hTitles, [
    '햄릿',
    '허클베리 핀의 모험',
    '호밀밭의 파수꾼',
    '홍길동전',
    '홍루몽',
    '황무지',
  ]);

  const searchKafka = filterClassicsCatalog(CLASSICS_100, { searchQuery: '카프카' });
  assert.equal(searchKafka.length, 2); // 변신, 심판
});

test('computeJournalStats and form validators work deterministically', () => {
  const stats = computeJournalStats(INITIAL_JOURNAL_ENTRIES, CLASSICS_100);
  assert.equal(stats.totalCount, 4);
  assert.equal(stats.completedCount, 2);
  assert.equal(stats.readingCount, 1);
  assert.equal(stats.wishlistCount, 1);
  assert.equal(stats.sharedCount, 2);
  assert.ok(stats.totalPagesRead > 500);

  assert.equal(validateJournalForm({ bookId: 0, reviewText: '좋은 책입니다.' }).valid, false);
  assert.equal(validateJournalForm({ bookId: 1, reviewText: '짧음' }).valid, false);
  assert.equal(
    validateJournalForm({ bookId: 1, reviewText: '깊이 있는 통찰을 주는 고전입니다.' }).valid,
    true
  );

  assert.equal(
    validateBookClubForm({
      name: '독서모임',
      bookId: 15,
      schedule: '매주 토요일',
      description: '함께 돈키호테를 완독하는 모임입니다.',
    }).valid,
    true
  );
});
