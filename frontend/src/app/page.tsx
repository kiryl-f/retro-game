"use client";

import React from 'react';
import Game from './game/game';
import MenuButton from './components/menu_button';
import StartMenu from './components/start_menu';
import { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <>
     <StartMenu/>
     {/* <Game /> */}
    </>
    
  );
};

export default HomePage;
