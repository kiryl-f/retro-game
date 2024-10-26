"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { colors } from "../color";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
    movePlayer, shootBullet, moveEnemies, setPlayerAlive, updateBullets, applyGravity,
    setOnGround, generateEnemies, incrementScore, resetScore, setBestScore, decreasePlayerHealth, decrementEnemyHealth,
    updateEnemyBullets, setDefense, enemyShoot, checkEnemyBulletCollisions, checkEnemyPosition,
    updateAllEntities, addExplosion, updateExplosions
} from '../redux/gameSlice';
import { useRouter } from "next/navigation";

const gravity = 0.5;
const jumpHeight = 12;
const moveSpeed = 5;
const groundHeight = 140;
const bulletSpeed = 6;
const enemySpeed = 1.2;
const enemyRespawnDelay = 2000;

const GameContainer = styled.div.attrs<{ x: number; y: number }>((props) => ({
    style: {
        bottom: `${props.y}px`,
        left: `${props.x}px`,
    },
}))`
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: ${colors.gameBg};
`;

const Player = styled.div.attrs<{ x: number; y: number }>((props) => ({
    style: {
        bottom: `${props.y}px`,
        left: `${props.x}px`,
    },
}))`
    position: absolute;
    width: 100px;
    height: 100px;
    background-image: url("/images/player.png");
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 2;
`;

const Enemy = styled.div.attrs<{ x: number; y: number }>((props) => ({
    style: {
        bottom: `${props.y}px`,
        left: `${props.x}px`,
    },
}))`
    position: absolute;
    width: 90px;
    height: 90px;
    background-image: url("/images/enemy.png");
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 1;
`;

const Explosion = styled.div`
    width: 40px;
    height: 40px;
    background: radial-gradient(circle, yellow, red, black);
    border-radius: 50%;
    position: absolute;
    animation: fadeOut 0.3s ease-out forwards;

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;


const EnemyBullet = styled.div<{ x: number, y: number }>`
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: orange;
    left: ${props => props.x}px;
    bottom: ${props => props.y}px;
`;

const Bullet = styled.div.attrs<{ x: number; y: number }>((props) => ({
    style: {
        left: `${props.x}px`,
        bottom: `${props.y}px`,
    },
}))`
    position: absolute;
    width: 50px;
    height: 50px;
    background-image: url("/images/bullet.png");
    background-size: cover;
    z-index: 3;

    transform: rotate(90deg);
`;

const Platform = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${groundHeight}px;
    background-color: ${colors.platform};
    z-index: 0;
`;

const GamePage: React.FC = () => {
    const dispatch = useDispatch();
    const { playerPosition, bullets, playerAlive, score, bestScore, onGround, enemies, playerHealth, inDefense, enemyBullets, explosions } = useSelector((state: RootState) => state.game);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!playerAlive) return;

        switch (e.code) {
            case "ArrowLeft":
                dispatch(movePlayer({ direction: "left", moveSpeed }));
                break;
            case "ArrowRight":
                dispatch(movePlayer({ direction: "right", moveSpeed }));
                break;
            case "Space":
                if (onGround) {
                    dispatch(applyGravity(jumpHeight));
                    dispatch(setOnGround(false));
                }
                break;
            case "KeyS":
                dispatch(shootBullet(playerPosition));
                break;
            case "KeyD":
                dispatch(setDefense(!inDefense));
                break;
        }
    };

    useEffect(() => {
        const gravityInterval = setInterval(() => {
            dispatch(applyGravity(gravity));
        }, 20);

        return () => clearInterval(gravityInterval);
    }, [dispatch]);

    // useEffect(() => {
    //     const enemyInterval = setInterval(() => {
    //         dispatch(moveEnemies(enemySpeed));
    //     }, 20);

    //     return () => clearInterval(enemyInterval);
    // }, [dispatch]);

    // useEffect(() => {
    //     const bulletInterval = setInterval(() => {
    //         dispatch(updateBullets(bulletSpeed));
    //     }, 20);

    //     return () => clearInterval(bulletInterval);
    // }, [dispatch]);

    useEffect(() => {
        console.log(enemies.length);
        if (enemies.length === 0) {
            dispatch(generateEnemies());
        }
    }, [enemies, dispatch]);

    useEffect(() => {
        if (!playerAlive) {
            dispatch(setBestScore());
        }
    }, [playerAlive, dispatch]);

    useEffect(() => {
        if (playerAlive) {
            dispatch(resetScore());
        }
    }, [playerAlive, dispatch]);



    useEffect(() => {
        const gameUpdateInterval = setInterval(() => {
            dispatch(updateAllEntities({ bulletSpeed: 11, enemySpeed: 2.5 }));
            dispatch(checkEnemyBulletCollisions());
        }, 40);

        return () => clearInterval(gameUpdateInterval);
    }, [dispatch]);



    useEffect(() => {
        const enemyShootInterval = setInterval(() => {
            dispatch(enemyShoot());
        }, 2000);

        return () => clearInterval(enemyShootInterval);
    }, [dispatch]);


    useEffect(() => {
        const checkEnemyPositionInterval = setInterval(() => {
            dispatch(checkEnemyPosition());
        }, 50);

        return () => clearInterval(checkEnemyPositionInterval);
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onGround, playerAlive, playerPosition, inDefense]);

    const router = useRouter();
    return (
        <GameContainer x={0} y={0}>
            {playerAlive ? (
                <>
                    <Player x={playerPosition.x} y={playerPosition.y} />
                    <Platform />
                    <div style={{ position: "absolute", top: 10, left: 10, color: "white" }}>
                        <h2 style={{ marginBottom: '1.5vh' }}>Score: {score}</h2>
                        <h3 style={{ marginBottom: '1.5vh' }}>Best Score: {bestScore}</h3>
                        <h4>Health: {playerHealth}</h4>
                    </div>
                    {bullets && bullets.map((bullet, index) => (
                        <Bullet key={index} x={bullet.x} y={bullet.y} />
                    ))}
                    {enemies && enemies.map((enemy, index) => (
                        <Enemy key={index} x={enemy.x} y={enemy.y} />
                    ))}

                    {enemyBullets.map((bullet, index) => (
                        <EnemyBullet key={index} x={bullet.x} y={bullet.y} />
                    ))}

                    {explosions.map((explosion, index) => (
                        <Explosion key={index} style={{ left: explosion.x, bottom: explosion.y }} />
                    ))}


                </>
            ) : (
                <div>
                    <h1 style={{ color: "red", height: '100%', width: '100%', userSelect: 'none', textAlign: 'center', marginTop: '45vh' }}>Game Over</h1>

                    <div>
                        <p style={{width: '100%', marginTop: '7vh', fontSize:'20px', cursor: 'pointer', color: '#ffffff', textAlign: 'center'}} onClick={() => {location.reload()}}>Try again!</p>
                    </div>
                </div>
            )}
        </GameContainer>
    );
};

export default GamePage;
