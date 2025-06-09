const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { NotFoundError } = require("./middleware/custom-errors");

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
	if (err instanceof ValidationError) {
		return res.status(err.statusCode).json({ error: err.message });
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		// Handle common Prisma errors (e.g., unique constraint violation)
		if (err.code === "P2002") {
			return res
				.status(400)
				.json({ error: "A unique constraint violation occurred." });
		}
	} else if (err instanceof NotFoundError) {
		return res.status(err.statusCode).json({ error: err.message });
	}

	res.status(500).json({ error: "Internal Server Error" });
});

app.get("/", (req, res) => {
	res.send("Welcome to my API");
});

app.get("/hello-world", (req, res) => {
	res.send("Hello, World!");
});

app.get("/hello-pet", (req, res) => {
	res.send("Hello, Pet");
});

app.get("/pet", async (req, res) => {
	const pets = await prisma.Pet.findMany();
	res.status(200).json(pets);
});

app.get("/pet/:petId", async (req, res) => {
	const { petId } = req.params;
	const pet = await prisma.Pet.findUnique({ where: { id: Number(petId) } });

	if (pet) {
		res.status(200).json(pet);
	} else {
		res.status(404).json({ error: "No pet with that ID found" });
	}
});

app.post("/pet", async (req, res) => {
	const { name, type, breed, age, description } = req.body;

	if (!name || !type || !breed || age === undefined) {
		return res.status(400).json({
			error: "Missing required fields: name, type, breed, and age are required",
		});
	}

	if (
		typeof name !== "string" ||
		typeof type !== "string" ||
		typeof breed !== "string" ||
		(typeof description !== "undefined" &&
			typeof description !== "string") ||
		typeof age !== "number"
	) {
		return res.status(400).json({
			error: "Invalid field types: name, type, and breed must be strings, age must be a number, and description (if provided) must be a string",
		});
	}

	const newPet = await prisma.Pet.create({
		data: { name, type, breed, age, description },
	});

	res.status(201).json(newPet);
});

app.put("/pet/:petId", async (req, res) => {
	const { petId } = req.params;

	if (Object.keys(req.body).length === 0) {
		return res.status(400).json({ error: "No data provided for update" });
	}

	const { name, type, breed, age, description } = req.body;

	if (name && typeof name !== "string") {
		return res
			.status(400)
			.json({ error: "Invalid type for name; expected string" });
	}
	if (type && typeof type !== "string") {
		return res
			.status(400)
			.json({ error: "Invalid type for type; expected string" });
	}
	if (breed && typeof breed !== "string") {
		return res
			.status(400)
			.json({ error: "Invalid type for breed; expected string" });
	}
	if (age && typeof age !== "number") {
		return res
			.status(400)
			.json({ error: "Invalid type for age; expected number" });
	}
	if (description && typeof description !== "string") {
		return res
			.status(400)
			.json({ error: "Invalid type for description; expected string" });
	}

	try {
		const updatedPet = await prisma.Pet.update({
			where: { id: Number(petId) },
			data: req.body,
		});
		res.status(200).json(updatedPet);
	} catch (error) {
		res.status(404).json({ error: "No pet with that ID found" });
	}
});

app.delete("/pet/:petId", async (req, res) => {
	const { petId } = req.params;

	const deletedPet = await prisma.Pet.delete({
		where: { id: Number(petId) },
	});

	res.status(200).json(deletedPet);
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
