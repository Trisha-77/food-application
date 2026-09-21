import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Foods from './pages/Foods/Foods';
import FoodForm from './pages/Foods/FoodForm';
import Orders from './pages/Orders/Orders';
import Users from './pages/Users/Users';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
import Shell from './components/Shell/Shell';

const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App() {
  const [session, setSession] = useState(() => { try { return JSON.parse(localStorage.getItem('savoury_admin_session')) || null; } catch { return null; } });
  const login = (nextSession) => { localStorage.setItem('savoury_admin_session', JSON.stringify(nextSession)); setSession(nextSession); };
  const logout = () => { localStorage.removeItem('savoury_admin_session'); setSession(null); };
  const protectedPage = (element) => session ? <Shell session={session} logout={logout}>{element}</Shell> : <Navigate to="/login" replace />;
  return <><ToastContainer position="top-right" autoClose={3000} theme="light" /><Routes>
    <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login url={url} login={login} />} />
    <Route path="/dashboard" element={protectedPage(<Dashboard url={url} token={session?.token} />)} />
    <Route path="/foods" element={protectedPage(<Foods url={url} token={session?.token} />)} />
    <Route path="/foods/new" element={protectedPage(<FoodForm url={url} token={session?.token} />)} />
    <Route path="/foods/:id/edit" element={protectedPage(<FoodForm url={url} token={session?.token} />)} />
    <Route path="/orders" element={protectedPage(<Orders url={url} token={session?.token} />)} />
    <Route path="/users" element={protectedPage(<Users url={url} token={session?.token} />)} />
    <Route path="/analytics" element={protectedPage(<Analytics url={url} token={session?.token} />)} />
    <Route path="/settings" element={protectedPage(<Settings session={session} />)} />
    <Route path="*" element={<Navigate to={session ? '/dashboard' : '/login'} replace />} />
  </Routes></>;
}
