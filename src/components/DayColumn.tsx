import { DayName, Card, ScoreStep } from '../game/types';
import { CardView } from './CardView';

interface DayColumnProps {
  day: DayName;
  cards: Card[];
  isTarget?: boolean;
  canPlace?: boolean;
  onClick?: () => void;
  scoreSteps?: (ScoreStep | null)[];
  slotNumbers?: number[];
}

const DAY_LABELS: Record<DayName, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat',
};

export const DayColumn: React.FC<DayColumnProps> = ({ day, cards, isTarget, canPlace, onClick, scoreSteps, slotNumbers }) => {
  return (
    <div
      className={`day-column${isTarget ? ' target' : ''}${canPlace ? ' can-place' : ''}`}
      onClick={canPlace ? onClick : undefined}
    >
      <div className="day-header">{DAY_LABELS[day]}</div>
      <div className="day-cards">
        {cards.map((card, i) => (
          <CardView
            key={card.id}
            card={card}
            compact
            scoreStep={scoreSteps ? scoreSteps[i] : null}
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
