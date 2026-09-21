import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { currency, statusClass } from '../../utils/format';
export default function Dashboard({ url, token }) {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  const load = async () => { setError(''); try { const response = await axios.get(`${url}/api/admin/dashboard`, {headers:{token}}); setData(response.data.data); } catch (err) { setError(err.response?.data?.message || 'Unable to load dashboard data.'); } };
  useEffect(() => { load(); }, []);
  if (error) return <section className="state-card"><h2>{error}</h2><button className="primary-btn" onClick={load}>Try again</button></section>;
  if (!data) return <section className="state-card">Loading dashboard…</section>;
  const cards = [{label:'Total orders',value:data.totals.orders,icon:'◫'},{label:'Paid revenue',value:currency(data.totals.revenue),icon:'$'},{label:'Food items',value:data.totals.foodItems,icon:'⌑'},{label:'Customers',value:data.totals.users,icon:'◉'}];
  return <div className="dashboard"><div className="page-intro"><div><h2>Overview</h2><p>A live snapshot of your food delivery operation.</p></div><Link className="primary-btn" to="/foods/new">+ Add food item</Link></div><div className="metric-grid">{cards.map((card)=><article className="metric-card" key={card.label}><span>{card.icon}</span><p>{card.label}</p><h3>{card.value}</h3></article>)}</div><section className="panel"><div className="panel-head"><div><h2>Recent orders</h2><p>Latest customer activity.</p></div><Link to="/orders">View all orders →</Link></div>{data.recentOrders.length ? <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead><tbody>{data.recentOrders.map((order)=><tr key={order._id}><td>#{order._id.slice(-6).toUpperCase()}</td><td>{[order.address?.firstName,order.address?.lastName].filter(Boolean).join(' ') || 'Customer'}</td><td>{order.items?.length || 0} item(s)</td><td>{currency(order.amount)}</td><td><span className={statusClass(order.status)}>{order.status}</span></td></tr>)}</tbody></table></div> : <div className="empty-inline">No orders have been placed yet.</div>}</section></div>;
}
