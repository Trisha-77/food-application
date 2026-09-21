import React, { useContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import AuthPage from './pages/Auth/AuthPage'
import Profile from './pages/Profile/Profile'
import Menu from './pages/Menu/Menu'
import { StoreContext } from './components/context/StoreContext'

const SiteLayout = () => <><div className='app'><Navbar/><Outlet/></div><Footer/></>;

const ProtectedLayout = () => {
  const { isAuthenticated, authReady } = useContext(StoreContext);
  if (!authReady) return <div className="route-loading">Loading your table…</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet/>;
}

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<AuthPage initialMode="login"/>}/>
      <Route path='/login' element={<AuthPage initialMode="login"/>}/>
      <Route path='/signup' element={<AuthPage initialMode="signup"/>}/>
      <Route element={<SiteLayout/>}>
        <Route element={<ProtectedLayout/>}>
          <Route path='/home' element={<Home/>}/>
          <Route path='/menu' element={<Menu/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<PlaceOrder/>}/>
          <Route path='/verify' element={<Verify/>}/>
          <Route path='/orders' element={<MyOrders/>}/>
          <Route path='/myorders' element={<Navigate to="/orders" replace/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
      </Route>
      <Route path='*' element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}

export default App
