const fs = require("fs");
const https = require("https");
const express = require("express");
const helmet = require("helmet");

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
	return res.status(200).send({ status: 200, message: "Hello from HTTPS" });
});

https
	.createServer(
		{ key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") },
		app
	)
	.listen(PORT, (req, res) => {
		console.log(`app is running at ${PORT}`);
	});
