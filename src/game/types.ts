export type TokenType = 'work' | 'fitness' | 'social' | 'rest';

export type CardCategory = 'work' | 'fitness' | 'social' | 'rest' | 'balanced';

export type Card = {
  id: string;
  title: string;
  category: CardCategory;
  basePoints: number;
  tokens: TokenType[];
  costs?: TokenType[];
  bonus?: {
    required: {
      type: TokenType;
      count: number;
    };
    points: number;
  };
};

export type TokenState = Record<TokenType, number>;

export type DayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type Board = Record<DayName, string[]>;

export type ScoreStep = {
  cardId: string;
  cardScore: number;
  bonusTriggered: boolean;
  tokensAfter: TokenState;
  tokensBefore: TokenState;
  bonusMissedBy?: number;
  dayName: string;
};

export type HarmonyType = 'mono' | 'trio' | 'mixed' | 'incomplete';

export type DayHarmonyResult = {
  dayName: DayName;
  harmonyType: HarmonyType;
  bonusPoints: number;
  categories: CardCategory[];
};

export type DiversityResult = {
  finalTokens: TokenState;
  qualifyingTypes: TokenType[];
  perTypeBonusPoints: number;
  perfectBalanceBonus: number;
  diversityTotal: number;
};

export type WeeklyGoal = {
  id: string;
  title: string;
  description: string;
  bonusPoints: number;
};

export type ScoreResult = {
  totalScore: number;
  steps: ScoreStep[];
  dayHarmony: DayHarmonyResult[];
  harmonyTotal: number;
  diversityResult: DiversityResult;
  weeklyGoalAchieved: boolean;
  weeklyGoalBonus: number;
};

export type GamePhase = 'picking' | 'placing' | 'scoring' | 'done';

export type GameState = {
  phase: GamePhase;
  board: Board;
  hand: [string, string] | null;
  selectedCard: string | null;
  cardsPlaced: number;
  rngState: number;
  scoreResult: ScoreResult | null;
  scoreAnimStep: number;
  seed: string;
  mode: 'daily' | 'random';
  shuffledDeck: string[];
  nextCardIndex: number;
  weeklyGoal: WeeklyGoal;
};
