"use client"; // Add this line at the very top of your file

import React from "react";
import MenuButton from "./menu_button"; // Adjust the path based on your file structure
import { colors } from "../color";
import { useRouter } from "next/navigation";
import { NextPage } from "next";

const StartMenu: NextPage = () => {
    const router = useRouter();

    const startGame = () => {
        console.log("Starting the game...");
        router.push('game');
    };

    const openSettings = () => {
        console.log("Opening settings...");
    };

    const exitGame = () => {
        console.log("Exiting the game...");
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: colors.background, color: colors.text }}>
            <h1 style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700 }}>Retro Game</h1>
            <MenuButton text="Start Game" onClick={startGame} />
            <MenuButton text="Settings" onClick={openSettings} />
            <MenuButton text="Exit" onClick={exitGame} />
        </div>
    );
};

export default StartMenu;
