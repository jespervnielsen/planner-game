import { Card, TokenType } from '../game/types';
import { TOKEN_CONFIG } from './TokenLane';

interface CardViewProps {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  scoreStep?: { cardScore: number; bonusTriggered: boolean } | null;
  slotNumber?: number | null;
  isNew?: boolean;
  isActiveStep?: boolean;
}

/** Accent colour keyed by card id prefix, mirroring the token colour palette. */
const CATEGORY_COLORS: Record<string, string> = {
  'work-': '#3B82F6',  // blue  – matches --work token colour
  'fit-':  '#22C55E',  // green – matches --fitness token colour
  'soc-':  '#A855F7',  // purple – matches --social token colour
  'rest-': '#F59E0B',  // amber – matches --rest token colour
  'bal-':  '#06B6D4',  // cyan  – balanced / neutral
};
const DEFAULT_CATEGORY_COLOR = '#94A3B8'; // slate fallback

function getCategoryColor(cardId: string): string {
  for (const prefix of Object.keys(CATEGORY_COLORS)) {
    if (cardId.startsWith(prefix)) return CATEGORY_COLORS[prefix];
  }
  return DEFAULT_CATEGORY_COLOR;
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

function getOrdinalSuffix(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

export const CardView: React.FC<CardViewProps> = ({ card, selected, onClick, compact, scoreStep, slotNumber, isNew, isActiveStep }) => {
  const gainGroups = groupTokens(card.tokens);
  const costGroups = card.costs ? groupTokens(card.costs) : [];
  const categoryColor = getCategoryColor(card.id);

  return (
    <div
      className={`card-view${selected ? ' selected' : ''}${onClick ? ' clickable' : ''}${compact ? ' compact' : ''}${isNew ? ' just-placed' : ''}`}
      onClick={onClick}
      style={{ '--card-accent': categoryColor } as React.CSSProperties}
    >
      {/* Coloured top accent stripe */}
      <div className="card-accent-bar" />

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
        <span className="card-base-points">{card.basePoints}<span className="card-base-points-unit">pt</span></span>
      </div>

      {card.bonus && (
        <div className="card-bonus-row">
          <span className="card-bonus-need">
            {card.bonus.required.count}{TOKEN_CONFIG[card.bonus.required.type].icon} before
          </span>
          <span className="card-bonus-arrow">→</span>
          <span className="card-bonus-reward">✨+{card.bonus.points}</span>
        </div>
      )}

      {scoreStep && (
        <div className={`card-score-overlay${scoreStep.bonusTriggered ? ' bonus' : ''}${isActiveStep ? ' active-step' : ''}`}>
          +{scoreStep.cardScore}
          {scoreStep.bonusTriggered && <span className="bonus-tag">✨</span>}
        </div>
      )}
      {slotNumber != null && (
        <span
          className="slot-number"
          title={`Resolves ${slotNumber}${getOrdinalSuffix(slotNumber)}`}
        >#{slotNumber}</span>
      )}
    </div>
  );
};
