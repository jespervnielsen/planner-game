import { Card } from './types';

export const ALL_CARDS: Card[] = [
  // WORK cards
  { id: 'work-1', title: 'Deep Work', basePoints: 3, tokens: ['work', 'work'],
    bonus: { required: { type: 'work', count: 3 }, points: 4 } },
  { id: 'work-2', title: 'Code Review', basePoints: 2, tokens: ['work'],
    bonus: { required: { type: 'work', count: 2 }, points: 2 } },
  { id: 'work-3', title: 'Strategy Meeting', basePoints: 1, tokens: ['work', 'social'],
    bonus: { required: { type: 'social', count: 2 }, points: 3 } },
  { id: 'work-4', title: 'Side Project', basePoints: 2, tokens: ['work', 'work', 'fitness'],
    bonus: { required: { type: 'work', count: 4 }, points: 5 } },
  { id: 'work-5', title: 'Inbox Zero', basePoints: 1, tokens: ['work'],
    bonus: { required: { type: 'rest', count: 1 }, points: 2 } },

  // FITNESS cards
  { id: 'fit-1', title: 'Morning Run', basePoints: 2, tokens: ['fitness', 'fitness'],
    bonus: { required: { type: 'fitness', count: 2 }, points: 3 } },
  { id: 'fit-2', title: 'Gym Session', basePoints: 3, tokens: ['fitness', 'fitness', 'fitness'],
    bonus: { required: { type: 'fitness', count: 3 }, points: 4 } },
  { id: 'fit-3', title: 'Yoga Class', basePoints: 2, tokens: ['fitness', 'rest'],
    bonus: { required: { type: 'rest', count: 2 }, points: 3 } },
  { id: 'fit-4', title: 'Cycling Trip', basePoints: 3, tokens: ['fitness', 'fitness'],
    bonus: { required: { type: 'social', count: 1 }, points: 2 } },
  { id: 'fit-5', title: 'Evening Walk', basePoints: 1, tokens: ['fitness', 'rest'],
    bonus: { required: { type: 'fitness', count: 1 }, points: 1 } },

  // SOCIAL cards
  { id: 'soc-1', title: 'Team Lunch', basePoints: 1, tokens: ['social', 'work'],
    bonus: { required: { type: 'social', count: 3 }, points: 5 } },
  { id: 'soc-2', title: 'Friend Dinner', basePoints: 2, tokens: ['social', 'social'],
    bonus: { required: { type: 'social', count: 2 }, points: 3 } },
  { id: 'soc-3', title: 'Game Night', basePoints: 2, tokens: ['social', 'social', 'rest'],
    bonus: { required: { type: 'rest', count: 1 }, points: 2 } },
  { id: 'soc-4', title: 'Book Club', basePoints: 2, tokens: ['social', 'rest'],
    bonus: { required: { type: 'social', count: 1 }, points: 1 } },
  { id: 'soc-5', title: 'Networking Event', basePoints: 1, tokens: ['social', 'work'],
    bonus: { required: { type: 'work', count: 2 }, points: 3 } },

  // REST cards
  { id: 'rest-1', title: 'Sleep In', basePoints: 2, tokens: ['rest', 'rest'],
    bonus: { required: { type: 'rest', count: 2 }, points: 3 } },
  { id: 'rest-2', title: 'Reading Day', basePoints: 2, tokens: ['rest', 'rest'],
    bonus: { required: { type: 'fitness', count: 1 }, points: 2 } },
  { id: 'rest-3', title: 'Movie Marathon', basePoints: 1, tokens: ['rest', 'social'],
    bonus: { required: { type: 'rest', count: 3 }, points: 4 } },
  { id: 'rest-4', title: 'Meditation', basePoints: 1, tokens: ['rest'],
    bonus: { required: { type: 'rest', count: 1 }, points: 2 } },
  { id: 'rest-5', title: 'Nature Hike', basePoints: 3, tokens: ['rest', 'fitness'],
    bonus: { required: { type: 'fitness', count: 2 }, points: 3 } },

  // BALANCED cards
  { id: 'bal-1', title: 'Productive Morning', basePoints: 2, tokens: ['work', 'fitness'],
    bonus: { required: { type: 'work', count: 1 }, points: 1 } },
  { id: 'bal-2', title: 'Social Run', basePoints: 2, tokens: ['fitness', 'social'],
    bonus: { required: { type: 'fitness', count: 2 }, points: 2 } },
  { id: 'bal-3', title: 'Work From Cafe', basePoints: 2, tokens: ['work', 'social'],
    bonus: { required: { type: 'social', count: 1 }, points: 2 } },
  { id: 'bal-4', title: 'Spa Day', basePoints: 3, tokens: ['rest', 'rest', 'fitness'],
    bonus: { required: { type: 'rest', count: 4 }, points: 5 } },
  { id: 'bal-5', title: 'Volunteering', basePoints: 2, tokens: ['social', 'fitness'],
    bonus: { required: { type: 'social', count: 2 }, points: 2 } },
];
