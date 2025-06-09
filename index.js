const express = require("express");

const app = express();

app.use(express.json());

let pets = [
	{
		id: 1,
		name: "Buddy",
		type: "dog",
		breed: "Golden Retriever",
		age: 3,
		description: "A friendly and energetic dog.",
	},
	{
		id: 2,
		name: "Whiskers",
		type: "cat",
		breed: "Siamese",
		age: 2,
		description: "A curious cat who loves to explore.",
	},
	{
		id: 3,
		name: "Tweety",
		type: "bird",
		breed: "Canary",
		age: 1,
		description: "A small bird with a big personality.",
	},
];

app.get("/", (req, res) => {
	res.send("Welcome to my API");
});

app.get("/hello-world", (req, res) => {
	res.send("Hello, World!");
});

app.get("/hello-pet", (req, res) => {
	res.send("Hello, Pet");
});

app.get("/pet", (req, res) => {
	res.status(200).json(pets);
});

app.get("/pet/:petId", (req, res) => {
	const { petId } = req.params;
	const pet = pets.find((pet) => pet.id == petId);

	if (pet) {
		res.status(200).json(pet);
	} else {
		res.status(404).json({ error: "No pet with that ID found" });
	}
});

app.post("/pet", (req, res) => {
	const { name, type, breed, age, description } = req.body;

	const newPet = {
		id: pets.length + 1,
		name,
		type,
		breed,
		age,
		description,
	};

	pets.push(newPet);

	res.status(201).json(newPet);
});

app.put("/pet/:petId", (req, res) => {
	const { petId } = req.params;

	const petIndex = pets.findIndex((pet) => pet.id == parseInt(petId));

	if (petIndex !== -1) {
		const updatedPetBody = req.body;
		pets[petIndex] = { ...pets[petIndex], ...updatedPetBody };
		res.status(200).json(pets[petIndex]);
	} else {
		res.status(404).json({ error: "No pet with that ID found" });
	}
});

app.delete("/pet/:petId", (req, res) => {
	const { petId } = req.params;

	const initLength = pets.length;
	pets = pets.filter((pet) => pet.id === petId);

	if (pets.length < initLength) {
		res.status(204).send();
	} else {
		res.status(404).json({ error: "No pet with that ID found" });
	}
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
