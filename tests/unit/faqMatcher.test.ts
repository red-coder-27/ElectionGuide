import {
  findBestMatch,
  findMatches,
  getFAQByCategory,
  getFAQCategories,
  ELECTION_FAQ,
} from '../src/utils/faqMatcher';

describe('FAQ Matcher', () => {
  describe('findBestMatch', () => {
    it('should find best match for voter registration question', () => {
      const result = findBestMatch('How do I register to vote?');
      expect(result).not.toBeNull();
      expect(result?.category).toBe('registration');
    });

    it('should find match for polling location question', () => {
      const result = findBestMatch('Where can I vote?');
      expect(result).not.toBeNull();
      expect(result?.category).toBe('voting');
    });

    it('should find match for eligibility question', () => {
      const result = findBestMatch('Am I eligible to vote?');
      expect(result).not.toBeNull();
      expect(result?.category).toBe('eligibility');
    });

    it('should handle case insensitivity', () => {
      const result1 = findBestMatch('HOW DO I REGISTER?');
      const result2 = findBestMatch('how do i register?');
      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
    });

    it('should return null for very unclear question', () => {
      const result = findBestMatch('xyz abc def qwerty');
      expect(result).toBeNull();
    });

    it('should handle empty input', () => {
      const result = findBestMatch('');
      expect(result).toBeNull();
    });

    it('should find match for majority/plurality question', () => {
      const result = findBestMatch('What is majority vs plurality?');
      expect(result).not.toBeNull();
      expect(result?.category).toBe('results');
    });

    it('should find match for accessibility question', () => {
      const result = findBestMatch('What if I have a disability?');
      expect(result).not.toBeNull();
      expect(result?.category).toBe('accessibility');
    });

    it('should find match for early voting', () => {
      const result = findBestMatch('Can I vote early?');
      expect(result).not.toBeNull();
      expect(result?.answer).toContain('early');
    });

    it('should find match for ID requirements', () => {
      const result = findBestMatch('What ID do I need?');
      expect(result).not.toBeNull();
      expect(result?.answer).toContain('ID');
    });
  });

  describe('findMatches', () => {
    it('should return multiple matches', () => {
      const results = findMatches('registration', 5);
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('should return empty array for no matches', () => {
      const results = findMatches('xyz abc qwerty zzzzzz', 5);
      expect(results.length).toBe(0);
    });

    it('should respect limit parameter', () => {
      const results2 = findMatches('vote', 2);
      const results5 = findMatches('vote', 5);
      expect(results2.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getFAQByCategory', () => {
    it('should return FAQs for registration category', () => {
      const results = getFAQByCategory('registration');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((faq) => {
        expect(faq.category).toBe('registration');
      });
    });

    it('should return FAQs for voting category', () => {
      const results = getFAQByCategory('voting');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((faq) => {
        expect(faq.category).toBe('voting');
      });
    });

    it('should return FAQs for results category', () => {
      const results = getFAQByCategory('results');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return FAQs for accessibility category', () => {
      const results = getFAQByCategory('accessibility');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for invalid category', () => {
      const results = getFAQByCategory('invalid_category');
      expect(results.length).toBe(0);
    });
  });

  describe('getFAQCategories', () => {
    it('should return all unique categories', () => {
      const categories = getFAQCategories();
      expect(categories.includes('registration')).toBe(true);
      expect(categories.includes('voting')).toBe(true);
      expect(categories.includes('results')).toBe(true);
      expect(categories.includes('eligibility')).toBe(true);
      expect(categories.includes('accessibility')).toBe(true);
    });

    it('should have no duplicates', () => {
      const categories = getFAQCategories();
      expect(new Set(categories).size).toBe(categories.length);
    });
  });

  describe('FAQ Database', () => {
    it('should have 20+ FAQs', () => {
      expect(ELECTION_FAQ.length).toBeGreaterThanOrEqual(20);
    });

    it('should have valid FAQ structure', () => {
      ELECTION_FAQ.forEach((faq) => {
        expect(faq.id).toBeDefined();
        expect(faq.question).toBeDefined();
        expect(faq.answer).toBeDefined();
        expect(faq.category).toBeDefined();
        expect(Array.isArray(faq.keywords)).toBe(true);
        expect(faq.keywords.length).toBeGreaterThan(0);
      });
    });

    it('should have translations for FAQs', () => {
      const faqWithTranslations = ELECTION_FAQ.find(
        (faq) => Object.keys(faq.translations).length > 0
      );
      expect(faqWithTranslations).toBeDefined();
    });
  });
});
