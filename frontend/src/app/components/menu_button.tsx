import React from "react";
import styled from "styled-components";
import { colors } from "../color";


const Button = styled.div`
    width: 30%;
    text-align: center;
    margin-top: 5.5vh;

    
    font-size: 32px;
    
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
