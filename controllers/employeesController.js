const Employee = require('../model/Employees');

const getAllEmployees = async (req, res) => {
	const employees = await Employee.find();
	if (!employees)
		return res.status(204).json({ message: 'Not employees found.' });
	res.json(employees);
};

const createEmployees = async (req, res) => {
	if (!req?.body?.firstname || !req?.body?.lastname) {
		return res
			.status(400)
			.json({ message: 'First and Last names are required.' });
	}

	try {
		const result = await Employee.create({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
		});

		res.status(201).json(result);
	} catch (err) {
		console.error(err);
	}
};

const updateEmployees = async (req, res) => {
	if (!req?.body?.id) {
		return res.status(400).json({ employees: 'Id parameter is required.' });
	}

	const employees = await Employee.findOne({ _id: req.body.id }).exec();

	if (!employees) {
		return res
			.status(400)
			.json({ message: `Employee Id ${req.body.id} not found!` });
	}
	if (req.body?.firstname) employees.firstname = req.body.firstname;
	if (req.body?.lastname) employees.lastname = req.body.lastname;

	const result = await employees.save();
	res.json(result);
};

const deleteEmplyees = async (req, res) => {
	if (!req?.body?.id)
		return res.status(400).json({ message: 'Employess Id required' });

	const employees = await Employee.findOne({ _id: req.body.id }).exec();
	if (!employees) {
		return res
			.status(400)
			.json({ message: `Employee Id ${req.body.id} not found!` });
	}

	const result = await employees.deleteOne({ _id: req.body.id });

	res.json(result);
};

const getEmployees = async (req, res) => {
	if (!req?.params?.id)
		return res.status(400).json({ message: 'Employees ID required.' });

	const employees = await Employee.findOne({ _id: req.params.id }).exec();

	if (!employees) {
		return res
			.status(400)
			.json({ message: `Employee Id ${req.params.id} not found!` });
	}

	res.json(employees);
};

module.exports = {
	getAllEmployees,
	createEmployees,
	updateEmployees,
	deleteEmplyees,
	getEmployees,
};
