const express = require('express');
const session = require('express-session');
// const session = require('cookie-session');
const MongoDbSession = require('connect-mongodb-session')(session);
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();
const UserModel = require('./models/User');

const port = process.env.PORT || 3000;
const URI = process.env.URI;
const app = express();

/*Connect to Mongoose */
mongoose.connect(process.env.URI, { 
})
.then((res) => {
    console.log("Connected to Database")
});


const store = new MongoDbSession({
    uri: URI,
    collection: 'sessions'
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));



app.use(
    session({
    secret: 'secrecookie',
    resave: false,
    saveUninitialized: false,
    store: store,
}))

const isAuth = (req, res, next) => {
if(req.session.isAuth) {
    next();
} else {
    res.redirect("/login")
}
}

app.get("/", isAuth, (req, res) => {
    res.render("home")
});

// app.get("/home", isAuth, (req, res) => {
//     res.render("home")
// });

app.get("/workouts", isAuth, (req, res) => {
    res.render("workouts")
});

app.get("/chest", isAuth, (req, res) => {
    res.render("chest")
});

app.get("/arms", isAuth, (req, res) => {
    res.render("arms")
});

app.get("/back", isAuth, (req, res) => {
    res.render("back")
});

app.get("/legs", isAuth, (req, res) => {
    res.render("legs")
});

app.get("/shoulders", isAuth, (req, res) => {
    res.render("shoulders")
});

app.get("/nutrition", isAuth, (req, res) => {    
    res.render("nutrition")
});

app.get("/signup", (req, res) => {
    res.render("signup")
});

app.get("/login", (req, res) => {
    res.render("login")
});



app.post("/signup", async (req, res) => {
    
    // const data = {
    //     name: req.body.username,
    //     password: req.body.password
    
    // }

    const { username, password } = req.body;

    const user= await UserModel.findOne({username})

    if(user) {
        return res.redirect("/signup")
    } 
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    

    const userdata = new UserModel({
        name: username,
        password: hashedPassword
    })

    UserModel.insertMany(userdata)
    
   
    res.redirect("/")
})

app.post("/login", async (req, res) => {
    try{
        const check = await UserModel.findOne({name: req.body.username});
        if(!check) {
            return res.redirect("/login")
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            req.session.isAuth = true;
            res.render("home", { name: req.body.username})
        } else {
            res.redirect("login")
            req.session.authorized = false;
        }
    }catch{
        res.send("Something went wrong")
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/")
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

