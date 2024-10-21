'use client';
import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    html
    body {
        padding: 0;
        margin: 0;
        width: 100%;
        height:100%
        
    }
    button {
        cursor: pointer;
        border: none;
        
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
`
