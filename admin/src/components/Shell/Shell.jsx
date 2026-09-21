import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Shell.css';

const nav = [{ to:'/dashboard', icon:'▦', label:'Dashboard' }, { to:'/foods', icon:'⌑', label:'Food items' }, { to:'/orders', icon:'◫', label:'Orders' }, { to:'/users', icon:'◉', label:'Users' }, { to:'/analytics', icon:'⌁', label:'Analytics' }, { to:'/settings', icon:'⚙', label:'Settings' }];
const titles = { '/dashboard':'Dashboard', '/foods':'Food items', '/orders':'Orders', '/users':'Users', '/analytics':'Analytics', '/settings':'Settings' };

export default function Shell({ session, logout, children }) {
  const [open, setOpen] = useState(false); const location = useLocation(); const navigate = useNavigate();
  const title = location.pathname.includes('/foods/') ? (location.pathname.endsWith('/new') ? 'Add food item' : 'Edit food item') : titles[location.pathname] || 'Admin portal';
  const initials = session.user?.name?.split(' ').map((word) => word[0]).join('').slice(0,2).toUpperCase() || 'AD';
  const signOut = () => { logout(); navigate('/login'); };
  return <div className="admin-shell"><aside className={`admin-sidebar ${open ? 'open' : ''}`}><div className="brand"><span className="brand-mark">S</span><div><b>Savoury</b><small>ADMIN PORTAL</small></div></div><nav>{nav.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({isActive}) => `nav-item ${isActive || (item.to === '/foods' && location.pathname.startsWith('/foods')) ? 'active' : ''}`}><span>{item.icon}</span>{item.label}</NavLink>)}</nav><button className="signout" onClick={signOut}><span>↪</span>Logout</button></aside>{open && <button className="drawer-backdrop" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    <div className="admin-main"><header className="admin-header"><button className="menu-toggle" onClick={() => setOpen(true)} aria-label="Open navigation">☰</button><div><p className="breadcrumb">SAVOURY / ADMIN</p><h1>{title}</h1></div><div className="admin-user"><button className="notification" aria-label="Notifications">◌</button><div className="avatar">{initials}</div><div className="user-name"><b>{session.user?.name || 'Administrator'}</b><small>Administrator</small></div></div></header><main className="admin-content">{children}</main></div></div>;
}
