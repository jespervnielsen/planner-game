# Perfect Week

**🎮 [Play the demo](https://jespervnielsen.github.io/planner-game/)**

A strategic card-drafting puzzle game where you design the ideal week. Pick activities, balance your tokens, and chase the perfect score.

---

## What is it?

Perfect Week challenges you to build a 6-day schedule from a shuffled deck of 25 activity cards. Each turn you are offered two cards and must place one on a day column. Stack combos, hit token thresholds, and unlock bonuses to maximise your score.

---

## How to play

1. **Draft a card** – Each turn two random activity cards are revealed. Pick one.
2. **Place it on a day** – Choose which day column (Monday–Saturday) to assign the card. Each day holds up to 3 cards.
3. **Earn tokens** – Every card generates one or more of the four life-balance tokens:
   - 💼 Work
   - 🏃 Fitness
   - 👥 Social
   - 😴 Rest
4. **Trigger bonuses** – Cards have conditional bonus points that fire when your token counts hit certain thresholds at the moment of placement.
5. **Finish the week** – After placing all 12 cards the game shows an animated score breakdown with your final rating.

---

## Scoring

| Rating | Score |
|---|---|
| 📝 Needs work | 0 – 14 |
| 🙂 Getting there | 15 – 29 |
| 👍 Good week | 30 – 44 |
| ⭐ Great week | 45 – 59 |
| 🏆 Perfect! | 60+ |

Each card contributes base points (1–3) plus optional bonus points that depend on accumulated tokens. The order and placement of cards matters.

---

## Activity cards

The deck contains 25 cards across five categories:

| Category | Cards |
|---|---|
| 💼 Work | Deep Work, Code Review, Strategy Meeting, Side Project, Inbox Zero |
| 🏃 Fitness | Morning Run, Gym Session, Yoga, Cycling, Evening Walk |
| 👥 Social | Team Lunch, Friend Dinner, Game Night, Book Club, Networking |
| 😴 Rest | Sleep In, Reading Day, Movie Marathon, Meditation, Nature Hike |
| 🌿 Balanced | Productive Morning, Social Run, Work From Cafe, Spa Day, Volunteering |

---

## Game modes

- **Daily mode** – A fixed puzzle generated from today's date. Everyone plays the same draw.
- **Random mode** – A new shuffled deck every game. Seeds are encoded in the URL so you can share a specific run with friends.

---

## Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for build tooling
- [GitHub Pages](https://pages.github.com/) for hosting

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```