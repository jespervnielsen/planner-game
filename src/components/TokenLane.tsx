import { TokenState, TokenType } from '../game/types';

export const TOKEN_CONFIG: Record<TokenType, { color: string; icon: string; label: string }> = {
  work: { color: '#3B82F6', icon: '💼', label: 'Work' },
  fitness: { color: '#22C55E', icon: '🏃', label: 'Fitness' },
  social: { color: '#A855F7', icon: '👥', label: 'Social' },
  rest: { color: '#F59E0B', icon: '😴', label: 'Rest' },
};

interface TokenLaneProps {
  tokens: TokenState;
}

export const TokenLane: React.FC<TokenLaneProps> = ({ tokens }) => {
  return (
    <div className="token-lane">
      {(Object.keys(TOKEN_CONFIG) as TokenType[]).map((type) => {
        const cfg = TOKEN_CONFIG[type];
        return (
          <div key={type} className="token-pill" style={{ borderColor: cfg.color }}>
            <span className="token-icon">{cfg.icon}</span>
            <span className="token-label" style={{ color: cfg.color }}>{cfg.label}</span>
            <span className="token-count" style={{ backgroundColor: cfg.color }}>{tokens[type]}</span>
          </div>
        );
      })}
    </div>
  );
};
