import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/app.tsx'
import { Provider } from 'react-redux'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { store } from '@modules/reducers/index.ts'
import { theme } from './theme.ts'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
        <CssBaseline/>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
