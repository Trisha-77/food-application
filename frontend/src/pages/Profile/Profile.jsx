import { useContext } from 'react';
import { StoreContext } from '../../components/context/StoreContext';
import './Profile.css';

export default function Profile() {
  const { user } = useContext(StoreContext);
  return <section className="profile-page"><p className="profile-kicker">YOUR ACCOUNT</p><h1>Profile</h1><div className="profile-card"><div className="avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div><div><h2>{user?.name || 'Savoury guest'}</h2><p>{user?.email || 'Your account details are available after signing in.'}</p><span>{user?.role || 'user'}</span></div></div></section>;
}
