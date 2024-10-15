"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { colors } from "../color";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { movePlayer, shootBullet, moveEnemies, setPlayerAlive, updateBullets, applyGravity, setOnGround, generateEnemies, incrementScore, resetScore, setBestScore, decreasePlayerHealth, decrementEnemyHealth } from '../redux/gameSlice';

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
    background: linear-gradient(to bottom, #3a3a3a, #8a8a8a);
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
    background-color: ${colors.secondaryButton};
    z-index: 0;
`;

const GamePage: React.FC = () => {
    const dispatch = useDispatch();
    const { playerPosition, bullets, playerAlive, score, bestScore, onGround, enemies, playerHealth } = useSelector((state: RootState) => state.game);

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
        }
    };

    useEffect(() => {
        const gravityInterval = setInterval(() => {
            dispatch(applyGravity(gravity));
        }, 20);

        return () => clearInterval(gravityInterval);
    }, [dispatch]);

    useEffect(() => {
        const enemyInterval = setInterval(() => {
            dispatch(moveEnemies(enemySpeed));
        }, 20);

        return () => clearInterval(enemyInterval);
    }, [dispatch]);

    useEffect(() => {
        const bulletInterval = setInterval(() => {
            dispatch(updateBullets(bulletSpeed));
        }, 20);

        return () => clearInterval(bulletInterval);
    }, [dispatch]);

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
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onGround, playerAlive, playerPosition]);

    return (
        <GameContainer x={0} y={0}>
            {playerAlive ? (
                <>
                    <Player x={playerPosition.x} y={playerPosition.y} />
                    <Platform />
                    <div style={{ position: "absolute", top: 10, left: 10, color: "white" }}>
                        <h2>Score: {score}</h2>
                        <h3>Best Score: {bestScore}</h3>
                        <h4>Health: {playerHealth}</h4>
                    </div>
                    {bullets && bullets.map((bullet, index) => (
                        <Bullet key={index} x={bullet.x} y={bullet.y} />
                    ))}
                    {enemies && enemies.map((enemy, index) => (
                        <Enemy key={index} x={enemy.x} y={enemy.y} />
                    ))}

                </>
            ) : (
                <h1 style={{ color: "red" }}>Game Over</h1>
            )}
        </GameContainer>
    );
};

export default GamePage;
