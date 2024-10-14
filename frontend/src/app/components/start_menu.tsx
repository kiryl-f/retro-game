"use client"; // Add this line at the very top of your file

import React from "react";
import MenuButton from "./menu_button"; // Adjust the path based on your file structure
import { colors } from "../color";
import { useRouter } from "next/navigation";
import { NextPage } from "next";

import { IBM_Plex_Mono } from 'next/font/google';

import localFont from "next/font/local";
import styled from "styled-components";


const myFont = localFont({ src: '../fonts/IBMPlexMono-Bold.ttf' });


const GameTitle = styled.h1`

    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

    font-family: "IBM Plex Mono", monospace;
    font-weight: 700;
    font-size: 32px;   
    text-transform: uppercase;

    gravity: center;

`

const StartMenu: NextPage = () => {
    const router = useRouter();

    const startGame = () => {
        console.log("Starting the game...");
        router.push('/game');
    };

    const openSettings = () => {
        console.log("Opening settings...");
    };

    const exitGame = () => {
        console.log("Exiting the game...");
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', backgroundColor: colors.background, color: colors.text }}>
            <GameTitle>Game</GameTitle>
            <MenuButton text="Start Game" onClick={startGame} />
            <MenuButton text="Settings" onClick={openSettings} />
            <MenuButton text="Exit" onClick={exitGame} />
        </div>
    );
};

export default StartMenu;
