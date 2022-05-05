require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const { logger } = require('./middleware/logEvent');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3000; // PORT

// Connect to MongoDB
connectDB();

app.use(logger); // custom middleware logger

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// buil-in middleware to handle urlencoded form data
app.use(express.urlencoded({ exntended: false }));

// build-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// server static file
app.use('/', express.static(path.join(__dirname, '/public')));

// set-up routers
app.use('/', require('./routers/root'));
app.use('/register', require('./routers/register'));
app.use('/auth', require('./routers/auth'));
app.use('/refresh', require('./routers/refresh'));
app.use('/logout', require('./routers/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routers/api/employees'));

// app.get('/')
app.get('*', (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ error: '404 Not Found' });
	} else {
		res.type('txt').send('404 Not Found');
	}
});

app.use(errorHandler); // custom 404

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT, () => console.log(`server running on port -> ${PORT}`));
});
