const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  floor: { type: Number, required: true },
  status: { type: String, enum: ['occupied', 'vacant'], default: 'vacant' },
  price: { type: Number, required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }, // Thay đổi thành tham chiếu
  bathrooms: { type: Number, default: 1 },
  showerRooms: { type: Number, default: 1 },
});

module.exports = mongoose.model('Room', roomSchema);