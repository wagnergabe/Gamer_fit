const express = require('express');
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session);
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const UserModel = require('./models/User');

mongoose.connect(process.env.URI, 
    { 
})
.then((res) => {
    console.log("Connected to Database")
});

const port = process.env.PORT || 3000;
const URI = process.env.URI;

const app = express();

const store = new MongoDbSession({
    uri: URI,
    collection: 'mysessions'
})

console.log(store)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

if (proecess.env.NODE_ENV === 'production') { 
    app.set(express.static(path.join(__dirname, 'client/build')))
    app.getMaxListeners('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    })

}

app.use(
    session({
    secret: 'secrecookie',
    resave: false,
    saveUninitialized: false,
}))

const isAuth = (req, res, next) => {
if(req.session.authorized === true) {
    next();
} else {
    res.redirect("login")
}
}

app.get("/", (req, res) => {
    res.render("home")
});

app.get("/workouts", isAuth, (req, res) => {
    res.render("workouts")
});

app.get("/chest", isAuth, (req, res) => {
    res.render("chest")
});

app.get("/arms", isAuth, (req, res) => {
    res.render("arms")
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

    const user= await UserModel.findOne({name: data.name})

    if(user) {
        return res.redirect("signup")
    } 
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

    const userdata = await UserModel.insertMany(data);
    
   
    res.redirect("login")
})

app.post("/login", async (req, res) => {
    try{
        const check = await UserModel.findOne({name: req.body.username});
        if(!check) {
            return res.redirect("login")
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            req.session.authorized = true;
            res.render("home", { name: req.body.username})
        } else {
            res.redirect("login")
            req.session.authorized = false;
        }
    }catch{
        res.send("wrong Details")
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('login')
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

