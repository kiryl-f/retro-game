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
const bulletSpeed = 8; // Speed for bullets

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
    width: 50px;
    height: 50px;
    background-color: ${colors.text};
`;

const Enemy = styled.div.attrs<{ x: number; y: number }>((props) => ({
    style: {
        bottom: `${props.y}px`,
        left: `${props.x}px`,
    },
}))`
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: red;
`;

const Platform = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${groundHeight}px;
    background-color: ${colors.secondaryButton};
`;

const Bullet = styled.div.attrs<{ x: number; y: number }>((props) => ({
    style: {
        top: `${props.y}px`,
        left: `${props.x}px`,
    },
}))`
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: ${colors.primaryButton};
`;

// Main Game Component
const GamePage: React.FC = () => {
    const [playerPosition, setPlayerPosition] = useState({ x: 100, y: groundHeight });
    const [velocityY, setVelocityY] = useState(0);
    const [onGround, setOnGround] = useState(true); // True when player is on the ground
    const [enemyPosition, setEnemyPosition] = useState({ x: 500, y: groundHeight });
    const [playerAlive, setPlayerAlive] = useState(true); // Player's alive status
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
        if (e.code === "KeyS") {
            shootBullet(); // Shoot bullets on pressing "S"
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

    // Collision detection between player and enemy
    useEffect(() => {
        const checkCollision = () => {
            const playerRight = playerPosition.x + 50; // Player's width
            const enemyRight = enemyPosition.x + 40; // Enemy's width

            if (
                playerPosition.x < enemyRight &&
                playerRight > enemyPosition.x &&
                playerPosition.y <= enemyPosition.y + groundHeight // Collision only when they touch the ground
            ) {
                console.log("Collision detected!");
                setPlayerAlive(false); // Player "dies" on collision
            }
        };

        const collisionInterval = setInterval(checkCollision, 20);
        return () => clearInterval(collisionInterval);
    }, [playerPosition, enemyPosition]);

    // Shooting bullets logic
    const shootBullet = () => {
        setBullets((prev) => [
            ...prev,
            { x: playerPosition.x + 40, y: window.innerHeight - playerPosition.y - 35 }, // Offset to shoot from the player's position
        ]);
    };

    // Update bullet positions and collision detection
    useEffect(() => {
        const bulletInterval = setInterval(() => {
            setBullets((prevBullets) =>
                prevBullets
                    .map((bullet) => ({ ...bullet, x: bullet.x + bulletSpeed })) // Move bullets to the right
                    .filter((bullet) => bullet.x < window.innerWidth) // Remove bullets that go off-screen
            );

            // Check for bullet collision with enemy
            setBullets((prevBullets) =>
                prevBullets.filter((bullet) => {
                    const bulletRight = bullet.x + 10; // Bullet's width
                    const enemyRight = enemyPosition.x + 40; // Enemy's width

                    if (
                        bullet.x < enemyRight &&
                        bulletRight > enemyPosition.x &&
                        bullet.y >= window.innerHeight - enemyPosition.y - 40 && // Ensure it's colliding vertically
                        bullet.y <= window.innerHeight - enemyPosition.y // Y-axis within enemy's range
                    ) {
                        console.log("Bullet hit enemy!");
                        setEnemyPosition({ x: 800, y: groundHeight }); // Reset enemy to the right side
                        return false; // Remove bullet that hits the enemy
                    }
                    return true; // Keep bullets that haven't hit the enemy
                })
            );
        }, 20);

        return () => clearInterval(bulletInterval);
    }, [bullets, enemyPosition]);

    // Listen for keyboard input
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onGround]);

    return (
        <GameContainer>
            {playerAlive ? (
                <>
                    <Player x={playerPosition.x} y={playerPosition.y} />
                    <Enemy x={enemyPosition.x} y={enemyPosition.y} />
                    <Platform />
                    {bullets.map((bullet, index) => (
                        <Bullet key={index} x={bullet.x} y={bullet.y} />
                    ))}
                </>
            ) : (
                <h1 style={{ color: "red" }}>Game Over</h1>
            )}
        </GameContainer>
    );
};

export default GamePage;
