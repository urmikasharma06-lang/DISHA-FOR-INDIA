const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

// Admin routes – protect with Admin or Super Admin role
router.post('/', authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), categoryController.create);
router.get('/', categoryController.list);
router.get('/:id', categoryController.get);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), categoryController.update);
router.delete('/:id', authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), categoryController.delete);

module.exports = router;
