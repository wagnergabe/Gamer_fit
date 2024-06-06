const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
require('dotenv').config();

const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("login")
});

app.get("/signup", (req, res) => {
    res.render("signup")

})

app.post("/signup", async (req, res) => {
    
    const data = {
        name: req.body.username,
        password: req.body.password
    
    }
    const userdata = await collection.insertMany(data);
    console.log(userdata)
})


// async function connect() {
//     try {
//         await mongoose.connect(uri);
//         console.log("Connected to the database")
//     } catch (error) {
//         console.error(error)
//     }
// }

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
