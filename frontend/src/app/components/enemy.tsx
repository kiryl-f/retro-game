"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const EnemyStyled = styled.div`
  width: 50px;
  height: 50px;
  background-color: blue;
  position: absolute;
  top: ${(props: { top: number }) => `${props.top}px`};
  left: ${(props: { left: number }) => `${props.left}px`};
`;

interface Props {
  playerPosition: number;
}

const Enemy: React.FC<Props> = ({ playerPosition }) => {
  const [position, setPosition] = useState({ top: 0, left: Math.random() * window.innerWidth });

  const checkCollision = () => {
    const playerWidth = 50;
    if (position.top > 450 && position.left >= playerPosition && position.left <= playerPosition + playerWidth) {
      alert("Collision!");
      setPosition({ top: 0, left: Math.random() * window.innerWidth });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        const newTop = prev.top + 5;
        if (newTop > window.innerHeight) {
          return { top: 0, left: Math.random() * window.innerWidth };
        }
        return { ...prev, top: newTop };
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkCollision();
  }, [position, playerPosition]);

  return <EnemyStyled top={position.top} left={position.left} />;
};

export default Enemy;
