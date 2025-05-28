const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

// API cho khách thuê
router.get('/', tenantController.getAllTenants);          // Lấy tất cả khách thuê
router.get('/:id', tenantController.getTenantById);       // Lấy khách thuê theo ID
router.post('/', tenantController.createTenant);          // Thêm khách thuê mới
router.put('/:id', tenantController.updateTenant);        // Sửa thông tin khách thuê
router.delete('/citizen/:citizenId', tenantController.deleteTenant); // Xóa khách thuê theo citizenId

// Thêm route mới để cập nhật tenant bằng citizenId
router.put('/citizenId/:citizenId', tenantController.updateTenantByCitizenId);
module.exports = router;