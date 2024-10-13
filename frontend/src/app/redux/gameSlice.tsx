import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
    playerPosition: { x: number, y: number };
    bullets: Array<{ x: number, y: number }>;
    enemies: Array<{ x: number, y: number }>;
    playerAlive: boolean;
    onGround: boolean; // Tracks whether the player is on the ground
    gravity: number;
}

const initialState: GameState = {
    playerPosition: { x: 100, y: 100 },
    bullets: [],
    enemies: [{ x: 400, y: 100 }, { x: 600, y: 100 }],
    playerAlive: true,
    onGround: true, // Player starts on the ground
    gravity: 0.5,  // Gravity constant
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        movePlayer(state, action: PayloadAction<{ direction: string; moveSpeed: number }>) {
            const { direction, moveSpeed } = action.payload;
            if (direction === "left") {
                state.playerPosition.x -= moveSpeed;
            } else if (direction === "right") {
                state.playerPosition.x += moveSpeed;
            }
            // Ensure player stays within map bounds
            if (state.playerPosition.x < 0) state.playerPosition.x = 0;
            if (state.playerPosition.x > window.innerWidth - 100) state.playerPosition.x = window.innerWidth - 100;

            checkCollisions(state);
        },
        applyGravity(state, action: PayloadAction<number>) {
            if (!state.onGround) {
                state.playerPosition.y -= action.payload;
            }
            // Prevent player from falling below the ground
            if (state.playerPosition.y <= 0) {
                state.playerPosition.y = 0;
                state.onGround = true;
            }
            checkCollisions(state);
        },
        setOnGround(state, action: PayloadAction<boolean>) {
            state.onGround = action.payload;
        },
        updateBullets(state, action: PayloadAction<number>) {
            const bulletSpeed = action.payload;
            state.bullets = state.bullets.map(bullet => ({ ...bullet, x: bullet.x + bulletSpeed }));
            checkCollisions(state);
        },
        moveEnemies(state, action: PayloadAction<number>) {
            const enemySpeed = action.payload;
            state.enemies = state.enemies.map(enemy => ({ ...enemy, x: enemy.x - enemySpeed }));
            checkCollisions(state);
        },
        shootBullet(state, action: PayloadAction<{ x: number, y: number }>) {
            state.bullets.push({ ...action.payload });
        },
        setPlayerAlive(state, action: PayloadAction<boolean>) {
            state.playerAlive = action.payload;
        },
        removeEnemy(state, action: PayloadAction<number>) {
            state.enemies.splice(action.payload, 1);
        },
        removeBullet(state, action: PayloadAction<number>) {
            state.bullets.splice(action.payload, 1);
        },
    }
});

// Collision detection logic integrated into Redux
function checkCollisions(state: GameState) {
    const playerRight = state.playerPosition.x + 100;
    const playerLeft = state.playerPosition.x;
    const playerBottom = state.playerPosition.y;

    // Check if player collides with any enemy
    state.enemies.forEach((enemy, enemyIndex) => {
        const enemyRight = enemy.x + 90;
        const enemyLeft = enemy.x;
        const enemyTop = enemy.y;

        if (
            playerRight > enemyLeft &&
            playerLeft < enemyRight &&
            playerBottom <= enemyTop + 90 &&
            playerBottom >= enemyTop
        ) {
            state.playerAlive = false;
        }
    });

    // Check if bullets hit any enemy
    state.bullets.forEach((bullet, bulletIndex) => {
        state.enemies.forEach((enemy, enemyIndex) => {
            const bulletRight = bullet.x + 50;
            const bulletLeft = bullet.x;
            const bulletBottom = bullet.y;

            const enemyRight = enemy.x + 90;
            const enemyLeft = enemy.x;
            const enemyTop = enemy.y;

            if (
                bulletRight > enemyLeft &&
                bulletLeft < enemyRight &&
                bulletBottom <= enemyTop + 90 &&
                bulletBottom >= enemyTop
            ) {
                state.enemies.splice(enemyIndex, 1);
                state.bullets.splice(bulletIndex, 1);
            }
        });
    });
}

export const { movePlayer, applyGravity, setOnGround, updateBullets, moveEnemies, shootBullet, setPlayerAlive, removeEnemy, removeBullet } = gameSlice.actions;
export default gameSlice.reducer;
