import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  playerPosition: { x: number; y: number };
  bullets: Array<{ x: number; y: number }>;
  enemies: Array<{ x: number; y: number }>;
  playerAlive: boolean;
  onGround: boolean;
  velocityY: number;
}

const initialState: GameState = {
  playerPosition: { x: 100, y: 20 },
  bullets: [],
  enemies: [
    { x: 800, y: 20 }, // First enemy
    { x: 1200, y: 20 }, // Second enemy
    { x: 1600, y: 20 }, // Third enemy
  ],
  playerAlive: true,
  onGround: true,
  velocityY: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    movePlayer: (state, action: PayloadAction<{ direction: 'left' | 'right'; moveSpeed: number }>) => {
      if (action.payload.direction === 'left') {
        state.playerPosition.x -= action.payload.moveSpeed;
      } else if (action.payload.direction === 'right') {
        state.playerPosition.x += action.payload.moveSpeed;
      }
    },
    shootBullet: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.bullets.push({ x: action.payload.x + 30, y: action.payload.y + 30 });
    },
    moveEnemies: (state, action: PayloadAction<number>) => {
      state.enemies = state.enemies.map((enemy) => ({
        ...enemy,
        x: enemy.x - action.payload,
      }));
    },
    
    updateBullets: (state, action: PayloadAction<number>) => {
      state.bullets = state.bullets.map((bullet) => ({
        ...bullet,
        x: bullet.x + action.payload,
      }));
    },
    applyGravity: (state, action: PayloadAction<number>) => {
      if (!state.onGround) {
        state.velocityY += action.payload; // Apply gravity or jump
        state.playerPosition.y += state.velocityY;
      }
      // Check if player hit the ground
      if (state.playerPosition.y <= 20) {
        state.playerPosition.y = 20;
        state.velocityY = 0;
        state.onGround = true;
      }
    },
    setPlayerAlive: (state, action: PayloadAction<boolean>) => {
      state.playerAlive = action.payload;
    },
    setOnGround: (state, action: PayloadAction<boolean>) => {
      state.onGround = action.payload;
    },
  },
});

export const { movePlayer, shootBullet, moveEnemies, updateBullets, applyGravity, setPlayerAlive, setOnGround } = gameSlice.actions;

export default gameSlice.reducer;
