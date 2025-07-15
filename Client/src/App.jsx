import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './App.css';
import Layout from './layouts/Layout'; 
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './Components/ErrorFallback';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const Signup = lazy(() => import('./Components/Signup'));
const Login = lazy(() => import('./Components/Login'));
const Home = lazy(() => import('./Pages/Home'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const browserRouter = createBrowserRouter([

  
  {
    path: "/",
    element: (
      
        <Layout />
     
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
              <Suspense fallback={<div>Loading Home...</div>}>
                <Home />
              </Suspense>
            </ErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
              <Suspense fallback={<div>Loading Dashboard...</div>}>
                <Dashboard />
              </Suspense>
            </ErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
            <Suspense fallback={<div>Loading Signup...</div>}>
              <Signup />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: "login",
        element: (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
            <Suspense fallback={<div>Loading Login...</div>}>
              <Login />
            </Suspense>
          </ErrorBoundary>
        ),
      },
    ],
  },

]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={browserRouter} />
    </AuthProvider>
  );
}

export default App;
