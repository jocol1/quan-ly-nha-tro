const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  citizenId: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: false },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  moveInDate: { type: Date, required: true },
  oldMeterReading: { type: Number, default: 0 },
  newMeterReading: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false }
});

module.exports = mongoose.model('Tenant', tenantSchema);