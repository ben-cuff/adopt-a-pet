const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Welcome to my API");
});

app.get("/hello-world", (req, res) => {
	res.send("Hello, World!");
});

app.get("/hello-pet", (req, res) => {
	res.send("Hello, Pet");
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
