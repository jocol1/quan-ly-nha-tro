const Tenant = require('../models/Tenant');
const Room = require('../models/Room');

exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().populate('room');
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate('room');
    if (!tenant) return res.status(404).json({ message: 'Khách thuê không tồn tại' });
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

exports.createTenant = async (req, res) => {
  try {
    const { room, name, phone, moveInDate, citizenId, email } = req.body;
    console.log('Dữ liệu nhận từ frontend:', { room, name, phone, moveInDate, citizenId, email });

    if (!room || !name || !phone || !moveInDate || !citizenId) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: room, name, phone, moveInDate, citizenId' });
    }

    const roomData = await Room.findById(room);
    if (!roomData) return res.status(404).json({ message: 'Phòng không tồn tại' });
    if (roomData.status === 'occupied') return res.status(400).json({ message: 'Phòng đã có người thuê' });

    const moveInDateObj = new Date(moveInDate);
    if (isNaN(moveInDateObj.getTime())) {
      return res.status(400).json({ message: 'Ngày moveInDate không hợp lệ' });
    }

    const tenant = new Tenant({ name, phone, citizenId, room, moveInDate: moveInDateObj, email, waterBill: 0, isPaid: false });
    await tenant.save();

    roomData.status = 'occupied';
    roomData.tenant = tenant._id; // Gán _id của tenant
    await roomData.save();

    res.status(201).json(tenant);
  } catch (error) {
    console.error('Lỗi khi tạo tenant:', error);
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
};
exports.updateTenant = async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { room, oldMeterReading, newMeterReading, totalCost, isPaid, ...rest } = req.body;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: 'Khách thuê không tồn tại' });

    if (room) {
      const roomData = await Room.findById(room);
      if (!roomData) return res.status(404).json({ message: 'Phòng không tồn tại' });
      if (roomData.status === 'occupied' && tenant.room.toString() !== room) {
        return res.status(400).json({ message: 'Phòng đã có người thuê' });
      }

      if (tenant.room.toString() !== room) {
        const oldRoom = await Room.findById(tenant.room);
        if (oldRoom) {
          oldRoom.status = 'vacant';
          oldRoom.tenant = null; // Sử dụng null thay vì undefined
          await oldRoom.save();
        }
        roomData.status = 'occupied';
        roomData.tenant = tenant._id;
        await roomData.save();
      }
    }

    const updateData = {
      ...rest,
      oldMeterReading,
      newMeterReading,
      totalCost,
      isPaid: isPaid !== undefined ? isPaid : tenant.isPaid,
    };

    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { $set: updateData, room },
      { new: true, runValidators: true }
    );

    const roomData = await Room.findById(updatedTenant.room);
    if (roomData) {
      const waterBill = (roomData.bathrooms + roomData.showerRooms) * 10000;
      updatedTenant.waterBill = waterBill;
      await updatedTenant.save();
    }

    res.status(200).json(updatedTenant);
  } catch (error) {
    console.error('Lỗi khi cập nhật tenant:', error);
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    console.log('CitizenId received:', req.params.citizenId);
    const tenant = await Tenant.findOne({ citizenId: req.params.citizenId });
    console.log('Tenant found:', tenant);
    if (!tenant) return res.status(404).json({ message: 'Khách thuê không tồn tại' });

    if (!tenant.room) {
      console.log('Tenant has no room assigned');
      await Tenant.deleteOne({ citizenId: req.params.citizenId });
      return res.status(200).json({ message: 'Xóa khách thuê thành công (không có phòng liên kết)' });
    }

    const room = await Room.findById(tenant.room);
    console.log('Room found:', room);
    if (room) {
      room.status = 'vacant';
      room.tenant = null; // Sử dụng null thay vì undefined
      await room.save();
      console.log('Room updated:', room);
    } else {
      console.log('Room not found for tenant.room:', tenant.room);
    }

    await Tenant.deleteOne({ citizenId: req.params.citizenId });
    console.log('Tenant deleted successfully');

    res.status(200).json({ message: 'Xóa khách thuê thành công' });
  } catch (error) {
    console.error('Error in deleteTenant:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message, stack: error.stack });
  }
};

exports.updateTenantByCitizenId = async (req, res) => {
  try {
    const citizenId = req.params.citizenId;
    const { oldMeterReading, newMeterReading, totalCost, isPaid, ...rest } = req.body;

    const tenant = await Tenant.findOne({ citizenId });
    if (!tenant) return res.status(404).json({ message: 'Khách thuê không tồn tại' });

    if (req.body.room) {
      const roomData = await Room.findById(req.body.room);
      if (!roomData) return res.status(404).json({ message: 'Phòng không tồn tại' });
      if (roomData.status === 'occupied' && tenant.room.toString() !== req.body.room) {
        return res.status(400).json({ message: 'Phòng đã có người thuê' });
      }

      if (tenant.room.toString() !== req.body.room) {
        const oldRoom = await Room.findById(tenant.room);
        if (oldRoom) {
          oldRoom.status = 'vacant';
          oldRoom.tenant = null; // Sử dụng null
          await oldRoom.save();
        }
        roomData.status = 'occupied';
        roomData.tenant = tenant._id; // Gán _id của tenant
        await roomData.save();
      }
    }

    const updateData = {
      ...rest,
      oldMeterReading,
      newMeterReading,
      totalCost,
      isPaid: isPaid !== undefined ? isPaid : tenant.isPaid,
    };

    const updatedTenant = await Tenant.findOneAndUpdate(
      { citizenId },
      { $set: updateData, room: req.body.room },
      { new: true, runValidators: true }
    );

    const roomData = await Room.findById(updatedTenant.room);
    if (roomData) {
      const waterBill = (roomData.bathrooms + roomData.showerRooms) * 10000;
      updatedTenant.waterBill = waterBill;
      await updatedTenant.save();
    }

    res.status(200).json(updatedTenant);
  } catch (error) {
    console.error('Lỗi khi cập nhật tenant:', error);
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
};