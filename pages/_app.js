import { ThemeProvider, createTheme } from '@mui/material/styles'

import { COLORSCALES } from '../config'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import Head from 'next/head'
import React from 'react'

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORSCALES.theme[2],
    },
    secondary: {
      main: COLORSCALES.theme[3],
      contrastText: COLORSCALES.theme[1],
    },
    defaultPrimary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
  },
})

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
