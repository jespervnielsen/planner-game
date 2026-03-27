import { Card, TokenType } from '../game/types';
import { TOKEN_CONFIG } from './TokenLane';

interface CardViewProps {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  scoreStep?: { cardScore: number; bonusTriggered: boolean } | null;
}

/** Group an array of TokenType into { type → count } in order of first appearance */
function groupTokens(tokens: TokenType[]): { type: TokenType; count: number }[] {
  const order: TokenType[] = [];
  const counts: Partial<Record<TokenType, number>> = {};
  for (const t of tokens) {
    if (!counts[t]) { counts[t] = 0; order.push(t); }
    counts[t]! += 1;
  }
  return order.map(t => ({ type: t, count: counts[t]! }));
}

export const CardView: React.FC<CardViewProps> = ({ card, selected, onClick, compact, scoreStep }) => {
  const gainGroups = groupTokens(card.tokens);
  const costGroups = card.costs ? groupTokens(card.costs) : [];

  return (
    <div
      className={`card-view${selected ? ' selected' : ''}${onClick ? ' clickable' : ''}${compact ? ' compact' : ''}`}
      onClick={onClick}
    >
      <div className="card-title">{card.title}</div>

      <div className="card-tokens">
        {gainGroups.map(({ type, count }) => (
          <span key={type} className="card-token-badge gain" style={{ backgroundColor: TOKEN_CONFIG[type].color }}>
            +{count}{TOKEN_CONFIG[type].icon}
          </span>
        ))}
        {costGroups.map(({ type, count }) => (
          <span key={`cost-${type}`} className="card-token-badge cost" style={{ borderColor: TOKEN_CONFIG[type].color, color: TOKEN_CONFIG[type].color }}>
            −{count}{TOKEN_CONFIG[type].icon}
          </span>
        ))}
      </div>

      <div className="card-points-row">
        <span className="card-base-points">{card.basePoints}pt</span>
      </div>

      {card.bonus && (
        <div className="card-bonus-row">
          <span className="card-bonus-need">
            {TOKEN_CONFIG[card.bonus.required.type].icon}×{card.bonus.required.count}
          </span>
          <span className="card-bonus-arrow">→</span>
          <span className="card-bonus-reward">✨+{card.bonus.points}</span>
        </div>
      )}

      {scoreStep && (
        <div className={`card-score-overlay${scoreStep.bonusTriggered ? ' bonus' : ''}`}>
          +{scoreStep.cardScore}
          {scoreStep.bonusTriggered && <span className="bonus-tag">✨</span>}
        </div>
      )}
    </div>
  );
};
