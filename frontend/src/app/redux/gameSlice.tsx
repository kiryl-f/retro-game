import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    date: Date | null;
}



interface Bullet {
    x: number;
    y: number;
    lifetime: number;
}

interface Explosion {
    x: number;
    y: number;
    lifetime: number;
}


interface GameState {
    playerPosition: { x: number, y: number };
    enemies: Array<{ x: number, y: number, hp: number }>;
    bullets: Array<Bullet>;
    enemyBullets: Array<Bullet>;
    playerAlive: boolean;
    playerHealth: number;
    score: number;
    deadEnemyCount: number;
    bestScore: number;
    onGround: boolean;
    gravity: number;
    inDefense: boolean;
    explosions: Array<Explosion>;
    achievements: Array<Achievement>
    timer: number;
}

const initialState: GameState = {
    playerPosition: { x: 100, y: 100 },
    bullets: [],
    enemies: [
        { x: 700, y: 100, hp: 3 },
        { x: 900, y: 100, hp: 5 },
    ],
    enemyBullets: [],
    playerAlive: true,
    playerHealth: 5,
    score: 0,
    bestScore: localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore') as string) : 0,
    deadEnemyCount: 0,
    onGround: true,
    gravity: 0.5,
    inDefense: false,
    explosions: [],

    achievements: [
        { id: 'first_kill', name: 'First Kill', description: 'Destroy your first enemy', unlocked: false, date: null },
        { id: 'ten_kills', name: 'Sharpshooter', description: 'Destroy 10 enemies', unlocked: false, date: null },
        { id: 'survivor', name: 'Survivor', description: 'Survive for 5 minutes', unlocked: false, date: null },
        { id: 'high_score', name: 'High Score', description: 'Reach 1000 points', unlocked: false, date: null }
    ],

    timer: 0
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

            if (state.playerPosition.x < 0) state.playerPosition.x = 0;
            if (state.playerPosition.x > window.innerWidth - 100) state.playerPosition.x = window.innerWidth - 100;

            checkCollisions(state);
        },
        applyGravity(state, action: PayloadAction<number>) {
            if (!state.onGround) {
                state.playerPosition.y -= action.payload;
            }

            if (state.playerPosition.y <= 0) {
                state.playerPosition.y = 0;
                state.onGround = true;
            }
            checkCollisions(state);
        },
        setOnGround(state, action: PayloadAction<boolean>) {
            state.onGround = action.payload;
        },
        generateEnemies(state) {
            console.log('spawning new enemies');

            const newEnemies = [
                { x: window.innerWidth + 100, y: 100, hp: 3 },
                { x: window.innerWidth + 300, y: 100, hp: 5 },
                { x: window.innerWidth + 500, y: 100, hp: 2 }
            ];

            state.enemies = newEnemies;
        },
        updateBullets(state, action: PayloadAction<number>) {
            const bulletSpeed = action.payload;
            state.bullets = state.bullets
                .map(bullet => ({ ...bullet, x: bullet.x + bulletSpeed, lifetime: bullet.lifetime - 1 }))
                .filter(bullet => bullet.lifetime > 0); 
        },
        moveEnemies(state, action: PayloadAction<number>) {
            const enemySpeed = action.payload;
            state.enemies = state.enemies.map(enemy => ({ ...enemy, x: enemy.x - enemySpeed }));
            checkCollisions(state);
        },
        shootBullet(state, action: PayloadAction<{ x: number, y: number }>) {
            state.bullets.push({ x: action.payload.x, y: action.payload.y, lifetime: 100 });
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
        incrementScore(state) {
            state.score += 100;
        },

        resetScore(state) {
            state.score = 0;
        },

        setBestScore(state) {
            if (state.score > state.bestScore) {
                state.bestScore = state.score;
                localStorage.setItem('bestScore', state.bestScore.toString());
            }
        },
        decreasePlayerHealth(state) {
            if (state.playerHealth > 0) {
                state.playerHealth -= 1;
            }
            if (state.playerHealth === 0) {
                state.playerAlive = false;
            }
        },
        decrementEnemyHealth(state, action: PayloadAction<number>) {
            const enemyIndex = action.payload;
            const enemy = state.enemies[enemyIndex];
            if (enemy.hp > 0) {
                enemy.hp -= 1;
            }
            if (enemy.hp === 0) {
                state.enemies.splice(enemyIndex, 1);
                state.deadEnemyCount += 1;
                state.score += 100;
            }
        },
        resetGame(state) {
            state.playerHealth = 5;
            state.score = 0;
            state.deadEnemyCount = 0;
            state.enemies = [
                { x: 700, y: 100, hp: 3 },
                { x: 900, y: 100, hp: 5 },
            ];
        },
        checkEnemyPosition(state) {
            state.enemies.forEach(enemy => {
                if (enemy.x < 0) {
                    state.playerAlive = false;
                }
            });
        },
        checkEnemyBulletCollisions(state) {
            if (state.inDefense) return;
            const playerRight = state.playerPosition.x + 100;
            const playerLeft = state.playerPosition.x;
            const playerBottom = state.playerPosition.y;

            state.enemyBullets.forEach((bullet, bulletIndex) => {
                if (
                    bullet.x < playerRight &&
                    bullet.x > playerLeft &&
                    bullet.y <= playerBottom + 100 &&
                    bullet.y >= playerBottom
                ) {
                    console.log('enemy bullet hit player');
                    state.playerHealth -= 1;
                    state.enemyBullets.splice(bulletIndex, 1);
                    if (state.playerHealth <= 0) {
                        state.playerAlive = false;
                    }
                }
            });
        },
        enemyShoot(state) {
            state.enemies.forEach(enemy => {
                state.enemyBullets.push({ x: enemy.x, y: enemy.y, lifetime: 100 });
            });
        },

        updateEnemyBullets(state, action: PayloadAction<number>) {
            const bulletSpeed = action.payload;
            state.enemyBullets = state.enemyBullets
                .map(bullet => ({ ...bullet, x: bullet.x - bulletSpeed, lifetime: bullet.lifetime - 1 }))
                .filter(bullet => bullet.lifetime > 0);  // Remove enemy bullets with zero lifetime
        },
        setDefense(state, action: PayloadAction<boolean>) {
            state.inDefense = action.payload;
        },


        updateAllEntities(state, action: PayloadAction<{ bulletSpeed: number, enemySpeed: number }>) {
            const { bulletSpeed, enemySpeed } = action.payload;
            state.bullets = state.bullets
                .map(bullet => ({ ...bullet, x: bullet.x + bulletSpeed, lifetime: bullet.lifetime - 1 }))
                .filter(bullet => bullet.lifetime > 0);

            state.enemyBullets = state.enemyBullets
                .map(bullet => ({ ...bullet, x: bullet.x - bulletSpeed, lifetime: bullet.lifetime - 1 }))
                .filter(bullet => bullet.lifetime > 0);

            state.enemies = state.enemies.map(enemy => ({ ...enemy, x: enemy.x - enemySpeed }));

            state.explosions = state.explosions
                .map(explosion => ({ ...explosion, lifetime: explosion.lifetime - 1 }))
                .filter(explosion => explosion.lifetime > 0);
        },
        addExplosion(state, action: PayloadAction<{ x: number, y: number }>) {
            state.explosions.push({ x: action.payload.x, y: action.payload.y, lifetime: 20 });
        },
        updateExplosions(state) {
            state.explosions = state.explosions
                .map(explosion => ({ ...explosion, lifetime: explosion.lifetime - 1 }))
                .filter(explosion => explosion.lifetime > 0);
        },
        unlockAchievement(state, action: PayloadAction<string>) {
            const achievement = state.achievements.find(a => a.id === action.payload);
            if (achievement && !achievement.unlocked) {
                achievement.unlocked = true;
                achievement.date = new Date();
            }
        },
        incrementTimer(state) {
            state.timer += 1;
        },
        resetTimer(state) {
            state.timer = 0;
        }
        
    }
});

