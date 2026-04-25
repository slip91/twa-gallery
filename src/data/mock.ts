import { CardItem, BannerSlide, Category } from '../types/gallery';

export const BANNER_SLIDES: BannerSlide[] = [
  { id: '1', title: 'Генерируйте и оживляйте фото, создавайте видео', subtitle: 'Мы рады тому, что вы пользуетесь нашим сервисом', poster: './images/gallery1.jpg' },
  { id: '2', title: 'Генерируйте и оживляйте фото, создавайте видео', subtitle: 'Мы рады тому, что вы пользуетесь нашим сервисом', poster: './images/gallery2.jpg' },
  { id: '3', title: 'Генерируйте и оживляйте фото, создавайте видео', subtitle: 'Мы рады тому, что вы пользуетесь нашим сервисом', poster: './images/gallery3.jpg' },
  { id: '4', title: 'Генерируйте и оживляйте фото, создавайте видео', subtitle: 'Мы рады тому, что вы пользуетесь нашим сервисом', poster: './images/gallery4.jpg' },
];

export const CATEGORIES: Category[] = ['Оживление', 'Фото', 'Видео'];

const VIDEO_URLS = ['./videos/0416.mp4', './videos/0416(1).mp4', './videos/img_9630.mp4', './videos/img_9662.mp4'];
const POSTERS = ['./images/6.jpg', './images/7.jpg', './images/9.jpg', './images/12.jpg'];

const baseCards: CardItem[] = [
  { id: '1', title: 'Cyberpunk city', description: 'Неоновый город в стиле киберпанк', poster: './images/1.jpg', category: 'Оживление', isHot: true },
  { id: '2', title: 'Портрет в стиле', description: 'Фотореалистичный портрет', poster: './images/2.jpg', category: 'Фото' },
  { id: '3', title: '3D персонаж', description: 'Мультяшный персонаж', poster: './images/3.jpg', category: 'Оживление', tall: true },
  { id: '4', title: 'Логотип AI', description: 'Стильный логотип', poster: './images/4.jpg', category: 'Фото' },
  { id: '5', title: 'Anime girl', description: 'Аниме девочка', poster: './images/5.jpg', category: 'Фото', isHot: true },
];

const videoUrls = ['./hls/0416.m3u8', './hls/0416(1).m3u8', './hls/img_9630.m3u8', './hls/img_9662.m3u8'];
const posters = ['./images/6.jpg', './images/7.jpg', './images/9.jpg', './images/12.jpg'];
const titles = ['Space background', 'Robot character', 'Fantasy landscape', 'Abstract art'];
const descriptions = ['Космический фон', 'Робот персонаж', 'Фэнтези пейзаж', 'Абстрактное искусство'];

const testVideoCards: CardItem[] = [];
for (let i = 0; i < 100; i++) {
  const idx = i % 4;
  testVideoCards.push({
    id: `video_${i}`,
    title: `${titles[idx]} ${i + 1}`,
    description: `${descriptions[idx]} TEST`,
    poster: posters[idx],
    category: 'Видео',
    videoUrl: videoUrls[idx],
    type: 'video',
  });
}

export const MOCK_CARDS: CardItem[] = [...baseCards, ...testVideoCards];