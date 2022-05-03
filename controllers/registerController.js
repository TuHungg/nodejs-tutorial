const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data;
	},
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		return res.status(400).json({ message: 'User name and password are required.' });

	// check for duplicate usernames in the db
	const duplicate = usersDB.users.find((person) => person.username === user);
	if (!duplicate) return res.sendStatus(409); // Conflict
	try {
		// encrypt the password
		const hashedPwd = await bcrypt.hash(pwd, 10);
		// store the new user
		const newUser = { usename: user, password: hashedPwd };
		// usersDB([...usersDB.users, newUser]); <-- error
		usersDB.setUsers([...usersDB.users, newUser]);
		await fsPromises.writeFile(
			path.join(__dirname, '..', 'model', 'users.json'),
			JSON.stringify(usersDB.users)
		);
		// show
		console.log(usersDB.users);
		res.status(200).json({ success: `New user ${user} create!` });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { handleNewUser };
