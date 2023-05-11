const fs = require("fs");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const cookieSession = require("cookie-session");

require("dotenv").config();

const PORT = 3000;

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
	COOKIE_KEY_1: process.env.COOKIE_KEY_1,
	COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
	callbackURL: `/auth/google/callback`,
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log("user profile: ", profile);
	done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

const app = express();

app.use(helmet());
app.use(
	cookieSession({
		name: "session",
		maxAge: 24 * 60 * 60 * 1000,
		keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
	})
);
app.use(passport.initialize()); // initialize passport middleware, sets up passport session

function checkLoggedIn(req, res, next) {
	const isLoggedIn = true; // TODO

	if (!isLoggedIn) {
		return res.status(401).json({
			error: "You must log in!",
		});
	}

	next();
}

app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["email"], // which data is requested if request is successful
	})
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/auth/failure",
		successRedirect: "/",
		session: false,
	}),
	(req, res) => {
		console.log("Google called us back!");
	}
);

app.get("/auth/logout", (req, res) => {});

app.get("/", checkLoggedIn, (req, res) => {
	const frontEndFile = path.join(__dirname, "/public/index.html");
	return res.status(200).sendFile(frontEndFile);
});

app.get("/secret", checkLoggedIn, (req, res) => {
	return res.status(200).send("<h1>Your secret is 85</h1>");
});

app.get("/failure", checkLoggedIn, (req, res) => {
	return res.send("<h1>Failed to login </h1>");
});

https
	.createServer(
		{ key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") },
		app
	)
	.listen(PORT, (req, res) => {
		console.log(`app is running at ${PORT}`);
	});
