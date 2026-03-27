import { Card } from '../game/types';
import { CardView } from './CardView';

interface CardPickerProps {
  cards: [Card, Card];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const CardPicker: React.FC<CardPickerProps> = ({ cards, selectedId, onSelect }) => {
  return (
    <div className="card-picker">
      <p className="picker-label">Choose 1 card — the other is discarded:</p>
      <div className="picker-cards">
        {cards.map(card => (
          <CardView
            key={card.id}
            card={card}
            selected={card.id === selectedId}
            discarded={selectedId !== null && card.id !== selectedId}
            onClick={() => onSelect(card.id)}
          />
        ))}
      </div>
      {selectedId && (
        <p className="picker-hint">Now click a day column to place the card ↑</p>
      )}
    </div>
  );
};
