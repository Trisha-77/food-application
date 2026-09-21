import { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../components/context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import { assets } from '../../assets/assets';
import './Home.css';

export default function Home() {
  const { food_list, foodStatus, fetchFoodList } = useContext(StoreContext);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const categories = useMemo(() => [...new Set(food_list.map((food) => food.category).filter(Boolean))], [food_list]);
  const submitSearch = (event) => { event.preventDefault(); const query = search.trim(); navigate(query ? `/menu?search=${encodeURIComponent(query)}` : '/menu'); };
  return <main className="home-page">
    <section className="home-hero"><div className="home-hero-copy"><p className="section-kicker">SAVOURY, MADE SIMPLE</p><h1>Good food.<br /><em>Good mood.</em></h1><p>Discover delicious meals, order your favourites, and enjoy great food delivered to your doorstep.</p><div className="hero-actions"><Link className="button primary" to="/menu">Explore Menu</Link><a className="button secondary" href="#popular">View Popular Dishes</a></div></div><div className="home-hero-image"><img src={assets.header_img} alt="A vibrant spread of freshly prepared dishes" /></div></section>
    <section className="home-search"><div><p className="section-kicker">FIND YOUR CRAVING</p><h2>What are you hungry for?</h2></div><form onSubmit={submitSearch} role="search"><label className="sr-only" htmlFor="home-search">Search for dishes</label><input id="home-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for dishes..." /><button type="submit">Search menu</button></form></section>
    <section className="home-section"><div className="section-heading"><div><p className="section-kicker">BROWSE BY MOOD</p><h2>Popular categories</h2></div><Link to="/menu">See all menu →</Link></div>{foodStatus === 'loading' ? <div className="category-loading">Loading categories…</div> : <div className="category-row">{categories.map((category) => <Link key={category} className="category-pill" to={`/menu?category=${encodeURIComponent(category)}`}>{category}</Link>)}</div>}</section>
    <section className="home-section" id="popular"><div className="section-heading"><div><p className="section-kicker">CUSTOMER FAVOURITES</p><h2>Popular dishes</h2></div><Link to="/menu">View full menu →</Link></div>{foodStatus === 'loading' && <div className="food-grid skeleton-grid">{Array.from({ length: 4 }, (_, index) => <div className="food-skeleton" key={index} />)}</div>}{foodStatus === 'error' && <div className="state-card"><p>Unable to load menu right now.</p><button onClick={fetchFoodList}>Try Again</button></div>}{foodStatus === 'success' && <div className="food-grid">{food_list.slice(0, 4).map((food) => <FoodItem key={food._id} {...food} />)}</div>}</section>
    <section className="offer-section"><div><p className="section-kicker">YOUR TABLE IS WAITING</p><h2>Craving more?<br />Enjoy your favourites with Savoury.</h2><p>Browse the menu, add what you love, and keep your next meal delightfully simple.</p><Link className="button primary" to="/menu">Start exploring</Link></div><span className="offer-mark" aria-hidden="true">✦</span></section>
    <section className="home-section why-section"><p className="section-kicker">WHY SAVOURY</p><h2>Thoughtful food ordering</h2><div className="feature-grid"><article><span>01</span><h3>Fresh choices</h3><p>Explore a menu with clear descriptions and familiar favourites.</p></article><article><span>02</span><h3>Fast ordering</h3><p>Add dishes, adjust quantities, and review your cart in a few clicks.</p></article><article><span>03</span><h3>Secure payments</h3><p>Continue to the existing secure checkout flow when you are ready.</p></article><article><span>04</span><h3>Easy tracking</h3><p>Visit Orders to see the status of purchases you have placed.</p></article></div></section>
  </main>;
}
