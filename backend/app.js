const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // cho phép nhận JSON từ client

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nha-tro', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// Route
app.use('/api/tenants', require('./routes/tenant')); // bạn đã viết sẵn routes/tenant.js
app.use('/api/rooms', require('./routes/room'));     // nếu bạn có routes phòng

// Trang test
app.get('/', (req, res) => {
  res.send('Server đang chạy...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
