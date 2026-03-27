import { Card } from '../game/types';
import { TOKEN_CONFIG } from './TokenLane';

interface CardViewProps {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  scoreStep?: { cardScore: number; bonusTriggered: boolean } | null;
}

export const CardView: React.FC<CardViewProps> = ({ card, selected, onClick, compact, scoreStep }) => {
  return (
    <div
      className={`card-view${selected ? ' selected' : ''}${onClick ? ' clickable' : ''}${compact ? ' compact' : ''}`}
      onClick={onClick}
    >
      <div className="card-title">{card.title}</div>
      <div className="card-tokens">
        {card.tokens.map((t, i) => (
          <span key={i} className="card-token-badge" style={{ backgroundColor: TOKEN_CONFIG[t].color }}>
            {TOKEN_CONFIG[t].icon}
          </span>
        ))}
        {card.costs && card.costs.map((t, i) => (
          <span key={`cost-${i}`} className="card-token-badge cost" style={{ borderColor: TOKEN_CONFIG[t].color, color: TOKEN_CONFIG[t].color }}>
            −{TOKEN_CONFIG[t].icon}
          </span>
        ))}
      </div>
      <div className="card-points-row">
        <span className="card-base-points">{card.basePoints}pt</span>
        {card.bonus && (
          <span
            className="card-bonus-hint"
            title={`+${card.bonus.points} if ${card.bonus.required.count}+ ${card.bonus.required.type}`}
          >
            ✨+{card.bonus.points}
          </span>
        )}
      </div>
      {scoreStep && (
        <div className={`card-score-overlay${scoreStep.bonusTriggered ? ' bonus' : ''}`}>
          +{scoreStep.cardScore}
          {scoreStep.bonusTriggered && <span className="bonus-tag">✨</span>}
        </div>
      )}
    </div>
  );
};
