import orderModel from '../models/orderModel.js';
import foodModel from '../models/foodModel.js';
import userModel from '../models/userModel.js';

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, joinedAt: user.createdAt });

export const dashboard = async (req, res) => {
  try {
    const [orders, foodItems, users] = await Promise.all([
      orderModel.find({}).sort({ date: -1 }),
      foodModel.countDocuments(),
      userModel.countDocuments(),
    ]);
    const paidOrders = orders.filter((order) => order.payment);
    const revenue = paidOrders.reduce((total, order) => total + order.amount, 0);
    const statusCounts = orders.reduce((counts, order) => ({ ...counts, [order.status]: (counts[order.status] || 0) + 1 }), {});
    const popularItems = Object.values(orders.flatMap((order) => order.items || []).reduce((items, item) => {
      const key = String(item._id || item.name);
      const current = items[key] || { name: item.name, quantity: 0, revenue: 0 };
      current.quantity += Number(item.quantity) || 0;
      current.revenue += (Number(item.price) || 0) * (Number(item.quantity) || 0);
      items[key] = current;
      return items;
    }, {})).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    res.json({ success: true, data: { totals: { orders: orders.length, foodItems, users, revenue, paidOrders: paidOrders.length }, recentOrders: orders.slice(0, 5), statusCounts, popularItems } });
  } catch (error) {
    console.error('Dashboard failed:', error.message);
    res.status(500).json({ success: false, message: 'Unable to load dashboard data.' });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select('name email role createdAt').sort({ createdAt: -1 });
    res.json({ success: true, data: users.map(safeUser) });
  } catch (error) {
    console.error('User list failed:', error.message);
    res.status(500).json({ success: false, message: 'Unable to load users.' });
  }
};
