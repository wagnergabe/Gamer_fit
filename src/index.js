const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const { name } = require('ejs');

require('dotenv').config();

const port = process.env.PORT || 3000;
const URI = process.env.URI;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use(express.static("public"));


app.get("/", (req, res) => {
    
    res.render("home")
});

app.get("/workouts", (req, res) => {
    res.render("workouts")
});

app.get("/chest", (req, res) => {
    res.render("chest")
});

app.get("/signup", (req, res) => {
    res.render("signup")
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.post("/signup", async (req, res) => {
    
    const data = {
        name: req.body.username,
        password: req.body.password
    
    }

    const existingUser = await collection.findOne({name: data.name})

    if(existingUser) {
        return res.send("User already exists")
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

    const userdata = await collection.insertMany(data);
    console.log(userdata)
    }
})

app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check) {
            res.send("user name not found")
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("home", { name: req.body.username})
        }
    }catch{
        res.send("wrong Details")
    }
})




app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

