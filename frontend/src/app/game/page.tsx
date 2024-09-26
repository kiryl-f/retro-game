"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { colors } from "../color";

// Constants for game mechanics
const gravity = 0.5;
const jumpHeight = -12;
const moveSpeed = 5;
const groundHeight = 20; // Platform height
const enemySpeed = 2; // Speed for enemy movement
const bulletSpeed = 10; // Speed for bullet movement

const GameContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: ${colors.background};
    overflow: hidden;
    position: relative;
`;

const Player = styled.div<{ x: number; y: number }>`
    position: absolute;
    bottom: ${(props) => props.y}px;
    left: ${(props) => props.x}px;
    width: 50px;
    height: 50px;
    background-color: ${colors.text};
`;

const Enemy = styled.div<{ x: number; y: number }>`
    position: absolute;
    bottom: ${(props) => props.y}px;
    left: ${(props) => props.x}px;
    width: 40px;
    height: 40px;
    background-color: #FF0000;
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
    background-color: ${colors.primaryButton};
`;

const GamePage: React.FC = () => {
    const [playerPosition, setPlayerPosition] = useState({ x: 100, y: groundHeight });
    const [velocityY, setVelocityY] = useState(0);
    const [onGround, setOnGround] = useState(true); // Set to true initially to be on the ground
    const [enemyPosition, setEnemyPosition] = useState({ x: 500, y: groundHeight });
    const [playerAlive, setPlayerAlive] = useState(true); // Check if the player is alive
    const [bullets, setBullets] = useState<{ x: number; y: number }[]>([]);

    // Handle player movement (left, right, jump)
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "ArrowLeft") {
            setPlayerPosition((prev) => ({ ...prev, x: prev.x - moveSpeed }));
        }
        if (e.code === "ArrowRight") {
            setPlayerPosition((prev) => ({ ...prev, x: prev.x + moveSpeed }));
        }
        if (e.code === "Space" && onGround) {
            setVelocityY(jumpHeight); // Jump
            setOnGround(false);
        }
    };

    // Handle gravity and jumping
    useEffect(() => {
        const interval = setInterval(() => {
            setPlayerPosition((prev) => {
                let newY = prev.y + velocityY;
                let newVelocityY = velocityY + gravity;

                if (newY <= groundHeight) { // Player lands on the ground
                    newY = groundHeight;
                    newVelocityY = 0;
                    setOnGround(true);
                } else {
                    setOnGround(false);
                }

                setVelocityY(newVelocityY);
                return { ...prev, y: newY };
            });
        }, 20); // Update interval for physics

        return () => clearInterval(interval);
    }, [velocityY]);

    // Enemy movement logic
    useEffect(() => {
        const enemyInterval = setInterval(() => {
            setEnemyPosition((prev) => {
                let newX = prev.x - enemySpeed;
                if (newX < -50) { // When the enemy leaves the screen, reset position
                    newX = 800; // Restart the enemy from the right side
                }
                return { ...prev, x: newX };
            });
        }, 20); // Update interval for enemy movement

        return () => clearInterval(enemyInterval);
    }, []);

    // Collision detection (bounding box)
    useEffect(() => {
        const checkCollision = () => {
            const playerRight = playerPosition.x + 50;
            const playerLeft = playerPosition.x;
            const playerTop = window.innerHeight - playerPosition.y - 50;
            const playerBottom = window.innerHeight - playerPosition.y;

            const enemyRight = enemyPosition.x + 40;
            const enemyLeft = enemyPosition.x;
            const enemyTop = window.innerHeight - enemyPosition.y - 40;
            const enemyBottom = window.innerHeight - enemyPosition.y;

            if (
                playerRight > enemyLeft &&
                playerLeft < enemyRight &&
                playerBottom > enemyTop &&
                playerTop < enemyBottom
            ) {
                console.log("Collision detected!");
                setPlayerAlive(false); // Player "dies" on collision
            }
        };

        const collisionInterval = setInterval(checkCollision, 20);
        return () => clearInterval(collisionInterval);
    }, [playerPosition, enemyPosition]);

    // Listen for keyboard input
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onGround]);

    // Shooting logic
    const shootBullet = () => {
        setBullets((prev) => [
            ...prev,
            { x: playerPosition.x + 35, y: window.innerHeight - playerPosition.y - 30 }, // Center bullet from player
        ]);
    };

    useEffect(() => {
        const handleShootKey = (e: KeyboardEvent) => {
            if (e.code === "KeyS") {
                shootBullet();
            }
        };

        window.addEventListener("keydown", handleShootKey);
        return () => window.removeEventListener("keydown", handleShootKey);
    }, [playerPosition]);

    // Update bullet positions and handle enemy collisions
    useEffect(() => {
        const interval = setInterval(() => {
            setBullets((prev) =>
                prev
                    .map((bullet) => ({
                        ...bullet,
                        x: bullet.x + bulletSpeed, // Move bullet to the right
                    }))
                    .filter((bullet) => bullet.x < window.innerWidth) // Remove bullets off-screen
            );
        }, 20);

        return () => clearInterval(interval);
    }, [bullets]);

    return (
        <GameContainer>
            {playerAlive ? (
                <>
                    <Player x={playerPosition.x} y={playerPosition.y} />
                    <Enemy x={enemyPosition.x} y={enemyPosition.y} />
                </>
            ) : (
                <h1 style={{ color: "red" }}>Game Over</h1>
            )}
            <Platform />
            {bullets.map((bullet, index) => (
                <Bullet key={index} x={bullet.x} y={bullet.y} />
            ))}
        </GameContainer>
    );
};

export default GamePage;
