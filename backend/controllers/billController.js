const Bill = require('../models/Bill');
const Room = require('../models/Room');
const Tenant = require('../models/Tenant');

// Lấy tất cả hóa đơn
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate('room tenant');
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy hóa đơn theo ID
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('room tenant');
    if (!bill) return res.status(404).json({ message: 'Hóa đơn không tồn tại' });
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Tạo hóa đơn mới
exports.createBill = async (req, res) => {
  try {
    const { room, tenant, electricity, water, roomPrice } = req.body;

    // Kiểm tra phòng và khách thuê
    const roomData = await Room.findById(room);
    if (!roomData) return res.status(404).json({ message: 'Phòng không tồn tại' });
    const tenantData = await Tenant.findById(tenant);
    if (!tenantData) return res.status(404).json({ message: 'Khách thuê không tồn tại' });

    // Tính tổng tiền
    const total = electricity + water + roomPrice;

    // Tạo hóa đơn
    const bill = new Bill({ room, tenant, electricity, water, roomPrice, total });
    await bill.save();

    res.status(201).json(bill);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
  }
};

// Sửa hóa đơn
exports.updateBill = async (req, res) => {
  try {
    const { room, tenant, electricity, water, roomPrice, status } = req.body;

    // Kiểm tra phòng và khách thuê
    if (room) {
      const roomData = await Room.findById(room);
      if (!roomData) return res.status(404).json({ message: 'Phòng không tồn tại' });
    }
    if (tenant) {
      const tenantData = await Tenant.findById(tenant);
      if (!tenantData) return res.status(404).json({ message: 'Khách thuê không tồn tại' });
    }

    // Tính lại tổng tiền nếu có thay đổi
    const total = electricity + water + roomPrice;

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      { room, tenant, electricity, water, roomPrice, total, status },
      { new: true }
    );
    if (!updatedBill) return res.status(404).json({ message: 'Hóa đơn không tồn tại' });
    res.status(200).json(updatedBill);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
  }
};

// Xóa hóa đơn
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Hóa đơn không tồn tại' });
    res.status(200).json({ message: 'Xóa hóa đơn thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};