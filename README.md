```md
# GameStat

GameStat is a multi-game player analytics platform in development, currently focused on Overwatch player data.
Users can search a public Overwatch BattleTag, pull live stats, and view custom performance metrics such as:
GameStat Score, Pressure Rating, Reliability Score, Hero Confidence, Flex Rating, Role Confidence, and Hero Pool.

The long-term goal is to expand GameStat into a cross-game analytics tool for competitive players,
combining stat tracking, custom scoring systems, and AI-generated performance insights across multiple games.

## Features

- Live Overwatch BattleTag search
- Public player stat retrieval through the OverFast API
- Serverless backend using Netlify Functions
- Secure OpenAI API integration through environment variables
- Custom performance metrics and scoring logic
- AI-generated player performance overview
- Responsive glassmorphism React UI
- Python analytics pipeline for metric testing and validation

## How to Use

1. Open the live GameStat site.
2. Click the username box on the homepage.
3. Enter a public Overwatch BattleTag.
4. Press Enter.
5. GameStat will fetch the player’s public stats and generate updated performance metrics.

Example BattleTag:

```txt
ChakaKhan#11335
