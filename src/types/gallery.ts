export interface CardItem {
  id: string;
  title: string;
  description: string;
  poster: string;
  category: Category;
  isHot?: boolean;
  videoUrl?: string;
  subCategory?: string;
  tall?: boolean;
  type?: 'photo' | 'video';
}

export type Category = 'Оживление' | 'Фото' | 'Видео';

export type BannerSlide = {
  id: string;
  title: string;
  subtitle?: string;
  poster: string;
};

export const CATEGORIES: Category[] = ['Оживление', 'Фото', 'Видео'];