const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeaders = req.get('Authorization');
	if (!authHeaders) {
		const error = new Error('Authorization header is not provied');
		error.statusCode = 401;
		throw error;
	}
	const token = authHeaders.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, 'thisissupersecretsecret');
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}

	// if unable to verify token
	if (!decodedToken) {
		const error = new Error('not authenticated');
		error.statusCode = 401;
		throw error;
	}

	req.userId = decodedToken.userId;
	next();
};
