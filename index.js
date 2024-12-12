const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const collection = require('./config');
const { name } = require('ejs');

const app = express();

// Convert data into JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as view engine
app.set('view engine', 'ejs');

// Static file
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    // Check if the user already exists in database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        return res.send("User already exists! Please choose a different username.");
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashPassword; // Replace the original password with hashed password

        const userdata = await collection.insertMany([data]); // insertMany expects an array
        console.log(userdata);

        

        
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });

        if (!check) {
             res.send("Username not found!");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("home");
        } else {
            res.send("Wrong password!");
        }

    } catch (error) {
        res.send("Wrong details!");
    }
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
