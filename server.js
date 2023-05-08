const fs = require("fs");
const https = require("https");
const express = require("express");

const PORT = 8000;
const app = express();

app.get("/", (req, res) => {
	return res.status(200).json({ status: 200, message: "Hello from HTTPS" });
});

https
	.createServer(
		{ key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") },
		app
	)
	.listen(PORT, (req, res) => {
		console.log(`app is running at ${PORT}`);
	});