function checkCollisions(state: GameState) {
    const playerRight = state.playerPosition.x + 100;
    const playerLeft = state.playerPosition.x;
    const playerBottom = state.playerPosition.y;

    state.enemies.forEach((enemy, enemyIndex) => {
        const enemyRight = enemy.x + 5;
        const enemyLeft = enemy.x;
        const enemyTop = enemy.y;

        if (enemy.hp <= 0) {
            // Trigger explosion at the enemy's position
            state.explosions.push({ x: enemy.x, y: enemy.y, lifetime: 20 });
            state.enemies.splice(enemyIndex, 1);
            state.score += 100;
        }


        if (
            playerRight > enemyLeft &&
            playerLeft < enemyRight &&
            playerBottom <= enemyTop + 5 &&
            playerBottom >= enemyTop
        ) {
            state.playerHealth -= 1;
            if (state.playerHealth === 0) {
                state.playerAlive = false;
            }
        }
    });

    state.bullets.forEach((bullet, bulletIndex) => {
        state.enemies.forEach((enemy, enemyIndex) => {
            const bulletRight = bullet.x + 5;
            const bulletLeft = bullet.x;
            const bulletBottom = bullet.y;

            const enemyRight = enemy.x + 5;
            const enemyLeft = enemy.x;
            const enemyTop = enemy.y;

            if (
                bulletRight > enemyLeft &&
                bulletLeft < enemyRight &&
                bulletBottom <= enemyTop + 5 &&
                bulletBottom >= enemyTop
            ) {
                state.explosions.push({ x: enemy.x, y: enemy.y, lifetime: 40 });

                state.enemies[enemyIndex].hp -= 1;
                if (state.enemies[enemyIndex].hp <= 0) {
                    state.enemies.splice(enemyIndex, 1);
                    state.score += 100;
                }

                state.bullets.splice(bulletIndex, 1);
            }
        });
    });
}

export const { movePlayer, applyGravity, setOnGround,
    updateBullets, moveEnemies, shootBullet, setPlayerAlive, removeEnemy, removeBullet, generateEnemies, incrementScore, resetScore, setBestScore,
    decreasePlayerHealth, decrementEnemyHealth, resetGame,
    updateEnemyBullets, setDefense, enemyShoot, checkEnemyBulletCollisions, checkEnemyPosition, updateAllEntities, addExplosion, updateExplosions, incrementTimer, resetTimer } = gameSlice.actions;
export default gameSlice.reducer;