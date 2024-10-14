import React from "react";
import styled from "styled-components";
import { colors } from "../color";

import localFont from "next/font/local";


const myFont = localFont({src: '../fonts/IBMPlexMono-Bold.ttf'});

const Button = styled.div`

    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

    width: 30%;
    text-align: center;
    margin-top: 5.5vh;

    font-family: "IBM Plex Mono", monospace;
    font-weight: 700;
    font-size: 32px;   
    text-transform: uppercase;

    cursor: pointer;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    background-color: ${colors.primaryButton};
    color: ${colors.text};
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;

    border: solid 0.125rem #ffffff;
    box-shadow: 0.25rem 0.25rem #ffffff;

    transition: transform 50ms, box-shadow 50ms;

    &:active {
        transform: translate(0.125rem, 0.125rem); /* Fixed the syntax here */
        box-shadow: 0.125rem 0.125rem #121212;
    }

    &:hover {
        box-shadow: 0.15rem 0.15rem #ffffff;
    }
`;

interface MenuButtonProps {
    text: string;
    onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ text, onClick }) => {
    return (
        <Button onClick={onClick}>
            {text}
        </Button>
    );
};

export default MenuButton;
