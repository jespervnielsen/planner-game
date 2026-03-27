export type TokenType = 'work' | 'fitness' | 'social' | 'rest';

export type Card = {
  id: string;
  title: string;
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
};

export type ScoreResult = {
  totalScore: number;
  steps: ScoreStep[];
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
};
