const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("login")
});

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
