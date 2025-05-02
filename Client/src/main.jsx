import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

import './index.css'
import './assets/bootstrap-5.3.3-dist/css/bootstrap.min.css'
import './assets/bootstrap-5.3.3-dist/js/bootstrap.bundle.js'
import App from './App.jsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

 const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    </Provider> 
)
