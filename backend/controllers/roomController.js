const Room = require('../models/Room');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate({
      path: 'tenant',
      select: 'name citizenId isPaid phone email moveInDate oldMeterReading newMeterReading totalCost'
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate({
      path: 'tenant',
      select: 'name citizenId isPaid phone email moveInDate oldMeterReading newMeterReading totalCost'
    });
    if (!room) return res.status(404).json({ message: 'Phòng không tồn tại' });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, floor, status, price, bathrooms, showerRooms } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!roomNumber || !floor || !price || !bathrooms || !showerRooms) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin: roomNumber, floor, price, bathrooms, showerRooms!' });
    }

    // Kiểm tra phòng đã tồn tại
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Số phòng đã tồn tại!' });
    }

    const room = new Room({
      roomNumber,
      floor: parseInt(floor),
      status: status || 'vacant',
      price: parseInt(price),
      bathrooms: parseInt(bathrooms),
      showerRooms: parseInt(showerRooms),
    });
    await room.save();

    res.status(201).json({ message: 'Thêm phòng thành công', room });
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { roomNumber, floor, status, price, bathrooms, showerRooms } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        roomNumber,
        floor: parseInt(floor),
        status,
        price: parseInt(price),
        bathrooms: parseInt(bathrooms),
        showerRooms: parseInt(showerRooms),
      },
      { new: true, runValidators: true }
    );
    if (!updatedRoom) return res.status(404).json({ message: 'Phòng không tồn tại' });
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('tenant');
    if (!room) return res.status(404).json({ message: 'Phòng không tồn tại' });

    // Kiểm tra nếu phòng có tenant liên kết
    if (room.tenant) {
      return res.status(400).json({ message: 'Phòng đang được sử dụng, vui lòng xóa tenant trước!' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Xóa phòng thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};