import userModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user?.id).select('role');
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Administrator access is required.' });
    }
    req.admin = user;
    next();
  } catch (error) {
    console.error('Admin authorization failed:', error.message);
    res.status(500).json({ success: false, message: 'Unable to authorize this request.' });
  }
};

export default adminAuth;
