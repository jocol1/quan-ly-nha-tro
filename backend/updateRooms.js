const mongoose = require('mongoose');
const Room = require('./models/Room');

mongoose.connect('mongodb://localhost:27017/quanlynhatro', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateRooms = async () => {
  try {
    // Cập nhật các bản ghi thiếu price
    await Room.updateMany(
      { price: { $exists: false } },
      { $set: { price: 3000000 } }
    );
    // Cập nhật các bản ghi thiếu floor
    await Room.updateMany(
      { floor: { $exists: false } },
      { $set: { floor: 1 } }
    );
    console.log('Updated rooms with price and floor fields');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

updateRooms();