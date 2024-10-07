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

const GameContainer = styled.div.attrs<{ x: number; y: number }>((props) => ({
    style: {
        bottom: `${props.y}px`,
        left: `${props.x}px`,
    },
}))`
    position: relative; // Ensure the container has relative positioning
    width: 100vw;       // Full width of the viewport
    height: 100vh;      // Full height of the viewport
    overflow: hidden;   // Prevent overflow
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
    background-image: url("/images/player.png"); // Directly reference the image
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 2; // Player should be in front of enemies
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
    z-index: 1; // Enemies should be behind the player
`;

const Bullet = styled.div.attrs<{ x: number; y: number }>((props) => ({
    style: {
        left: `${props.x}px`,
        bottom: `${props.y}px`, // Ensure consistency in bottom alignment like the player
    },
}))`
    position: absolute;
    width: 50px;  // Bullet width
    height: 50px; // Bullet height
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
    z-index: 0; // Platform should be the lowest
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
        if (!playerAlive) return;
    
        switch (e.code) {
            case "ArrowLeft":
                setPlayerPosition((prev) => {
                    const newX = prev.x - moveSpeed;
                    console.log("Moving Left: newX =", newX);
                    return { ...prev, x: newX };
                });
                break;
            case "ArrowRight":
                setPlayerPosition((prev) => {
                    const newX = prev.x + moveSpeed;
                    console.log("Moving Right: newX =", newX);
                    return { ...prev, x: newX };
                });
                break;
            case "Space":
                if (onGround) {
                    setVelocityY(jumpHeight);
                    setOnGround(false);
                }
                break;
            case "KeyS":
                shootBullet(); // Call shootBullet, using the current player position
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

                    //console.log('enemyX: ' + newX);
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
                    const hit = bullets.some((bullet) => {
                        const bulletRightEdge = bullet.x + 50; // Assuming bullet width is 50
                        const bulletBottomEdge = bullet.y + 50; // Assuming bullet height is 50
        
                        const enemyRightEdge = enemy.x + 90; // Assuming enemy width is 90
                        const enemyBottomEdge = enemy.y + 90; // Assuming enemy height is 90
        
                        // Check for collision
                        return (
                            bulletRightEdge > enemy.x && // Bullet's right edge is past the enemy's left edge
                            bullet.x < enemyRightEdge && // Bullet's left edge is before the enemy's right edge
                            bulletBottomEdge > enemy.y && // Bullet's bottom edge is above the enemy's top edge
                            bullet.y < enemyBottomEdge // Bullet's top edge is below the enemy's bottom edge
                        );
                    });
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

    const shootBullet = () => {
        setBullets((prevBullets) => [
            ...prevBullets,
            {
                x: playerPosition.x + 50, // Start from the right of the player
                y: playerPosition.y + 30, // Align with player's y position
            },
        ]);
    };
    

    // Listen for keyboard input
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onGround, playerAlive, playerPosition]); // Add playerPosition as a dependency
    

    return (
        <GameContainer x={0} y={0}>
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
