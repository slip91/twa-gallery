export type Category = 'Оживление' | 'Фото' | 'Видео';

export interface CardItem {
  id: string;
  title: string;
  description: string;
  poster: string;
  category: Category;
  isHot?: boolean;
  videoUrl?: string;
  type?: 'photo' | 'video';
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle?: string;
  poster: string;
}