const fs = require("fs");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

console.log(process.env.CLIENT_ID); // remove this after you've confirmed it is working
console.log(process.env.CLIENT_SECRET); // remove this after you've confirmed it is working

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
};

const PORT = 3000;
const app = express();

app.use(helmet());

function checkLoggedIn(req, res, next) {
	const isLoggedIn = true; // TODO

	if (!isLoggedIn) {
		return res.status(401).json({
			error: "You must log in!",
		});
	}

	next();
}

app.get("/auth/google", (req, res) => {});

app.get("/auth/google/callback", (req, res) => {});

app.get("/auth/logout", (req, res) => {});

app.get("/", checkLoggedIn, (req, res) => {
	const frontEndFile = path.join(__dirname, "/public/index.html");
	return res.status(200).sendFile(frontEndFile);
});

app.get("/secret", checkLoggedIn, (req, res) => {
	return res.status(200).send("<h1>Your secret is 85</h1>");
});

https
	.createServer(
		{ key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") },
		app
	)
	.listen(PORT, (req, res) => {
		console.log(`app is running at ${PORT}`);
	});
