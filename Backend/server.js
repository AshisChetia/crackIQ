import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();

app.use(express.json())

connectDB();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Backend API is running")
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})