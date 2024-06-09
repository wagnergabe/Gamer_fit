const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

const URI = process.env.URI;

async function connect() {
    try {
        await mongoose.connect(URI);
        console.log("Connected to the database")
    } catch (error) {
        console.error(error)
    }
}

connect()

const LoginSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = new mongoose.model('users', LoginSchema)

module.exports = collection