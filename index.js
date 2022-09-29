// -- http://localhost:3000/ -- //

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
require('dotenv').config()


// Schemas
const { Schema } = require('mongoose');

const userSchema = new Schema({
  "username": String,
});

const exerciseSchema = new Schema({
  "username": String,
  "description": String,
  "duration": Number,
  "date": Date,
});

const logSchema = new Schema({
  "username": String,
  "count": Number,
  "log": Array,
});



// Models
const UserInfo = mongoose.model("userInfo", userSchema);
const ExerciseInfo = mongoose.model("exerciseInfo", exerciseSchema);
const LogInfo = mongoose.model("logInfo", logSchema);






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})