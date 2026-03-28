import { Card } from './types';

export const ALL_CARDS: Card[] = [
  // WORK cards — playing work costs rest (you can't grind without burning out)
  { id: 'work-1', title: 'Deep Work',
    category: 'work', basePoints: 5, tokens: ['work'], costs: ['rest'] },
  { id: 'work-2', title: 'Code Review',
    category: 'work', basePoints: 3, tokens: ['work', 'work'],
    bonus: { required: { type: 'work', count: 2 }, points: 3 } },
  { id: 'work-3', title: 'Strategy Meeting',
    category: 'work', basePoints: 2, tokens: ['work', 'social'],
    // Threshold raised from 2→3 so it aligns with other 3-threshold +5 cards
    bonus: { required: { type: 'social', count: 3 }, points: 5 } },
  { id: 'work-4', title: 'Side Project',
    category: 'work', basePoints: 2, tokens: ['work', 'work', 'work'], costs: ['rest'],
    bonus: { required: { type: 'work', count: 4 }, points: 6 } },
  { id: 'work-5', title: 'Crunch Mode',
    category: 'work', basePoints: 0, tokens: ['work', 'work'], costs: ['rest'],
    bonus: { required: { type: 'work', count: 5 }, points: 9 } },

  // FITNESS cards — intense training costs rest
  { id: 'fit-1', title: 'Gym Session',
    category: 'fitness', basePoints: 5, tokens: ['fitness'], costs: ['rest'] },
  { id: 'fit-2', title: 'Morning Run',
    category: 'fitness', basePoints: 3, tokens: ['fitness', 'fitness'],
    bonus: { required: { type: 'fitness', count: 2 }, points: 3 } },
  { id: 'fit-3', title: 'Yoga Class',
    category: 'fitness', basePoints: 2, tokens: ['fitness', 'rest'],
    bonus: { required: { type: 'rest', count: 3 }, points: 4 } },
  { id: 'fit-4', title: 'Cycling Trip',
    category: 'fitness', basePoints: 1, tokens: ['fitness', 'fitness', 'fitness'],
    bonus: { required: { type: 'fitness', count: 4 }, points: 6 } },
  { id: 'fit-5', title: 'Ultra Training',
    category: 'fitness', basePoints: 0, tokens: ['fitness', 'fitness'], costs: ['rest'],
    bonus: { required: { type: 'fitness', count: 5 }, points: 9 } },

  // SOCIAL cards — heavy socialising costs work time
  { id: 'soc-1', title: 'Networking Event',
    category: 'social', basePoints: 5, tokens: ['social'], costs: ['work'] },
  { id: 'soc-2', title: 'Friend Dinner',
    category: 'social', basePoints: 3, tokens: ['social', 'social'],
    bonus: { required: { type: 'social', count: 2 }, points: 3 } },
  { id: 'soc-3', title: 'Game Night',
    category: 'social', basePoints: 3, tokens: ['social', 'rest'],
    // Bonus raised from +3 → +4 to match 3-threshold tier standard
    bonus: { required: { type: 'rest', count: 3 }, points: 4 } },
  { id: 'soc-4', title: 'Team Lunch',
    category: 'social', basePoints: 1, tokens: ['social', 'social', 'social'],
    bonus: { required: { type: 'social', count: 4 }, points: 6 } },
  { id: 'soc-5', title: 'Party Night',
    category: 'social', basePoints: 0, tokens: ['social', 'social'], costs: ['work'],
    bonus: { required: { type: 'social', count: 5 }, points: 9 } },

  // REST cards — recovery has a social cost (rest is antisocial)
  { id: 'rest-1', title: 'Sleep In',
    // Added social cost so rest strategy has a real tradeoff
    category: 'rest', basePoints: 4, tokens: ['rest', 'rest'], costs: ['social'] },
  { id: 'rest-2', title: 'Reading Day',
    category: 'rest', basePoints: 3, tokens: ['rest'],
    bonus: { required: { type: 'rest', count: 2 }, points: 3 } },
  { id: 'rest-3', title: 'Movie Marathon',
    category: 'rest', basePoints: 2, tokens: ['rest', 'social'],
    bonus: { required: { type: 'social', count: 3 }, points: 5 } },
  { id: 'rest-4', title: 'Meditation',
    category: 'rest', basePoints: 1, tokens: ['rest', 'rest'],
    bonus: { required: { type: 'rest', count: 4 }, points: 6 } },
  { id: 'rest-5', title: 'Full Rest Day',
    // Tokens reduced 3→2, added social cost — now matches tier-5 card symmetry
    category: 'rest', basePoints: 0, tokens: ['rest', 'rest'], costs: ['social'],
    bonus: { required: { type: 'rest', count: 5 }, points: 9 } },

  // BALANCED cards — mix of themes
  { id: 'bal-1', title: 'Productive Morning',
    category: 'balanced', basePoints: 4, tokens: ['work', 'fitness'], costs: ['rest'],
    bonus: { required: { type: 'work', count: 2 }, points: 3 } },
  { id: 'bal-2', title: 'Social Run',
    category: 'balanced', basePoints: 3, tokens: ['fitness', 'social'],
    // Bonus raised from +3 → +4 to match 3-threshold tier standard
    bonus: { required: { type: 'fitness', count: 3 }, points: 4 } },
  { id: 'bal-3', title: 'Work From Cafe',
    category: 'balanced', basePoints: 3, tokens: ['social', 'social'],
    bonus: { required: { type: 'social', count: 2 }, points: 3 } },
  { id: 'bal-4', title: 'Nature Hike',
    category: 'balanced', basePoints: 2, tokens: ['rest', 'fitness'],
    bonus: { required: { type: 'fitness', count: 3 }, points: 4 } },
  { id: 'bal-5', title: 'Volunteering',
    category: 'balanced', basePoints: 2, tokens: ['social', 'work', 'fitness'],
    // Threshold lowered from 3→2 so balanced play triggers it more reliably
    bonus: { required: { type: 'social', count: 2 }, points: 5 } },

  // BALANCED (extended) — new cards filling strategic gaps
  { id: 'bal-6', title: 'Evening Wind-Down',
    category: 'balanced', basePoints: 1, tokens: ['rest', 'social'],
    bonus: { required: { type: 'work', count: 4 }, points: 4 } },
  { id: 'bal-7', title: 'Lunch Break Walk',
    category: 'balanced', basePoints: 2, tokens: ['fitness', 'rest'],
    bonus: { required: { type: 'work', count: 2 }, points: 2 } },
  { id: 'bal-8', title: 'Hackathon Night',
    category: 'balanced', basePoints: 0, tokens: ['work', 'social'],
    bonus: { required: { type: 'social', count: 4 }, points: 6 } },
  { id: 'bal-9', title: 'Digital Detox',
    category: 'balanced', basePoints: 3, tokens: ['rest', 'fitness'], costs: ['work'] },
  { id: 'bal-10', title: 'Morning Pages',
    category: 'balanced', basePoints: 2, tokens: ['work', 'rest'],
    bonus: { required: { type: 'rest', count: 3 }, points: 3 } },
];

