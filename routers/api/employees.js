const express = require('express');
const router = express.Router();
const path = require('path');
const employeesController = require('../../controllers/employeesController');
const verifyJWT = require('../../middleware/verifyJWT');

router
	.route('/')
	.get(verifyJWT, employeesController.getAllEmployees)
	.post(employeesController.createEmployees)
	.put(employeesController.updateEmployees)
	.delete(employeesController.deleteEmplyees);

router.route('/:id').get(employeesController.getEmployees);

module.exports = router;
