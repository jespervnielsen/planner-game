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
  if (score >= 70) return '🏆 Perfect!';
  if (score >= 55) return '⭐⭐⭐ Excellent!';
  if (score >= 40) return '⭐⭐ Good!';
  if (score >= 25) return '⭐ Keep trying!';
  return '📝 Needs work';
}

function getRatingEmoji(score: number): string {
  if (score >= 70) return '🏆';
  if (score >= 55) return '⭐⭐⭐';
  if (score >= 40) return '⭐⭐';
  if (score >= 25) return '⭐';
  return '📝';
}

export const ScoreScreen: React.FC<ScoreScreenProps> = ({ scoreResult, onPlayAgain, mode, seed }) => {
  const { totalScore, steps } = scoreResult;
  const finalTokens = steps.length > 0
    ? { ...steps[steps.length - 1].tokensAfter }
    : { work: 0, fitness: 0, social: 0, rest: 0 };

  const bonusCount = steps.filter(s => s.bonusTriggered).length;
  const bonusPoints = steps.reduce((sum, s) => {
    if (!s.bonusTriggered) return sum;
    const card = ALL_CARDS.find(c => c.id === s.cardId);
    return sum + (card?.bonus?.points ?? 0);
  }, 0);
  const baseTotal = totalScore - bonusPoints;
  const missedCount = steps.filter(s => s.bonusMissedBy !== undefined).length;

  const handleShare = () => {
    const date = mode === 'daily' ? seed : new Date().toISOString().slice(0, 10);
    const ratingEmoji = getRatingEmoji(totalScore);
    const text = `📅 Perfect Week – ${date} – Score: ${totalScore} ${ratingEmoji} – https://jespervnielsen.github.io/planner-game/`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="score-screen">
      <div className="score-header">
        <h2>Week Complete!</h2>
        <div className="score-total">{totalScore}</div>
        <div className="score-rating">{getRating(totalScore)}</div>
        <div className="score-split">Base: {baseTotal} + Bonus: {bonusPoints} = {totalScore}</div>
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
        <div className="score-summary-stats">
          <span>✨ {bonusCount} bonus{bonusCount !== 1 ? 'es' : ''} triggered (+{bonusPoints}pt)</span>
          {missedCount > 0 && <span className="missed-stat">💔 {missedCount} missed</span>}
        </div>
        <h3>Score Breakdown</h3>
        <div className="breakdown-list">
          {steps.map((step, i) => {
            const card = ALL_CARDS.find(c => c.id === step.cardId)!;
            return (
              <div key={i} className={`breakdown-item${step.bonusTriggered ? ' has-bonus' : ''}`}>
                <span className="bi-title">{card.title}</span>
                <span className="bi-score">
                  {step.bonusTriggered && <span className="bi-bonus">✨ bonus! </span>}
                  {step.bonusMissedBy !== undefined && (
                    <span className="bi-missed">missed ✨ ({step.bonusMissedBy} short)</span>
                  )}
                  +{step.cardScore}
                </span>
              </div>
            );
          })}
        </div>
        <div className="breakdown-total">Total: {totalScore}</div>
      </div>

      <div className="score-actions">
        <button className="btn-share" onClick={handleShare}>
          📋 Copy Result
        </button>
        <button className="btn-primary" onClick={onPlayAgain}>
          {mode === 'daily' ? 'Play Random Game' : 'Play Again (New Game)'}
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
