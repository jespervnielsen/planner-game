import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { TokenLane } from './components/TokenLane';
import { Board } from './components/Board';
import { CardPicker } from './components/CardPicker';
import { ScoreScreen } from './components/ScoreScreen';
import { ALL_CARDS } from './game/cards';
import { computeBoardTokens } from './game/engine';
import { TokenState, TokenType, Card } from './game/types';
import './App.css';

const EMPTY_TOKENS: TokenState = { work: 0, fitness: 0, social: 0, rest: 0 };

function getThresholds(
  phase: string,
  selectedCard: string | null,
): Partial<Record<TokenType, number>> {
  // Only show thresholds for the selected card (placing phase).
  // Showing thresholds for both cards in hand is misleading — the discarded
  // card's threshold would show even after it's gone.
  if (phase !== 'placing' || !selectedCard) return {};

  const result: Partial<Record<TokenType, number>> = {};
  const card = ALL_CARDS.find((c: Card) => c.id === selectedCard);
  if (card?.bonus) {
    const { type, count } = card.bonus.required;
    result[type] = count;
  }
  return result;
}

function App() {
  const { state, selectCard, placeCard, restartGame, skipScoring, advanceScoreStep } = useGameState();
  const [showHelp, setShowHelp] = useState(false);

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

  const thresholds = getThresholds(state.phase, state.selectedCard);

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
          <button
            className="help-btn"
            onClick={() => setShowHelp(h => !h)}
            aria-label="How to play"
            aria-expanded={showHelp}
          >?</button>
        </div>
      </header>

      {showHelp && (
        <div className="help-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-panel" onClick={e => e.stopPropagation()}>
            <button className="help-close" onClick={() => setShowHelp(false)}>✕</button>
            <h3>📖 How to Play</h3>
            <ul>
              <li>Pick 1 of 2 cards each turn — the other is <strong>discarded</strong>.</li>
              <li>Place it in any day (Mon → Sat). Each day holds up to 3 cards.</li>
              <li>Cards resolve <strong>Mon → Sat</strong>, top slot first. Earlier = resolves sooner.</li>
              <li>Bonus fires if you've already earned enough tokens from <strong>cards that resolved before it</strong>.</li>
              <li>Fill 3 cards of the same or all-different categories on a day to earn <strong>Day Harmony</strong> bonus points.</li>
              <li>End the week with 3+ tokens of each type to earn a <strong>Diversity Bonus</strong>.</li>
              <li>Complete your <strong>Weekly Goal</strong> for a big bonus!</li>
              <li>Goal: chain your cards so bonuses trigger for maximum points!</li>
            </ul>
          </div>
        </div>
      )}

      {/* Weekly Goal banner */}
      {state.phase !== 'done' && (
        <div className="weekly-goal-bar">
          <span className="weekly-goal-label">🎯 Goal:</span>
          <span className="weekly-goal-title">{state.weeklyGoal.title}</span>
          <span className="weekly-goal-desc">{state.weeklyGoal.description}</span>
          <span className="weekly-goal-reward">+{state.weeklyGoal.bonusPoints}pt</span>
        </div>
      )}

      <TokenLane tokens={currentTokens} thresholds={thresholds} />

      {state.phase === 'scoring' && (
        <div className="scoring-bar">
          <span className="scoring-banner">⏳ Calculating score… <span className="scoring-hint">click board to advance</span></span>
          <button className="btn-skip" onClick={skipScoring}>Skip »</button>
        </div>
      )}

      <main
        className={`app-main${state.phase === 'scoring' ? ' scoring-clickable' : ''}`}
        onClick={state.phase === 'scoring' ? advanceScoreStep : undefined}
      >
        <Board
          board={state.board}
          canPlace={state.phase === 'placing'}
          onPlaceCard={placeCard}
          scoreResult={state.scoreResult}
          scoreAnimStep={state.scoreAnimStep}
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
            weeklyGoal={state.weeklyGoal}
          />
        </div>
      )}
    </div>
  );
}

export default App;
