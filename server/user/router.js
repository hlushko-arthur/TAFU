const User = require('./schema');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const nJwt = require('njwt');
module.exports = async waw => {
	if (!waw.config.signingKey) {
		waw.config.signingKey = uuidv4();

		let serverJson = waw.readJson(process.cwd() + '/server.json');

		serverJson.signingKey = waw.config.signingKey;

		waw.writeJson(process.cwd() + '/server.json', serverJson);
	}

	// initialize
	if (waw.config.mail) {
		const nodemailer = require("nodemailer");

		let transporter = nodemailer.createTransport({
			host: waw.config.mail.host,
			port: waw.config.mail.port,
			secure: waw.config.mail.secure,
			auth: waw.config.mail.auth
		});

		waw.send = (opts, cb = resp => { }) => {
			transporter.sendMail({
				from: waw.config.mail.from,
				subject: opts.subject || waw.config.mail.subject,
				to: opts.to,
				text: opts.text,
				html: opts.html
			}, cb);
		}
	} else {
		waw.send = () => { }
	}

	if (mongoose.connection.readyState == 0) {
		mongoose.connect(waw.mongoUrl, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true
		});

		mongoose.Promise = global.Promise;
	}

	/*
	*	Set is on users from config
	*/
	const set_is = async (email, is) => {
		const user = await User.findOne({
			email: email
		});

		if (!user) return;

		if (!user.is) user.is = {};

		user.is[is] = true;

		user.markModified('is');

		user.save((err) => {
			if (err) console.log(err);
		});
	}

	if (waw.config.user && waw.config.user.is) {
		for (const is in waw.config.user.is) {
			const emails = waw.config.user.is[is].split(' ');

			for (var i = 0; i < emails.length; i++) {
				set_is(emails[i], is);
			}
		}
	}

	/*
	*	Initialize User and Mongoose
	*/
	const router = waw.router('/api/user');
	const findUser = async (email) => {
		return await User.findOne({
			$or: [{
				reg_email: email.toLowerCase()
			}, {
				email: email.toLowerCase()
			}]
		});
	}

	router.post("/status", async (req, res) => {
		const user = await findUser(req.body.email);

		const json = {};

		json.email = !!user;

		if (user && req.body.password) {
			json.pass = user.validPassword(req.body.password);
		}

		res.json(json);
	});

	const new_pin = async (user, cb = () => { }) => {
		user.resetPin = Math.floor(Math.random() * (999999 - 100000)) + 100000;

		console.log(user.resetPin);

		user.markModified('data');

		await user.save();

		waw.send({
			to: user.email,
			subject: 'Code: ' + user.resetPin,
			html: 'Code: ' + user.resetPin
		}, cb);
	}

	router.post("/request", async (req, res) => {
		const user = await findUser(req.body.email);

		if (user) {
			new_pin(user);
		}

		res.json(true);
	});

	router.post("/change", async (req, res) => {
		const user = await findUser(req.body.email);

		if (user && user.resetPin === req.body.pin) {
			user.password = user.generateHash(req.body.password);

			delete user.resetPin;

			await user.save();

			res.json(true);
		} else if (user) {
			new_pin(user, () => {
				res.json(false);
			});
		}
	});

	router.post("/changePassword", waw.ensure, async (req, res) => {
		const user = await User.findOne({ _id: req.user._id });

		if (user.validPassword(req.body.oldPass)) {
			user.password = user.generateHash(req.body.newPass);

			await user.save();

			res.json(true);
		} else {
			res.json(false);
		}
	});

	// waw.use((req, res, next) => {
	// 	if (req.headers.token) {
	// 		nJwt.verify(
	// 			req.headers.token,
	// 			waw.config.signingKey,
	// 			(err, verifiedJwt) => {
	// 				if (err) {
	// 					res.set('remove', 'token');
	// 					res.set('Access-Control-Expose-Headers', 'field')
	// 					next();
	// 				} else {
	// 					req.user = verifiedJwt.body;
	// 					next();
	// 				}
	// 			}
	// 		);
	// 	} else next();
	// });

	const clearUser = user => {
		user = JSON.parse(JSON.stringify(user));

		delete user.password;

		delete user.resetPin;

		user.token = nJwt.create(user, waw.config.signingKey);

		user.token.setExpiration(new Date().getTime() + (48 * 60 * 60 * 1000));

		user.token = user.token.compact();

		return user;
	}

	router.post('/login', async (req, res) => {
		const user = await findUser(req.body.email);

		if (!user || !user.validPassword(req.body.password)) {
			return res.json(false);
		}

		res.json(clearUser(user));
	});

	router.post('/sign', async (req, res) => {
		const userExists = await findUser(req.body.email);

		if (userExists) {
			return res.json(false);
		}

		const user = new User({
			email: req.body.email.toLowerCase(),
			fullName: req.body.fullName,
			speciality: req.body.speciality
		});

		user.password = user.generateHash(req.body.password);

		await user.save();

		res.json(clearUser(user));
	});

	router.get('/get', async (req, res) => {
		console.log(isAuthorize(req, res));
		if (!isAuthorize(req, res)) {
			return res.status(401).json({ status: false, message: 'Invalid token' })
		}
		try {
			const users = await User.find().select('-password -email -__v');

			res.status(200).json({ status: true, data: users });
		} catch (error) {
			res.status(500).json({ status: 500, error: error });
		}
	})

	const isAuthorize = (req, res) => {
		if (!req.headers.authorization) {
			return false;
		}

		try {
			nJwt.verify(req.headers.authorization, waw.config.signingKey);
			return true;
		} catch (error) {
			return false;
		}
	}
};
