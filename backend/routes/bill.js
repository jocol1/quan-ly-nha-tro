const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// API cho hóa đơn
router.get('/', billController.getAllBills); // Lấy tất cả hóa đơn
router.get('/:id', billController.getBillById); // Lấy hóa đơn theo ID
router.post('/', billController.createBill); // Tạo hóa đơn mới
router.put('/:id', billController.updateBill); // Sửa hóa đơn
router.delete('/:id', billController.deleteBill); // Xóa hóa đơn

module.exports = router;