import { useGameState } from './hooks/useGameState';
import { TokenLane } from './components/TokenLane';
import { Board } from './components/Board';
import { CardPicker } from './components/CardPicker';
import { ScoreScreen } from './components/ScoreScreen';
import { ALL_CARDS } from './game/cards';
import { computeBoardTokens, DAYS } from './game/engine';
import { TokenState, TokenType, Card, DayName, Board as BoardType } from './game/types';
import './App.css';

const EMPTY_TOKENS: TokenState = { work: 0, fitness: 0, social: 0, rest: 0 };

/**
 * Compute the tokens accumulated from all cards that resolve BEFORE
 * a card placed at `(day, board[day].length)` in the current board.
 */
function computeTokensAtSlot(board: BoardType, day: DayName, allCards: Card[]): TokenState {
  const tokens: TokenState = { work: 0, fitness: 0, social: 0, rest: 0 };
  const newSlot = board[day].length;
  const dayIndex = DAYS.indexOf(day);
  for (const d of DAYS) {
    const dIndex = DAYS.indexOf(d);
    const cardIds = board[d];
    for (let i = 0; i < cardIds.length; i++) {
      if (dIndex < dayIndex || (d === day && i < newSlot)) {
        const card = allCards.find(c => c.id === cardIds[i]);
        if (!card) continue;
        for (const token of card.tokens) tokens[token]++;
        if (card.costs) {
          for (const cost of card.costs) tokens[cost] = Math.max(0, tokens[cost] - 1);
        }
      }
    }
  }
  return tokens;
}

function getBonusFeasibilityByDay(
  selectedCardId: string | null,
  board: BoardType,
  allCards: Card[],
): Partial<Record<DayName, 'will-trigger' | 'wont-trigger'>> {
  if (!selectedCardId) return {};
  const card = allCards.find(c => c.id === selectedCardId);
  if (!card?.bonus) return {};

  const result: Partial<Record<DayName, 'will-trigger' | 'wont-trigger'>> = {};
  for (const day of DAYS) {
    if (board[day].length >= 3) continue;
    const tokens = computeTokensAtSlot(board, day, allCards);
    const { type, count } = card.bonus.required;
    result[day] = tokens[type] >= count ? 'will-trigger' : 'wont-trigger';
  }
  return result;
}

function getThresholds(
  phase: string,
  selectedCard: string | null,
  hand: [string, string] | null,
): Partial<Record<TokenType, number>> {
  const relevantIds: string[] = [];
  if (phase === 'placing' && selectedCard) {
    relevantIds.push(selectedCard);
  } else if (phase === 'picking' && hand) {
    relevantIds.push(...hand);
  }

  const result: Partial<Record<TokenType, number>> = {};
  for (const id of relevantIds) {
    const card = ALL_CARDS.find((c: Card) => c.id === id);
    if (card?.bonus) {
      const { type, count } = card.bonus.required;
      const existing = result[type];
      if (existing === undefined || count < existing) {
        result[type] = count;
      }
    }
  }
  return result;
}

function App() {
  const { state, selectCard, placeCard, restartGame, skipScoring } = useGameState();

  const currentTokens: TokenState = (() => {
    if (state.phase === 'scoring' && state.scoreResult) {
      const step = state.scoreAnimStep;
      if (step >= 0 && step < state.scoreResult.steps.length) {
        return state.scoreResult.steps[step].tokensAfter;
      }
      return EMPTY_TOKENS;
    }
    if (state.phase === 'done' && state.scoreResult) {
      const steps = state.scoreResult.steps;
      return steps.length > 0 ? steps[steps.length - 1].tokensAfter : EMPTY_TOKENS;
    }
    return computeBoardTokens(state.board, ALL_CARDS);
  })();

  const thresholds = getThresholds(state.phase, state.selectedCard, state.hand);

  const bonusFeasibilityByDay =
    state.phase === 'placing'
      ? getBonusFeasibilityByDay(state.selectedCard, state.board, ALL_CARDS)
      : {};

  const handCards: [Card, Card] | null =
    state.hand
      ? [
          ALL_CARDS.find((c: Card) => c.id === state.hand![0])!,
          ALL_CARDS.find((c: Card) => c.id === state.hand![1])!,
        ]
      : null;

  const progress = `${state.cardsPlaced} / 12 cards placed`;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">📅 Perfect Week</h1>
        <div className="app-meta">
          <span className="app-mode">{state.mode === 'daily' ? '📆 Daily' : '🎲 Random'}</span>
          {state.phase !== 'done' && state.phase !== 'scoring' && (
            <span className="app-progress">{progress}</span>
          )}
        </div>
      </header>

      <TokenLane tokens={currentTokens} thresholds={thresholds} />

      <details className="how-to-play">
        <summary>📖 How to Play</summary>
        <div className="how-to-play-body">
          <ul>
            <li>Pick 1 of 2 cards each turn — the other is <strong>discarded</strong>.</li>
            <li>Place it in any day (Mon → Sat). Each day holds up to 3 cards.</li>
            <li>Cards resolve <strong>Mon → Sat</strong>, top slot first. Earlier = resolves sooner.</li>
            <li>Bonus fires if you've already earned enough tokens from <strong>cards that resolved before it</strong>.</li>
            <li>Goal: chain your cards so bonuses trigger for maximum points!</li>
          </ul>
        </div>
      </details>

      {state.phase === 'scoring' && (
        <div className="scoring-bar">
          <span className="scoring-banner">⏳ Calculating score…</span>
          <button className="btn-skip" onClick={skipScoring}>Skip »</button>
        </div>
      )}

      <main className="app-main">
        <Board
          board={state.board}
          canPlace={state.phase === 'placing'}
          onPlaceCard={placeCard}
          scoreResult={state.scoreResult}
          scoreAnimStep={state.scoreAnimStep}
          bonusFeasibilityByDay={bonusFeasibilityByDay}
        />
      </main>

      {(state.phase === 'picking' || state.phase === 'placing') && handCards && (
        <footer className="app-footer">
          <CardPicker
            cards={handCards}
            selectedId={state.selectedCard}
            onSelect={selectCard}
          />
        </footer>
      )}

      {state.phase === 'done' && state.scoreResult && (
        <div className="score-overlay">
          <ScoreScreen
            scoreResult={state.scoreResult}
            onPlayAgain={restartGame}
            mode={state.mode}
            seed={state.seed}
          />
        </div>
      )}
    </div>
  );
}

export default App;
