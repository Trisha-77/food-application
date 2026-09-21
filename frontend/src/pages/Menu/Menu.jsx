import { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../components/context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import './Menu.css';

export default function Menu() {
  const { food_list, foodStatus, fetchFoodList } = useContext(StoreContext);
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState('recommended');
  const search = params.get('search') || '';
  const category = params.get('category') || 'All';
  const categories = useMemo(() => [...new Set(food_list.map((food) => food.category).filter(Boolean))], [food_list]);
  const updateParams = (changes) => { const next = new URLSearchParams(params); Object.entries(changes).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key)); setParams(next); };
  const foods = useMemo(() => { const query = search.trim().toLowerCase(); const matching = food_list.filter((food) => (category === 'All' || food.category === category) && (!query || [food.name, food.description, food.category].some((value) => value?.toLowerCase().includes(query)))); return [...matching].sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name) : 0); }, [food_list, search, category, sort]);
  useEffect(() => { setSort('recommended'); }, [search, category]);
  const clear = () => { setSort('recommended'); setParams({}); };
  return <main className="menu-page"><header className="menu-header"><p className="section-kicker">SAVOURY MENU</p><h1>Explore Our Menu</h1><p>Find something delicious for every craving.</p></header><section className="menu-controls" aria-label="Menu filters"><div className="menu-search"><label className="sr-only" htmlFor="menu-search">Search dishes</label><input id="menu-search" value={search} onChange={(event) => updateParams({ search: event.target.value })} placeholder="Search dishes..." /></div><label className="sort-select">Sort <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="name">Name: A-Z</option></select></label></section><section className="category-filters" aria-label="Filter menu by category"><button className={category === 'All' ? 'selected' : ''} onClick={() => updateParams({ category: '' })}>All</button>{categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => updateParams({ category: item })}>{item}</button>)}</section><section className="menu-results"><div className="results-heading"><p>{foodStatus === 'success' ? `${foods.length} dish${foods.length === 1 ? '' : 'es'} to explore` : 'Loading menu'}</p>{(search || category !== 'All') && <button onClick={clear}>Clear Filters</button>}</div>{foodStatus === 'loading' && <div className="food-grid skeleton-grid">{Array.from({ length: 8 }, (_, index) => <div className="food-skeleton" key={index} />)}</div>}{foodStatus === 'error' && <div className="state-card"><h2>Unable to load menu right now.</h2><button onClick={fetchFoodList}>Try Again</button></div>}{foodStatus === 'success' && foods.length === 0 && <div className="state-card"><h2>No dishes found</h2><p>Try another search or category.</p><button onClick={clear}>Clear Filters</button></div>}{foodStatus === 'success' && foods.length > 0 && <div className="food-grid">{foods.map((food) => <FoodItem key={food._id} {...food} />)}</div>}</section></main>;
}
