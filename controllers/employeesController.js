const data = {
	employess: require("../model/employees.json"),
	setEmployess: function (data) {
		this.employess = data;
	},
};

const getAllEmployees = (req, res) => {
	res.json(data.employess);
};

const createEmployees = (req, res) => {
	const newEmployees = {
		id: data.employess[data.employess.length - 1].id + 1 || 1,
		name: req.body.name,
		age: req.body.age,
	};

	if (!newEmployees.name || !newEmployees.age) {
		return res.status(400).json({ message: "Name and age are required." });
	}

	data.setEmployess([...data.employess, newEmployees]);
	res.status(201).json(data.employess);
};

const updateEmployees = (req, res) => {
	const employees = data.employess.find((emp) => emp.id === parseInt(req.body.id));
	if (!employees) {
		return res.status(400).json({ message: `Employee Id ${req.body.id} not found!` });
	}
	if (req.body.name) employees.name = req.body.name;
	if (req.body.age) employees.age = req.body.age;
	const filteredArray = data.employess.filter((emp) => emp.id !== parseInt(req.body.id));
	const unsortedArray = [...filteredArray, employees];
	data.setEmployess(unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)));
	res.json(data.employess);
};

const deleteEmplyees = (req, res) => {
	const employees = data.employess.find((emp) => emp.id === parseInt(req.body.id));
	if (!employees) {
		return res.status(400).json({ message: `Employee Id ${req.body.id} not found!` });
	}
	const filteredArray = data.employess.filter((emp) => emp.id !== parseInt(req.body.id));
	data.setEmployess([...filteredArray]);
	res.json(data.employess);
};

const getEmployees = (req, res) => {
	const employees = data.employess.find((emp) => emp.id === parseInt(req.body.id));
	if (!employees) {
		return res.status(400).json({ message: `Employee Id ${req.body.id} not found!` });
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
