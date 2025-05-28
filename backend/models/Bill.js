const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  electricity: { type: Number, required: true },
  water: { type: Number, required: true },
  roomPrice: { type: Number, required: true },
  total: { type: Number, required: true },
});

module.exports = mongoose.model('Bill', billSchema);