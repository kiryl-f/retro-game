"use client";

import React from "react";
import MenuButton from "./menu_button";
import { colors } from "../color";
import { useRouter } from "next/navigation";
import { NextPage } from "next";

import styled from "styled-components";


const GameTitle = styled.h1`
    font-weight: 700;
    font-size: 32px;   
    text-transform: uppercase;

    gravity: center;

`;


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
            <MenuButton text="START GAME" onClick={startGame} />
            <MenuButton text="SETTINGS" onClick={openSettings} />
            <MenuButton text="EXIT" onClick={exitGame} />
        </div>
    );
};

export default StartMenu;
