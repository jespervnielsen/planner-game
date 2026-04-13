import { useState, useEffect, useCallback } from 'react';
import { GameState, DayName } from '../game/types';
import {
  initGame,
  selectCard as selectCardEngine,
  placeCard as placeCardEngine,
  advanceScoreAnimation,
  getTodaySeed,
} from '../game/engine';

function parseUrlParams(): { mode: 'daily' | 'random'; seed: string } {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') === 'random' ? 'random' : 'daily';
  if (mode === 'random') {
    const seed = params.get('seed') || String(Date.now());
    return { mode, seed };
  }
  return { mode: 'daily', seed: getTodaySeed() };
}

// Slower auto-advance gives players time to read each step;
// they can always click the board to advance immediately.
const SCORE_AUTO_ADVANCE_MS = 1200;

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const { mode, seed } = parseUrlParams();
    return initGame(seed, mode);
  });

  useEffect(() => {
    if (state.phase !== 'scoring') return;
    if (!state.scoreResult) return;

    const totalSteps = state.scoreResult.steps.length;
    const nextStep = state.scoreAnimStep + 1;

    if (nextStep >= totalSteps) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, phase: 'done' }));
      }, 800);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setState(prev => advanceScoreAnimation(prev));
    }, SCORE_AUTO_ADVANCE_MS);

    return () => clearTimeout(timer);
  }, [state.phase, state.scoreAnimStep, state.scoreResult]);

  const selectCard = useCallback((cardId: string) => {
    setState(prev => selectCardEngine(prev, cardId));
  }, []);

  const placeCard = useCallback((day: DayName) => {
    setState(prev => placeCardEngine(prev, day));
  }, []);

  const restartGame = useCallback(() => {
    const seed = String(Date.now() % 1000000);
    const newUrl = `${window.location.pathname}?mode=random&seed=${seed}`;
    window.history.pushState({}, '', newUrl);
    setState(initGame(seed, 'random'));
  }, []);

  const skipScoring = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'scoring' || !prev.scoreResult) return prev;
      return {
        ...prev,
        phase: 'done',
        scoreAnimStep: prev.scoreResult.steps.length - 1,
      };
    });
  }, []);

  // Click-to-advance: immediately step forward one card during scoring
  const advanceScoreStep = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'scoring' || !prev.scoreResult) return prev;
      return advanceScoreAnimation(prev);
    });
  }, []);

  return { state, selectCard, placeCard, restartGame, skipScoring, advanceScoreStep };
}
