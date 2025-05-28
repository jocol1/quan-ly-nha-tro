const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Lấy tất cả phòng
router.get('/', roomController.getAllRooms);

// Lấy phòng theo ID
router.get('/:id', roomController.getRoomById);

// Thêm phòng mới
router.post('/', roomController.createRoom);

// Cập nhật thông tin phòng
router.put('/:id', roomController.updateRoom);

// Xóa phòng
router.delete('/:id', roomController.deleteRoom);

module.exports = router;