"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const PlayerStyled = styled.div`
  width: 50px;
  height: 50px;
  background-color: red;
  position: absolute;
  bottom: 10px;
  left: ${(props: { left: number }) => `${props.left}px`};
  transition: left 0.1s;
`;

const Player: React.FC = () => {
  const [position, setPosition] = useState(0);

  // Handle keydown event for movement
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setPosition((prev) => Math.max(prev - 10, 0));
    } else if (e.key === 'ArrowRight') {
      setPosition((prev) => Math.min(prev + 10, window.innerWidth - 50));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <PlayerStyled left={position} />;
};

export default Player;
