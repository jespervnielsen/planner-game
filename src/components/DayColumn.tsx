import React, { useRef, useState, useEffect } from 'react';
import { DayName, Card, ScoreStep } from '../game/types';
import { CardView } from './CardView';

interface DayColumnProps {
  day: DayName;
  cards: Card[];
  isTarget?: boolean;
  canPlace?: boolean;
  isInPlacingPhase?: boolean;
  onClick?: () => void;
  scoreSteps?: (ScoreStep | null)[];
  activeSteps?: boolean[];
  slotNumbers?: number[];
}

const DAY_LABELS: Record<DayName, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat',
};

export const DayColumn: React.FC<DayColumnProps> = ({ day, cards, isTarget, canPlace, isInPlacingPhase, onClick, scoreSteps, activeSteps, slotNumbers }) => {
  // Track which card index was just placed so it gets the landing animation.
  // prevLengthRef is only accessed inside effects (not during render) — OK.
  const prevLengthRef = useRef(cards.length);
  const [justPlacedIdx, setJustPlacedIdx] = useState(-1);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    const prevLength = prevLengthRef.current;
    prevLengthRef.current = cards.length;

    if (cards.length > prevLength) {
      const idx = cards.length - 1;
      // Deferred to avoid synchronous setState-in-effect lint rule
      const t1 = setTimeout(() => { setJustPlacedIdx(idx); setIsAccepting(true); }, 0);
      const t2 = setTimeout(() => { setJustPlacedIdx(-1); setIsAccepting(false); }, 350);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [cards.length]);

  const isFull = cards.length >= 3;

  const handleClick = () => {
    if (isFull && isInPlacingPhase) {
      setIsRejecting(true);
      setTimeout(() => setIsRejecting(false), 300);
      return;
    }
    if (canPlace) onClick?.();
  };

  return (
    <div
      className={[
        'day-column',
        isTarget ? 'target' : '',
        canPlace ? 'can-place' : '',
        isFull ? 'day-column--full' : '',
        isRejecting ? 'day-column--rejecting' : '',
        isAccepting ? 'day-column--accepting' : '',
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
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
