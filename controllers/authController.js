const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data;
	},
};

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		return res.status(400).json({ message: 'User name and password are required.' });

	const foundUser = usersDB.users.find((person) => person.usename === user);
	if (!foundUser) return res.sendStatus(401); // Unauthorized
	// evaluate password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
		// create JWTs
		const accessToken = jwt.sign(
			{ username: foundUser.usename },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' } // 5 - 30 minutes
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.usename },
			process.env.RERFESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);
		// Saving refreshToken with current user
		const otherUsers = usersDB.users.filter((person) => person.usename !== foundUser.usename);
		const currentUsers = { ...foundUser, refreshToken };
		usersDB.setUsers([...otherUsers, currentUsers]);
		await fsPromises.writeFile(
			path.join(__dirname, '..', 'model', 'users.json'),
			JSON.stringify(usersDB.users)
		);
		res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // one day
		res.json({ accessToken });
	} else {
		res.sendStatus(401);
	}
};

module.exports = { handleLogin };