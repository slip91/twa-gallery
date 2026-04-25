import { describe, it, expect } from 'vitest';
import { MOCK_CARDS, BANNER_SLIDES, CATEGORIES } from '../data/mock';

describe('Mock Data', () => {
  it('has required categories', () => {
    expect(CATEGORIES).toContain('Все');
    expect(CATEGORIES).toContain('Видео');
    expect(CATEGORIES).toContain('Фото');
    expect(CATEGORIES).toContain('Оживление');
  });

  it('cards have required fields', () => {
    MOCK_CARDS.forEach(card => {
      expect(card.id).toBeDefined();
      expect(card.title).toBeDefined();
      expect(card.poster).toBeDefined();
      expect(card.category).toBeDefined();
    });
  });

  it('video cards have videoUrl', () => {
    const videoCards = MOCK_CARDS.filter(c => c.type === 'video');
    expect(videoCards.length).toBeGreaterThan(0);
    
    videoCards.forEach(card => {
      expect(card.videoUrl).toBeDefined();
      expect(card.videoUrl).not.toBe('');
    });
  });

  it('banner slides have images', () => {
    BANNER_SLIDES.forEach(slide => {
      expect(slide.poster).toMatch(/^\/images\//);
    });
  });
});
