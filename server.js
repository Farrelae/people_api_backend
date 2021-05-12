// ----- Dependenices -----

// get dotenv variables
require("dotenv").config()
// pull PORT from env
const { PORT = 3000, MONGODB_URL } = process.env
// import express
const express = require("express")
// our express app object
const app = express()
// Import Mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors")
const morgan = require("morgan")

// ----- Database Connections

// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are not connected to Mongo"))
.on("error", () => console.log(error))

// ----- Models -----
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema)

// ----- Middleware -----
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

// ------ Routes ------

// test route
app.get("/", (req, res) => {
    res.send("Hello World")
})

// People Index Route
app.get("/people", async (req, res) => {
    try{
        res.json(await People.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// People Create Route

app.post("/people", async (req, res) => {
    try{
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// People Update Route 
app.put("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error){
        res.status(400).json(error)
    }
})

// People Delete Route
app.delete("/people/:id", async (req, res) => {
  try {
    res.json(await People.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

// ----- Listener -----
app.listen(PORT, () => console.log(`listening on ${PORT}`)) 