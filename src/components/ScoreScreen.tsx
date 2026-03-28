import { useState, useEffect } from 'react';
import { ScoreResult, WeeklyGoal } from '../game/types';
import { TOKEN_CONFIG } from './TokenLane';
import { ALL_CARDS } from '../game/cards';

interface ScoreScreenProps {
  scoreResult: ScoreResult;
  onPlayAgain: () => void;
  mode: 'daily' | 'random';
  seed: string;
  weeklyGoal: WeeklyGoal;
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

const DAY_ABBR: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat',
};

const HARMONY_LABEL: Record<string, string> = {
  mono: '🎯 Mono',
  trio: '🌈 Trio',
  mixed: '—',
  incomplete: '—',
};

export const ScoreScreen: React.FC<ScoreScreenProps> = ({ scoreResult, onPlayAgain, mode, seed, weeklyGoal }) => {
  const { totalScore, steps, dayHarmony, harmonyTotal, diversityResult, weeklyGoalAchieved, weeklyGoalBonus } = scoreResult;

  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    const duration = 800;
    const animationSteps = 30;
    const increment = totalScore / animationSteps;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setDisplayScore(Math.min(Math.round(increment * count), totalScore));
      if (count >= animationSteps) clearInterval(timer);
    }, duration / animationSteps);
    return () => clearInterval(timer);
  }, [totalScore]);

  const bonusCount = steps.filter(s => s.bonusTriggered).length;
  const bonusPoints = steps.reduce((sum, s) => {
    if (!s.bonusTriggered) return sum;
    const card = ALL_CARDS.find(c => c.id === s.cardId);
    return sum + (card?.bonus?.points ?? 0);
  }, 0);
  const baseTotal = totalScore - bonusPoints - harmonyTotal - diversityResult.diversityTotal - weeklyGoalBonus;
  const missedCount = steps.filter(s => s.bonusMissedBy !== undefined).length;

  const handleShare = () => {
    const date = mode === 'daily' ? seed : new Date().toISOString().slice(0, 10);
    const ratingEmoji = getRatingEmoji(totalScore);
    const goalStatus = weeklyGoalAchieved ? '✅' : '❌';
    const text = `📅 Perfect Week – ${date} – Score: ${totalScore} ${ratingEmoji} – Goal: ${weeklyGoal.title} ${goalStatus} – https://jespervnielsen.github.io/planner-game/`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="score-screen">
      <div className="score-header">
        <h2>Week Complete!</h2>
        <div className="score-total">{displayScore}</div>
        <div className="score-rating">{getRating(totalScore)}</div>
        <div className="score-split">
          <span className="score-split-item">Base {baseTotal}pt</span>
          <span className="score-split-sep">+</span>
          <span className="score-split-item bonus">✨ Bonus {bonusPoints}pt</span>
          {harmonyTotal > 0 && <>
            <span className="score-split-sep">+</span>
            <span className="score-split-item harmony">🎯 Harmony {harmonyTotal}pt</span>
          </>}
          {diversityResult.diversityTotal > 0 && <>
            <span className="score-split-sep">+</span>
            <span className="score-split-item diversity">🌈 Diversity {diversityResult.diversityTotal}pt</span>
          </>}
          {weeklyGoalBonus > 0 && <>
            <span className="score-split-sep">+</span>
            <span className="score-split-item goal-bonus">🎯 Goal {weeklyGoalBonus}pt</span>
          </>}
          <span className="score-split-sep">=</span>
          <span className="score-split-item total">{totalScore}pt</span>
        </div>
      </div>

      {/* Weekly Goal result */}
      <div className={`weekly-goal-result ${weeklyGoalAchieved ? 'achieved' : 'missed'}`}>
        <span className="wgr-icon">{weeklyGoalAchieved ? '✅' : '❌'}</span>
        <div className="wgr-text">
          <span className="wgr-title">{weeklyGoal.title}</span>
          <span className="wgr-desc">{weeklyGoal.description}</span>
        </div>
        <span className="wgr-pts">{weeklyGoalAchieved ? `+${weeklyGoalBonus}pt` : 'missed'}</span>
      </div>

      {/* Diversity result */}
      {diversityResult.diversityTotal > 0 && (
        <div className="diversity-result">
          <span className="div-label">🌈 Token Diversity:</span>
          <span className="div-types">
            {diversityResult.qualifyingTypes.map(t => TOKEN_CONFIG[t].icon).join(' ')} × +2
            {diversityResult.perfectBalanceBonus > 0 && <span className="div-perfect"> + Perfect Balance +6!</span>}
          </span>
          <span className="div-pts">+{diversityResult.diversityTotal}pt</span>
        </div>
      )}

      {/* Day Harmony */}
      {harmonyTotal > 0 && (
        <div className="harmony-section">
          <div className="harmony-label">🎯 Day Harmony Bonuses</div>
          <div className="harmony-days">
            {dayHarmony.filter(d => d.bonusPoints > 0).map(d => (
              <div key={d.dayName} className={`harmony-day harmony-day--${d.harmonyType}`}>
                <span className="hd-day">{DAY_ABBR[d.dayName]}</span>
                <span className="hd-type">{HARMONY_LABEL[d.harmonyType]}</span>
                <span className="hd-pts">+{d.bonusPoints}pt</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="score-tokens">
        {(Object.keys(TOKEN_CONFIG) as (keyof typeof TOKEN_CONFIG)[]).map(type => (
          <div key={type} className="score-token-item">
            <span>{TOKEN_CONFIG[type].icon}</span>
            <span style={{ color: TOKEN_CONFIG[type].color }}>{diversityResult.finalTokens[type] ?? 0}</span>
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
              <div key={i} className={`breakdown-item${step.bonusTriggered ? ' has-bonus' : ''}`} data-category={card.category}>
                <span className="bi-day">{DAY_ABBR[step.dayName] ?? step.dayName}</span>
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
        <button className="btn-primary" onClick={onPlayAgain}>
          {mode === 'daily' ? 'Play Random Game' : 'Play Again (New Game)'}
        </button>
        <button className="btn-share" onClick={handleShare}>
          📋 Copy Result
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
