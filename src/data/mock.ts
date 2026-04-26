import { CardItem, BannerSlide, Category } from '../types/gallery';

export const BANNER_SLIDES: BannerSlide[] = [
  { id: '1', title: 'Генерируйте и оживляйте фото, создавайте видео', subtitle: 'Мы рады тому, что вы пользуетесь нашим сервисом', poster: './images/gallery1.jpg' },
  { id: '2', title: 'Генерируйте и оживляйте фото, создавайте видео', subtitle: 'Мы рады тому, что вы пользуетесь нашим сервисом', poster: './images/gallery2.jpg' },
  { id: '3', title: 'Генерируйте и оживляйте фото, создавайте видео', subtitle: 'Мы рады тому, что вы пользуетесь нашим сервисом', poster: './images/gallery3.jpg' },
  { id: '4', title: 'Генерируйте и оживляйте фото, создавайте видео', subtitle: 'Мы рады тому, что вы пользуетесь нашим сервисом', poster: './images/gallery4.jpg' },
];

export const CATEGORIES: Category[] = ['Оживление', 'Фото', 'Видео'];

const HLS = ['./hls/0416.m3u8', './hls/0416(1).m3u8', './hls/img_9630.m3u8', './hls/img_9662.m3u8'];
const IMGS = Array.from({ length: 12 }, (_, i) => `./images/${i + 1}.jpg`);

// Seeded pseudo-random for stable order between renders
function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

const rand = seededRand(42);
const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const maybe = (p: number) => rand() < p;

const ANIM_TITLES = [
  'Cyberpunk City', 'Dragon Flight', 'Neon Tokyo', 'Space Explorer', 'Forest Spirit',
  'Ocean Depths', 'Desert Storm', 'Arctic Fox', 'Jungle Hunt', 'Volcano Eruption',
  'Galaxy Swirl', 'Time Lapse', 'Smoke Dance', 'Fire Bloom', 'Water Ripple',
];
const ANIM_DESCS = [
  'Неоновый город в стиле киберпанк', 'Полёт дракона над горами', 'Токийские огни ночью',
  'Путешествие в космосе', 'Дух древнего леса', 'Подводный мир океана',
  'Буря в пустыне', 'Арктическая лиса в снегу', 'Охота в джунглях',
  'Извержение вулкана', 'Водоворот галактик', 'Таймлапс рассвета',
  'Танец дыма', 'Цветение огня', 'Рябь на воде',
];

const PHOTO_TITLES = [
  'Portrait Realism', 'AI Concept Art', 'Anime Girl', 'Sci-Fi Warrior', 'Dark Fantasy',
  'Retro Future', 'Nature Portrait', 'Urban Grunge', 'Mythical Creature', 'Neon Portrait',
  'Steampunk Hero', 'Ethereal Beauty', 'Pixel Art', 'Oil Painting', 'Watercolor Dream',
];
const PHOTO_DESCS = [
  'Фотореалистичный портрет', 'Концепт-арт с AI', 'Аниме девочка в цвете',
  'Воин будущего', 'Тёмное фэнтези', 'Ретро-футуризм', 'Портрет на природе',
  'Городской гранж', 'Мифическое существо', 'Неоновый портрет',
  'Стимпанк герой', 'Эфирная красота', 'Пиксель арт', 'Масляная живопись', 'Акварельный сон',
];

const VIDEO_TITLES = [
  'Space Background', 'Robot Character', 'Fantasy Landscape', 'Abstract Art',
  'Lava Flow', 'Lightning Storm', 'Particle Wave', 'Morphing Shapes',
  'City at Night', 'Aurora Borealis', 'Deep Sea', 'Wind in Wheat',
];
const VIDEO_DESCS = [
  'Космический фон', 'Робот персонаж', 'Фэнтези пейзаж', 'Абстрактное искусство',
  'Поток лавы', 'Гроза с молниями', 'Волна частиц', 'Морфинг фигур',
  'Ночной город', 'Северное сияние', 'Глубины океана', 'Ветер в пшенице',
];

// Build Оживление: mostly videos, some images
const animCards: CardItem[] = Array.from({ length: 18 }, (_, i) => {
  const useVideo = maybe(0.6);
  return {
    id: `anim_${i}`,
    title: ANIM_TITLES[i % ANIM_TITLES.length],
    description: ANIM_DESCS[i % ANIM_DESCS.length],
    poster: pick(IMGS),
    category: 'Оживление' as Category,
    isHot: i < 2,
    ...(useVideo ? { type: 'video' as const, videoUrl: pick(HLS) } : {}),
  };
});

// Build Фото: mostly images, some videos sprinkled in
const photoCards: CardItem[] = Array.from({ length: 16 }, (_, i) => {
  const useVideo = maybe(0.25);
  return {
    id: `photo_${i}`,
    title: PHOTO_TITLES[i % PHOTO_TITLES.length],
    description: PHOTO_DESCS[i % PHOTO_DESCS.length],
    poster: pick(IMGS),
    category: 'Фото' as Category,
    isHot: i === 2,
    ...(useVideo ? { type: 'video' as const, videoUrl: pick(HLS) } : {}),
  };
});

// Build Видео: all videos
const videoCards: CardItem[] = Array.from({ length: 40 }, (_, i) => ({
  id: `video_${i}`,
  title: `${VIDEO_TITLES[i % VIDEO_TITLES.length]}`,
  description: VIDEO_DESCS[i % VIDEO_DESCS.length],
  poster: pick(IMGS),
  category: 'Видео' as Category,
  type: 'video' as const,
  videoUrl: pick(HLS),
  isHot: i === 0,
}));

export const MOCK_CARDS: CardItem[] = [...animCards, ...photoCards, ...videoCards];
