import React from 'react';
import { createRoot } from 'react-dom/client';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { CardDetailPage } from './pages/CardDetailPage';
import type { CardItem } from './types/gallery';
import './index.css';

type Page = 'home' | 'profile' | 'card';

function App() {
  const [page, setPage] = React.useState<Page>('home');
  const [selectedCard, setSelectedCard] = React.useState<CardItem | null>(null);

  const openCard = (card: CardItem) => {
    setSelectedCard(card);
    setPage('card');
  };

  if (page === 'profile') {
    return <ProfilePage onBack={() => setPage('home')} />;
  }

  if (page === 'card' && selectedCard) {
    return <CardDetailPage card={selectedCard} onBack={() => setPage('home')} onCardClick={openCard} onProfile={() => setPage('profile')} crystals={380} />;
  }

  return <HomePage onProfile={() => setPage('profile')} onCardClick={openCard} />;
}

const rootEl = document.getElementById('root');

try {
  if (!rootEl) throw new Error('root element not found');
  const root = createRoot(rootEl);
  root.render(<App />);
} catch (e: any) {
  console.error('Fatal error:', e);
}