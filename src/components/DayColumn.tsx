import React, { useRef } from 'react';
import { DayName, Card, ScoreStep } from '../game/types';
import { CardView } from './CardView';

interface DayColumnProps {
  day: DayName;
  cards: Card[];
  isTarget?: boolean;
  canPlace?: boolean;
  onClick?: () => void;
  scoreSteps?: (ScoreStep | null)[];
  activeSteps?: boolean[];
  slotNumbers?: number[];
}

const DAY_LABELS: Record<DayName, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat',
};

export const DayColumn: React.FC<DayColumnProps> = ({ day, cards, isTarget, canPlace, onClick, scoreSteps, activeSteps, slotNumbers }) => {
  const prevLengthRef = useRef(cards.length);
  const justPlacedIdx = cards.length > prevLengthRef.current ? cards.length - 1 : -1;
  prevLengthRef.current = cards.length;

  const isFull = cards.length >= 3;

  return (
    <div
      className={`day-column${isTarget ? ' target' : ''}${canPlace ? ' can-place' : ''}${isFull ? ' day-column--full' : ''}`}
      onClick={canPlace ? onClick : undefined}
    >
      <div className="day-header">{DAY_LABELS[day]}</div>
      <div className="day-cards">
        {cards.map((card, i) => (
          <CardView
            key={card.id}
            card={card}
            compact
            isNew={i === justPlacedIdx}
            scoreStep={scoreSteps ? scoreSteps[i] : null}
            isActiveStep={activeSteps ? activeSteps[i] : false}
            slotNumber={slotNumbers ? slotNumbers[i] : null}
          />
        ))}
        {Array.from({ length: 3 - cards.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className={`card-slot-empty${canPlace && i === 0 ? ' next-slot' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};
