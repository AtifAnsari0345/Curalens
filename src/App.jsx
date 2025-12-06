import { Route, Navigate, Outlet, Routes } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Scan from './pages/Scan'
import Login from './pages/Login'
import Register from './pages/Register'
import DrugInteraction from './pages/DrugInteraction'
import { AppProvider, useAppContext } from './store/AppContext'
import { AuthProvider } from './store/AuthContext'
import { NotificationProvider } from './store/NotificationContext'
import useAuthContext from './hooks/useAuthContext'
import { useToast } from './components/Toast'
import './styles/toast.css'
import { useEffect } from 'react'

// Protected route component
function ProtectedRoute({ children }) {
  const { isAuthenticated, token, loading } = useAuthContext();
  
  // Show loading state or wait for auth check to complete
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  // Check both isAuthenticated flag and token existence
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public route component - redirects to dashboard if already authenticated
function PublicRoute({ children }) {
  const { isAuthenticated, token, loading } = useAuthContext();
  
  // Show loading state or wait for auth check to complete
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function Layout() {
  const { elderlyMode } = useAppContext();
  
  return (
    <div className={`app ${elderlyMode ? 'elderly-on' : ''}`}>
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

function AppWithProvider() {
  const { ToastContainer } = useToast();
  
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route element={<Layout />}>
          <Route path="/drug-interaction" element={
            <ProtectedRoute>
              <DrugInteraction />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/scan" element={
            <ProtectedRoute>
              <Scan />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}

function App() {
  useEffect(() => {
    // Check for stored theme preference
    const storedElderlyMode = localStorage.getItem('elderlyMode');
    if (storedElderlyMode === 'true') {
      // Apply elderly mode on app initialization if previously enabled
      document.body.classList.add('elderly-on');
    }
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <NotificationProvider>
          <AppWithProvider />
        </NotificationProvider>
      </AppProvider>
    </AuthProvider>
  )
}



export default App