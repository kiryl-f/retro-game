"use client";

import React from 'react';
import Game from './game/game';
import MenuButton from './components/menu_button';
import StartMenu from './components/start_menu';
import { NextPage } from 'next';
import { Provider } from 'react-redux';
import store from './redux/store';

const HomePage: NextPage = () => {
  return (
    <Provider store={store}>
      <>
        <StartMenu />
        {/* <Game /> */}
      </>
    </Provider>

  );
};

export default HomePage;
