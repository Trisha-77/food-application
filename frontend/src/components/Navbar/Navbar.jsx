import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from './../../assets/assets';
import {Link, NavLink, useNavigate} from 'react-router-dom'
import { StoreContext } from './../context/StoreContext';

const Navbar = () => {

  const [mobileOpen, setMobileOpen] = useState(false);

  const {getCartItemCount, token, user, logout: clearSession} = useContext(StoreContext);

  const navigate = useNavigate();

  const handleLogout = () =>{
    clearSession();
    navigate("/")
  }

  return (
    <header className='navbar'>
       <Link to='/home' className='brand'><span>●</span> Savoury</Link>
       <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation" aria-expanded={mobileOpen}>☰</button>
        <nav className={`navbar-menu ${mobileOpen ? 'open' : ''}`} aria-label="Primary navigation">
            <NavLink to='/home' onClick={() => setMobileOpen(false)}>Home</NavLink>
            <NavLink to='/menu' onClick={() => setMobileOpen(false)}>Menu</NavLink>
            {token && <NavLink to='/orders' onClick={() => setMobileOpen(false)}>Orders</NavLink>}
        </nav>
        <div className="navbar-right">
            <div className="navbar-search-icon">
                <Link to='/menu' className="nav-icon" aria-label="Search menu">⌕</Link>
            </div>
            <div className="navbar-search-icon">
                <Link to='/cart' className="nav-icon cart-link" aria-label={`Cart with ${getCartItemCount()} items`}>🛒<span>{getCartItemCount()}</span></Link>
            </div>
            {!token?<div className="auth-links"><button onClick={()=> navigate('/login')}>Login</button><Link to="/signup">Sign Up</Link></div>
            :<div className='navbar-profile'>
              <button className="profile-button" aria-label="Open profile menu">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</button>
              <ul className="nav-profile-dropdown">
                <li onClick={()=> navigate('/profile')}><span>Profile</span><p>{user?.name || 'Account'}</p></li>
                <li onClick={()=> navigate('/orders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                <hr />  
                <li onClick={handleLogout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
              </ul>
            </div>
            }
              </div>
    </header>
  )
}

export default Navbar
