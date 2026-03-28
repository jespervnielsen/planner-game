import { Board as BoardType, DayName, ScoreStep, ScoreResult } from '../game/types';
import { DayColumn } from './DayColumn';
import { ALL_CARDS } from '../game/cards';

const DAYS: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

interface BoardProps {
  board: BoardType;
  canPlace?: boolean;
  onPlaceCard?: (day: DayName) => void;
  scoreResult?: ScoreResult | null;
  scoreAnimStep?: number;
}

export const Board: React.FC<BoardProps> = ({ board, canPlace, onPlaceCard, scoreResult, scoreAnimStep }) => {
  const scoringOrder: { day: DayName; cardIdx: number }[] = [];
  for (const day of DAYS) {
    for (let i = 0; i < board[day].length; i++) {
      scoringOrder.push({ day, cardIdx: i });
    }
  }

  // Build a map from (day, cardIdx) to 1-based resolution number
  const resolutionMap: Partial<Record<DayName, number[]>> = {};
  scoringOrder.forEach(({ day, cardIdx }, flatIdx) => {
    (resolutionMap[day] ??= [])[cardIdx] = flatIdx + 1;
  });

  const getScoreStepsForDay = (day: DayName): (ScoreStep | null)[] => {
    if (!scoreResult) return board[day].map(() => null);
    return board[day].map((_, cardIdx) => {
      const flatIdx = scoringOrder.findIndex(s => s.day === day && s.cardIdx === cardIdx);
      if (scoreAnimStep !== undefined && flatIdx <= scoreAnimStep && flatIdx >= 0) {
        return scoreResult.steps[flatIdx];
      }
      return null;
    });
  };

  const getActiveStepsForDay = (day: DayName): boolean[] => {
    return board[day].map((_, cardIdx) => {
      const flatIdx = scoringOrder.findIndex(s => s.day === day && s.cardIdx === cardIdx);
      return scoreAnimStep !== undefined && flatIdx === scoreAnimStep;
    });
  };

  return (
    <div className="board">
      {DAYS.map(day => (
        <DayColumn
          key={day}
          day={day}
          cards={board[day].map(id => ALL_CARDS.find(c => c.id === id)!)}
          canPlace={canPlace && board[day].length < 3}
          onClick={() => onPlaceCard?.(day)}
          scoreSteps={getScoreStepsForDay(day)}
          activeSteps={getActiveStepsForDay(day)}
          slotNumbers={resolutionMap[day] ?? []}
        />
      ))}
    </div>
  );
};
