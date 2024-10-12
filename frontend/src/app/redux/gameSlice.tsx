// redux/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerPosition {
  x: number;
  y: number;
}

interface Bullet {
  x: number;
  y: number;
}

interface Enemy {
  x: number;
  y: number;
}

interface GameState {
  playerPosition: PlayerPosition;
  bullets: Bullet[];
  enemies: Enemy[];
  playerAlive: boolean;
}

const initialState: GameState = {
  playerPosition: { x: 100, y: 20 },
  bullets: [],
  enemies: [{ x: 500, y: 20 }],
  playerAlive: true,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    movePlayer: (state, action: PayloadAction<{ direction: string; moveSpeed: number }>) => {
      if (action.payload.direction === "left") {
        state.playerPosition.x -= action.payload.moveSpeed;
      } else if (action.payload.direction === "right") {
        state.playerPosition.x += action.payload.moveSpeed;
      }
    },
    applyGravity: (state, action: PayloadAction<number>) => {
      state.playerPosition.y += action.payload; // Apply gravity by increasing y position
    },
    shootBullet: (state, action: PayloadAction<Bullet>) => {
      state.bullets.push(action.payload);
    },
    moveEnemies: (state, action: PayloadAction<number>) => {
      state.enemies = state.enemies.map((enemy) => ({
        ...enemy,
        x: enemy.x - action.payload, // Move enemies to the left
      }));
    },
    
    setPlayerAlive: (state, action: PayloadAction<boolean>) => {
      state.playerAlive = action.payload;
    },
    updateBullets: (state, action: PayloadAction<number>) => {
      state.bullets = state.bullets.map(bullet => ({
        ...bullet,
        x: bullet.x + action.payload // Move bullets to the right
      }));
    },
  },
});


export const { movePlayer, applyGravity, shootBullet, moveEnemies, setPlayerAlive, updateBullets } = gameSlice.actions;

export default gameSlice.reducer;
