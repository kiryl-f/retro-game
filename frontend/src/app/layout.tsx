"use client";


import "./globals.css";
import { Provider } from "react-redux";
import store from "./redux/store";

import { Press_Start_2P } from "next/font/google";


const PressStart2P = Press_Start_2P({
  // src: "./fonts/IBMPlexMono-Bold.ttf"
  variable: "--font-press-start",
  weight: ['400'],
  subsets: ['latin']
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${PressStart2P.variable}`}>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
