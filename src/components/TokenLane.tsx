import { TokenState, TokenType } from '../game/types';

export const TOKEN_CONFIG: Record<TokenType, { color: string; icon: string; label: string }> = {
  work: { color: '#3B82F6', icon: '💼', label: 'Work' },
  fitness: { color: '#22C55E', icon: '🏃', label: 'Fitness' },
  social: { color: '#A855F7', icon: '👥', label: 'Social' },
  rest: { color: '#F59E0B', icon: '😴', label: 'Rest' },
};

const TRACK_MAX = 8;

interface TokenLaneProps {
  tokens: TokenState;
  /** For each token type: the bonus threshold count to display on the track. */
  thresholds?: Partial<Record<TokenType, number>>;
}

export const TokenLane: React.FC<TokenLaneProps> = ({ tokens, thresholds }) => {
  return (
    <div className="token-lane">
      {(Object.keys(TOKEN_CONFIG) as TokenType[]).map((type) => {
        const cfg = TOKEN_CONFIG[type];
        const count = tokens[type];
        const threshold = thresholds?.[type];
        return (
          <div key={type} className="token-row">
            <span className="token-icon">{cfg.icon}</span>
            <span className="token-label" style={{ color: cfg.color }}>{cfg.label}</span>
            <div className="token-track">
              {Array.from({ length: TRACK_MAX }).map((_, i) => {
                const cellNum = i + 1; // 1-indexed
                const filled = count >= cellNum;
                const isThreshold = threshold !== undefined && cellNum === threshold;
                const thresholdMet = isThreshold && count >= threshold;
                return (
                  <div
                    key={i}
                    className={[
                      'track-cell',
                      filled ? 'filled' : '',
                      isThreshold && !thresholdMet ? 'threshold-goal' : '',
                      isThreshold && thresholdMet ? 'threshold-met' : '',
                    ].filter(Boolean).join(' ')}
                    style={filled
                      ? { backgroundColor: cfg.color, borderColor: cfg.color }
                      : { borderColor: cfg.color + '55' }}
                  />
                );
              })}
              {count > TRACK_MAX && (
                <span className="track-overflow" style={{ color: cfg.color }}>
                  +{count - TRACK_MAX}
                </span>
              )}
            </div>
            <span className="token-count" style={{ backgroundColor: cfg.color }}>{count}</span>
          </div>
        );
      })}
    </div>
  );
};
