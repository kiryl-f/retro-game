"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { colors } from "../color";



// Constants
const gravity = 0.5;
const jumpHeight = -12;
const moveSpeed = 5;
const groundHeight = 20; // Platform height
const enemySpeed = 2; // Speed for enemy movement
const bulletSpeed = 8; // Speed of bullets

// Styled Components
const GameContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: ${colors.background};
    overflow: hidden;
    position: relative;
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
    background-image: url("/images/player.png"); // Directly reference the image
    background-size: cover;
    background-repeat: no-repeat;
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
    background-size: cover; // Ensure the image covers the entire div
    background-repeat: no-repeat;
`;

const Platform = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${groundHeight}px;
    background-color: ${colors.secondaryButton};
`;

const Bullet = styled.div<{ x: number; y: number }>`
    position: absolute;
    top: ${(props) => props.y}px;
    left: ${(props) => props.x}px;
    width: 10px;
    height: 10px;
    background-color: yellow;
`;

// Game Component
const GamePage: React.FC = () => {
    const [playerPosition, setPlayerPosition] = useState({ x: 100, y: groundHeight });
    const [velocityY, setVelocityY] = useState(0);
    const [onGround, setOnGround] = useState(true); // Player initially on the ground
    const [bullets, setBullets] = useState<{ x: number; y: number }[]>([]);
    const [enemies, setEnemies] = useState([{ x: 500, y: groundHeight }]); // Initial enemy position
    const [playerAlive, setPlayerAlive] = useState(true);

    // Player Movement
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!playerAlive) return; // Prevent movement if the player is dead

        switch (e.code) {
            case "ArrowLeft":
                setPlayerPosition((prev) => ({ ...prev, x: prev.x - moveSpeed }));
                break;
            case "ArrowRight":
                setPlayerPosition((prev) => ({ ...prev, x: prev.x + moveSpeed }));
                break;
            case "Space":
                if (onGround) {
                    setVelocityY(jumpHeight);
                    setOnGround(false);
                }
                break;
            case "KeyS":
                shootBullet();
                break;
        }
    };

    // Jumping and Gravity Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setPlayerPosition((prev) => {
                let newY = prev.y + velocityY;
                let newVelocityY = velocityY + gravity;

                // Ground collision
                if (newY <= groundHeight) {
                    newY = groundHeight;
                    newVelocityY = 0;
                    setOnGround(true);
                }

                setVelocityY(newVelocityY);
                return { ...prev, y: newY };
            });
        }, 20); // Physics interval

        return () => clearInterval(interval);
    }, [velocityY]);

    // Enemy Movement
    useEffect(() => {
        const interval = setInterval(() => {
            setEnemies((prevEnemies) =>
                prevEnemies.map((enemy) => {
                    let newX = enemy.x - enemySpeed;
                    if (newX < -40) { // Off-screen, respawn enemy
                        newX = window.innerWidth;
                    }
                    return { x: newX, y: groundHeight };
                })
            );
        }, 20); // Enemy movement interval

        return () => clearInterval(interval);
    }, []);

    // Bullet Movement and Collision
    useEffect(() => {
        const interval = setInterval(() => {
            setBullets((prevBullets) =>
                prevBullets
                    .map((bullet) => ({ ...bullet, x: bullet.x + bulletSpeed })) // Move bullets
                    .filter((bullet) => bullet.x < window.innerWidth) // Remove off-screen bullets
            );
        }, 20);

        return () => clearInterval(interval);
    }, [bullets]);

    // Bullet-Enemy Collision Detection
    useEffect(() => {
        const checkBulletCollision = () => {
            setEnemies((prevEnemies) =>
                prevEnemies.filter((enemy) => {
                    const hit = bullets.some(
                        (bullet) =>
                            bullet.x + 10 > enemy.x && bullet.x < enemy.x + 40 && bullet.y === window.innerHeight - enemy.y - 20
                    );
                    return !hit; // Remove enemy if hit
                })
            );
        };

        const interval = setInterval(checkBulletCollision, 20);
        return () => clearInterval(interval);
    }, [bullets, enemies]);

    // Player-Enemy Collision Detection
    useEffect(() => {
        const checkPlayerCollision = () => {
            enemies.forEach((enemy) => {
                if (
                    playerPosition.x + 50 > enemy.x &&
                    playerPosition.x < enemy.x + 40 &&
                    playerPosition.y === enemy.y
                ) {
                    console.log("Player hit!");
                    setPlayerAlive(false); // End game on collision
                }
            });
        };

        const interval = setInterval(checkPlayerCollision, 20);
        return () => clearInterval(interval);
    }, [playerPosition, enemies]);

    // Bullet shooting logic
    const shootBullet = () => {
        setBullets((prevBullets) => [
            ...prevBullets,
            { x: playerPosition.x + 50, y: window.innerHeight - playerPosition.y - 30 }, // Align bullet with player
        ]);
    };

    // Listen for keyboard input
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onGround, playerAlive]);

    return (
        <GameContainer>
            {playerAlive ? (
                <>
                    <Player x={playerPosition.x} y={playerPosition.y} />
                    <Platform />
                    {bullets.map((bullet, index) => (
                        <Bullet key={index} x={bullet.x} y={bullet.y} />
                    ))}
                    {enemies.map((enemy, index) => (
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
