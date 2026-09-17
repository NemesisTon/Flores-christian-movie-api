const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname)));

const movies = [
    { id: 1, title: "Inception",       genre: "Sci-Fi",    year: 2010 },
    { id: 2, title: "The Godfather",   genre: "Crime",     year: 1972 },
    { id: 3, title: "Parasite",        genre: "Thriller",  year: 2019 }
];

let nextId = 4;

app.get("/api/movies", (req, res) => {
    res.json(movies);
});

app.get("/api/movies/:id", (req, res) => {
    const id = Number(req.params.id);
    const movie = movies.find(m => m.id === id);

    if (!movie) {
        return res.status(404).json({
            message: "Movie not found"
        });
    }

    res.json(movie);
});

app.post("/api/movies", (req, res) => {
    const { title, genre, year } = req.body;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!genre) missingFields.push("genre");
    if (!year)  missingFields.push("year");

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Missing required fields",
            missing: missingFields
        });
    }

    const yearNumber = Number(year);
    if (isNaN(yearNumber)) {
        return res.status(400).json({
            message: "Year must be a valid number"
        });
    }

    const newMovie = {
        id: nextId++,
        title: String(title).trim(),
        genre: String(genre).trim(),
        year: yearNumber
    };

    movies.push(newMovie);

    res.status(201).json({
        message: "Movie added successfully",
        movie: newMovie
    });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});