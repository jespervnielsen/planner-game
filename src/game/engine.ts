import { GameState, DayName, Board, Card, TokenState, ScoreResult, ScoreStep, DayHarmonyResult, HarmonyType, CardCategory, DiversityResult } from './types';
import { ALL_CARDS } from './cards';
import { createRng, rngShuffle } from './rng';
import { WEEKLY_GOALS, FullWeeklyGoal } from './goals';

export const DAYS: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const TOTAL_CARDS = 12;

function emptyBoard(): Board {
  return {
    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [],
  };
}

export function getTodaySeed(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function initGame(seed: string, mode: 'daily' | 'random'): GameState {
  const rng = createRng(seed);
  const shuffled = rngShuffle(rng, ALL_CARDS.map(c => c.id));

  const goalIndex = Math.floor(rng() * WEEKLY_GOALS.length);
  const weeklyGoal = WEEKLY_GOALS[goalIndex];

  const card1 = shuffled[0];
  const card2 = shuffled[1];

  return {
    phase: 'picking',
    board: emptyBoard(),
    hand: [card1, card2],
    selectedCard: null,
    cardsPlaced: 0,
    rngState: 0,
    scoreResult: null,
    scoreAnimStep: -1,
    seed,
    mode,
    shuffledDeck: shuffled,
    nextCardIndex: 2,
    weeklyGoal: { id: weeklyGoal.id, title: weeklyGoal.title, description: weeklyGoal.description, bonusPoints: weeklyGoal.bonusPoints },
  };
}

export function selectCard(state: GameState, cardId: string): GameState {
  // Allow deselecting the currently selected card
  if (state.phase === 'placing' && state.selectedCard === cardId) {
    return { ...state, phase: 'picking', selectedCard: null };
  }

  if (state.phase !== 'picking') return state;
  if (!state.hand || !state.hand.includes(cardId)) return state;

  return { ...state, phase: 'placing', selectedCard: cardId };
}

export function placeCard(state: GameState, day: DayName): GameState {
  if (state.phase !== 'placing' || !state.selectedCard) return state;
  if (state.board[day].length >= 3) return state;

  const newBoard: Board = {
    ...state.board,
    [day]: [...state.board[day], state.selectedCard],
  };

  const newCardsPlaced = state.cardsPlaced + 1;

  if (newCardsPlaced >= TOTAL_CARDS) {
    const goalFn = WEEKLY_GOALS.find(g => g.id === state.weeklyGoal.id) as FullWeeklyGoal | undefined;
    const scoreResult = calculateScore(newBoard, ALL_CARDS, goalFn);
    return {
      ...state,
      board: newBoard,
      cardsPlaced: newCardsPlaced,
      selectedCard: null,
      hand: null,
      phase: 'scoring',
      scoreResult,
      scoreAnimStep: -1,
    };
  }

  const idx = state.nextCardIndex;
  const card1 = state.shuffledDeck[idx % state.shuffledDeck.length];
  const card2 = state.shuffledDeck[(idx + 1) % state.shuffledDeck.length];

  return {
    ...state,
    board: newBoard,
    cardsPlaced: newCardsPlaced,
    selectedCard: null,
    hand: [card1, card2],
    phase: 'picking',
    nextCardIndex: idx + 2,
  };
}

function computeDayHarmony(board: Board, allCards: Card[]): DayHarmonyResult[] {
  return DAYS.map(day => {
    const cards = board[day].map(id => allCards.find(c => c.id === id)!).filter(Boolean);
    const categories = cards.map(c => c.category) as CardCategory[];
    const unique = new Set(categories).size;

    let harmonyType: HarmonyType = 'mixed';
    let bonusPoints = 0;

    if (categories.length < 3) {
      harmonyType = 'incomplete';
    } else if (unique === 1) {
      harmonyType = 'mono';
      bonusPoints = 5;
    } else if (unique === categories.length) {
      harmonyType = 'trio';
      bonusPoints = 3;
    }

    return { dayName: day, harmonyType, bonusPoints, categories };
  });
}

function computeDiversity(tokens: TokenState): DiversityResult {
  const DIVERSITY_THRESHOLD = 3;
  const PER_TYPE_BONUS = 2;
  const PERFECT_BALANCE_BONUS = 6;

  const qualifyingTypes = (Object.keys(tokens) as (keyof TokenState)[])
    .filter(t => tokens[t] >= DIVERSITY_THRESHOLD);

  const perTypeBonusPoints = qualifyingTypes.length * PER_TYPE_BONUS;
  const perfectBalanceBonus = qualifyingTypes.length === 4 ? PERFECT_BALANCE_BONUS : 0;
  const diversityTotal = perTypeBonusPoints + perfectBalanceBonus;

  return {
    finalTokens: { ...tokens },
    qualifyingTypes,
    perTypeBonusPoints,
    perfectBalanceBonus,
    diversityTotal,
  };
}

export function calculateScore(board: Board, allCards: Card[], weeklyGoalFn?: FullWeeklyGoal): ScoreResult {
  const tokens: TokenState = { work: 0, fitness: 0, social: 0, rest: 0 };
  let totalScore = 0;
  const steps: ScoreStep[] = [];

  for (const day of DAYS) {
    for (const cardId of board[day]) {
      const card = allCards.find(c => c.id === cardId)!;
      let cardScore = 0;
      let bonusTriggered = false;
      const tokensBefore: TokenState = { ...tokens };
      let bonusMissedBy: number | undefined;

      if (card.bonus) {
        const { type, count } = card.bonus.required;
        if (tokens[type] >= count) {
          cardScore += card.bonus.points;
          bonusTriggered = true;
        } else {
          bonusMissedBy = count - tokens[type];
        }
      }

      cardScore += card.basePoints;

      for (const token of card.tokens) {
        tokens[token]++;
      }

      if (card.costs) {
        for (const cost of card.costs) {
          tokens[cost] = Math.max(0, tokens[cost] - 1);
        }
      }

      totalScore += cardScore;
      steps.push({ cardId, cardScore, bonusTriggered, tokensAfter: { ...tokens }, tokensBefore, bonusMissedBy, dayName: day });
    }
  }

  // Day Harmony bonuses
  const dayHarmony = computeDayHarmony(board, allCards);
  const harmonyTotal = dayHarmony.reduce((s, d) => s + d.bonusPoints, 0);
  totalScore += harmonyTotal;

  // Token Diversity bonus
  const diversityResult = computeDiversity(tokens);
  totalScore += diversityResult.diversityTotal;

  // Build a partial result for the weekly goal check
  const partialResult: ScoreResult = {
    totalScore,
    steps,
    dayHarmony,
    harmonyTotal,
    diversityResult,
    weeklyGoalAchieved: false,
    weeklyGoalBonus: 0,
  };

  // Weekly Goal check
  let weeklyGoalAchieved = false;
  let weeklyGoalBonus = 0;
  if (weeklyGoalFn) {
    weeklyGoalAchieved = weeklyGoalFn.check(board, allCards, partialResult);
    weeklyGoalBonus = weeklyGoalAchieved ? weeklyGoalFn.bonusPoints : 0;
    totalScore += weeklyGoalBonus;
  }

  return {
    totalScore,
    steps,
    dayHarmony,
    harmonyTotal,
    diversityResult,
    weeklyGoalAchieved,
    weeklyGoalBonus,
  };
}

/** Compute the net token state from all cards currently on the board. */
export function computeBoardTokens(board: Board, allCards: Card[]): TokenState {
  const tokens: TokenState = { work: 0, fitness: 0, social: 0, rest: 0 };
  for (const day of DAYS) {
    for (const cardId of board[day]) {
      const card = allCards.find(c => c.id === cardId);
      if (!card) continue;
      for (const token of card.tokens) {
        tokens[token]++;
      }
      if (card.costs) {
        for (const cost of card.costs) {
          tokens[cost] = Math.max(0, tokens[cost] - 1);
        }
      }
    }
  }
  return tokens;
}

export function advanceScoreAnimation(state: GameState): GameState {
  if (state.phase !== 'scoring' || !state.scoreResult) return state;

  const nextStep = state.scoreAnimStep + 1;

  if (nextStep >= state.scoreResult.steps.length) {
    return { ...state, phase: 'done', scoreAnimStep: state.scoreResult.steps.length - 1 };
  }

  return { ...state, scoreAnimStep: nextStep };
}
