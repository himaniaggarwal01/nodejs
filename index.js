require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
var multer  = require('multer')
mongoose.connect(mongoString);
const database = mongoose.connection;
const cors = require('cors');

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(express.json());

const routes = require('./routes/routes');

app.use('/api', routes)
app.use(cors());
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})