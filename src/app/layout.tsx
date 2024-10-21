// src/app/(page)/restaurant/layout.tsx 또는 src/app/layout.tsx
"use client"
import React from 'react';
import Header from 'src/app/components/common/Header';
import ModalWishlist from './modal/ModalWishlist';
import GlobalProvider from './GlobalProvider';

import '@/styles/styles.scss'



export default function RootLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>NyamNyam</title>
        <meta name="author" content="Templines" />
        <meta name="description" content="TeamHost" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Favicon */}
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />

        {/* Styles */}
        <link rel="stylesheet" href="/assets/css/libs.min.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet" />
      </head>
      <body>
      {/* <SearchProvider>
          <WishlistProvider>
            <ModalWishlistProvider>
              <Header />  
              <ModalWishlist />
              <main style={{ padding: '5%', overflow: 'hidden' }}>{children}</main>
            </ModalWishlistProvider>
          </WishlistProvider>
        </SearchProvider> */}
      <GlobalProvider>
        <Header />
        <main style={{ padding: '5%', overflow: 'hidden' }}>{children}</main>
        <ModalWishlist />
      </GlobalProvider>
      </body>
      </html>
  );
}