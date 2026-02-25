const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    // So sánh trực tiếp vì mật khẩu giờ là text thuần
    if (user.password !== password) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    res.json({
      message: 'Đăng nhập thành công',
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
