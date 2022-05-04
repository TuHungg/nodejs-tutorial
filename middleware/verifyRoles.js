const verifyRoles = (...allowedRoles) => {
	return (req, res, next) => {
		// if do not have request which we should our verified jwt will come before this
		// optional chaining,
		// if we do have  a request, it need to have roles or this should not be valid and if it's not valid
		if (!req?.roles) return res.sendStatus(401);
		const rolesArray = [...allowedRoles];
		console.log(rolesArray);
		console.log(req.roles);
		const result = req.roles
			.map((role) => rolesArray.includes(role))
			.find((val) => val === true);
		if (!result) return res.sendStatus(401);
		next();
	};
};

module.exports = verifyRoles;
