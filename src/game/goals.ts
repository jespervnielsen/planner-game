import { WeeklyGoal, Board, Card, ScoreResult, DayName, TokenType } from './types';

export type GoalCheckFn = (
  board: Board,
  allCards: Card[],
  scoreResult: ScoreResult,
) => boolean;

export type FullWeeklyGoal = WeeklyGoal & { check: GoalCheckFn };

const DAYS: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const WEEKLY_GOALS: FullWeeklyGoal[] = [
  {
    id: 'goal-weekend-warrior',
    title: 'Weekend Warrior',
    description: 'Place at least 2 Fitness cards on Friday or Saturday',
    bonusPoints: 10,
    check: (board, allCards) => {
      const weekend = [...board.friday, ...board.saturday];
      return weekend.filter(id =>
        allCards.find(c => c.id === id)?.category === 'fitness',
      ).length >= 2;
    },
  },
  {
    id: 'goal-balanced-week',
    title: 'Balanced Week',
    description: 'End the week with at least 3 of every token type',
    bonusPoints: 12,
    check: (_board, _allCards, scoreResult) =>
      scoreResult.diversityResult.qualifyingTypes.length === 4,
  },
  {
    id: 'goal-iron-discipline',
    title: 'Iron Discipline',
    description: 'Place no cards with costs',
    bonusPoints: 14,
    check: (board, allCards) =>
      Object.values(board)
        .flat()
        .every(id => !(allCards.find(c => c.id === id)?.costs?.length)),
  },
  {
    id: 'goal-social-butterfly',
    title: 'Social Butterfly',
    description: 'Place at least 4 Social or Balanced cards',
    bonusPoints: 10,
    check: (board, allCards) =>
      Object.values(board)
        .flat()
        .filter(id =>
          ['social', 'balanced'].includes(
            allCards.find(c => c.id === id)?.category ?? '',
          ),
        ).length >= 4,
  },
  {
    id: 'goal-harmony-seeker',
    title: 'Harmony Seeker',
    description: 'Achieve Mono or Trio harmony on at least 3 days',
    bonusPoints: 11,
    check: (_board, _allCards, scoreResult) =>
      scoreResult.dayHarmony.filter(
        d => d.harmonyType === 'mono' || d.harmonyType === 'trio',
      ).length >= 3,
  },
  {
    id: 'goal-deep-focus',
    title: 'Deep Focus',
    description: 'Accumulate 8 or more Work tokens by end of week',
    bonusPoints: 10,
    check: (_board, _allCards, scoreResult) =>
      (scoreResult.diversityResult.finalTokens as Record<TokenType, number>).work >= 8,
  },
  {
    id: 'goal-recovery-week',
    title: 'Recovery Week',
    description: 'Place at least one Rest card on every day',
    bonusPoints: 13,
    check: (board, allCards) =>
      DAYS.every(day =>
        board[day].some(id => allCards.find(c => c.id === id)?.category === 'rest'),
      ),
  },
  {
    id: 'goal-fast-start',
    title: 'Fast Start',
    description: 'Score at least 12 points from Monday and Tuesday alone',
    bonusPoints: 10,
    check: (_board, _allCards, scoreResult) =>
      scoreResult.steps
        .filter(s => s.dayName === 'monday' || s.dayName === 'tuesday')
        .reduce((sum, s) => sum + s.cardScore, 0) >= 12,
  },
];
