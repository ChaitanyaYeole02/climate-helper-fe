import { ThemeProvider, createTheme } from '@mui/material/styles'

import { COLORSCALES } from '../config'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import Head from 'next/head'
import React from 'react'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#66bb6a', // Earth Helper green
    },
    secondary: {
      main: '#388e3c',
    },
    background: {
      default: '#f1f8e9',
    },
  },
});

export const globalStyles = {
  td: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: 200,
  },
  '.dialog-content': {
    fontSize: '0.9rem',
  },
}

const App = ({ Component, pageProps }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles styles={globalStyles} />
    <Head>
      <link rel="shortcut icon" href="/images/favicon.ico" />
    </Head>
    <Component {...pageProps} />
  </ThemeProvider>
)

export default App
