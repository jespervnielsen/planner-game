import { ScoreResult } from '../game/types';
import { TOKEN_CONFIG } from './TokenLane';
import { ALL_CARDS } from '../game/cards';

interface ScoreScreenProps {
  scoreResult: ScoreResult;
  onPlayAgain: () => void;
  mode: 'daily' | 'random';
  seed: string;
}

function getRating(score: number): string {
  if (score >= 60) return '🏆 Perfect!';
  if (score >= 45) return '⭐⭐⭐ Excellent!';
  if (score >= 30) return '⭐⭐ Good!';
  if (score >= 15) return '⭐ Keep trying!';
  return '📝 Needs work';
}

export const ScoreScreen: React.FC<ScoreScreenProps> = ({ scoreResult, onPlayAgain, mode, seed }) => {
  const { totalScore, steps } = scoreResult;
  const finalTokens = steps.length > 0
    ? { ...steps[steps.length - 1].tokensAfter }
    : { work: 0, fitness: 0, social: 0, rest: 0 };

  return (
    <div className="score-screen">
      <div className="score-header">
        <h2>Week Complete!</h2>
        <div className="score-total">{totalScore}</div>
        <div className="score-rating">{getRating(totalScore)}</div>
      </div>

      <div className="score-tokens">
        {(Object.keys(TOKEN_CONFIG) as (keyof typeof TOKEN_CONFIG)[]).map(type => (
          <div key={type} className="score-token-item">
            <span>{TOKEN_CONFIG[type].icon}</span>
            <span style={{ color: TOKEN_CONFIG[type].color }}>{finalTokens[type] ?? 0}</span>
          </div>
        ))}
      </div>

      <div className="score-breakdown">
        <h3>Score Breakdown</h3>
        <div className="breakdown-list">
          {steps.map((step, i) => {
            const card = ALL_CARDS.find(c => c.id === step.cardId)!;
            return (
              <div key={i} className={`breakdown-item${step.bonusTriggered ? ' has-bonus' : ''}`}>
                <span className="bi-title">{card.title}</span>
                <span className="bi-score">
                  {step.bonusTriggered && <span className="bi-bonus">✨ bonus! </span>}
                  +{step.cardScore}
                </span>
              </div>
            );
          })}
        </div>
        <div className="breakdown-total">Total: {totalScore}</div>
      </div>

      <div className="score-actions">
        <button className="btn-primary" onClick={onPlayAgain}>
          Play Again (New Game)
        </button>
        {mode === 'daily' && (
          <p className="score-daily-note">Come back tomorrow for a new daily puzzle!</p>
        )}
        {mode === 'random' && (
          <p className="score-daily-note">Seed: {seed}</p>
        )}
      </div>
    </div>
  );
};
