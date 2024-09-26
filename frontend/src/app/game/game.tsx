"use client";

import React, { useState } from 'react';
import Player from '../components/player';
import Enemy from '../components/enemy';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  background: black;
  overflow: hidden;
`;

const Game: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState(0);

  const updatePlayerPosition = (newPosition: number) => {
    setPlayerPosition(newPosition);
  };

  return (
    <GameContainer>
      <Player onPositionChange={updatePlayerPosition} />
      <Enemy playerPosition={playerPosition} />
    </GameContainer>
  );
};

export default Game;
