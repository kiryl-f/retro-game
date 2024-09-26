import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  score: number;
  level: number;
  playerHealth: number;
  isGamePaused: boolean;
}

const initialState: GameState = {
  score: 0,
  level: 1,
  playerHealth: 100,
  isGamePaused: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    increaseScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    decreaseHealth: (state, action: PayloadAction<number>) => {
      state.playerHealth -= action.payload;
    },
    pauseGame: (state) => {
      state.isGamePaused = true;
    },
    resumeGame: (state) => {
      state.isGamePaused = false;
    },
    resetGame: (state) => {
      state.score = 0;
      state.level = 1;
      state.playerHealth = 100;
      state.isGamePaused = false;
    },
  },
});

export const { increaseScore, decreaseHealth, pauseGame, resumeGame, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
