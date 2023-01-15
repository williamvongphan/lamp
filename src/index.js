const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const util = require('./util/index.js');
const ejs = require('ejs');
const mongoose = require('mongoose');
const appRoutes = require('./routes/app/index.js');
const apiRoutes = require('./routes/api/index.js');
const config = require('./config/config.json');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');
const User = require('./models/User');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: util.random.bytes(64).toString('hex'),
	resave: false,
	saveUninitialized: false
}));
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Connect the app to the database using mongoose and set the database connection to the app
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
app.set('db', mongoose.connection);

// Configure passport to use the local strategy
passport.use(new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password'
	},
	async (username, password, done) => {
		let user = await User.findOne({ username: username });
		if (!user) {
			return done(null, false, { message: 'Incorrect username or password.' });
		}
		let match = await util.password.compare(password, user.passwordHash);
		if (!match) {
			return done(null, false, { message: 'Incorrect username or password.' });
		}
		return done(null, user);
	}
));


// Configure express-session to use connect-mongo to store session data in the database
const sessionStore = MongoStore.create({
	mongoUrl: config.mongoURI,
	collection: 'sessions',
	ttl: 60 * 60 * 24 * 7 // 1 week
});

// Configure passport to serialize and deserialize users
passport.serializeUser(async (user, done) => {
	let userObj = await User.findOne({ username: user.username });
	done(null, userObj._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

// Middleware to make passport available in the app
app.use(passport.initialize());

// Load all routes
apiRoutes(app, path.join(__dirname, 'routes', 'api'));
appRoutes(app, path.join(__dirname, 'routes', 'app'));

// Run the app
app.listen(config.port, () => {
	console.log(`App listening on port ${config.port}`);
});