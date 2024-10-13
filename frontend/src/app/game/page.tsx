"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { colors } from "../color";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { movePlayer, shootBullet, moveEnemies, setPlayerAlive, updateBullets, applyGravity, setOnGround, removeBullet, removeEnemy } from '../redux/gameSlice';

const gravity = 0.5;
const jumpHeight = 12;
const moveSpeed = 5;
const groundHeight = 140;
const bulletSpeed = 6;
const enemySpeed = 1.2;

// Styled components
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

// Game Component
const GamePage: React.FC = () => {
    const dispatch = useDispatch();
    const { playerPosition, bullets, playerAlive, onGround } = useSelector((state: RootState) => state.game);
    const enemies = useSelector((state: RootState) => state.game.enemies);

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
                    dispatch(applyGravity(jumpHeight)); // Trigger jump
                    dispatch(setOnGround(false)); // Player is no longer on the ground
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
        const gravityInterval = setInterval(() => {
            if (!onGround) {
                dispatch(applyGravity(gravity)); // Apply gravity while in the air
            }
        }, 20);

        return () => clearInterval(gravityInterval);
    }, [dispatch, onGround]);

    // Move enemies
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


    // Listen for keyboard input
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
                    {bullets && Array.isArray(bullets) && bullets.map((bullet, index) => (
                        <Bullet key={index} x={bullet.x} y={bullet.y} />
                    ))}
                    {enemies && Array.isArray(enemies) && enemies.map((enemy, index) => (
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
