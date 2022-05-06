const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	// if have cookies and then if we do have cookies we're also checking to see if there is a jwt property
	// or if we do not exist then we're going to return something here and we're going to return (401)
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) return res.sendStatus(403); // Forbidden

	// evaluate jwt
	jwt.verify(refreshToken, process.env.RERFESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.username !== decoded.username)
			return res.sendStatus(403);
		const roles = Object.values(foundUser.roles);
		const accessToken = jwt.sign(
			{ UserInfo: { username: decoded.username, roles: roles } },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' } // your can set 5 minutes or 15 minutes
		);
		res.json({ accessToken });
	});
};

module.exports = { handleRefreshToken };
