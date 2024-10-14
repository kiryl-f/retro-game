"use client";


import "./globals.css";
import { Provider } from "react-redux";
import store from "./redux/store";

import { IBM_Plex_Mono } from "next/font/google";

import { Caveat } from "next/font/google";

const IBMPlexMonoBold = IBM_Plex_Mono({
  // src: "./fonts/IBMPlexMono-Bold.ttf"
  variable: "--font-ibm-plex-mono",
  weight: ['700'],
  subsets: ['latin']
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${IBMPlexMonoBold.variable}`}>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
