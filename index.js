// -- http://localhost:3000/ -- //

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
require('dotenv').config()


// Schemas //
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


// Models //
const UserInfo = mongoose.model("userInfo", userSchema);
const ExerciseInfo = mongoose.model("exerciseInfo", exerciseSchema);
const LogInfo = mongoose.model("logInfo", logSchema);


// Config & Check Connection//
const mongodb_URL = process.env.MONGO_URL;
mongoose.connect(mongodb_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}, 
  () => {
    if (mongoose.connection.readyState == 0) {
      console.log("Connection status: (0)...  DISCONNECTED to MongoDB.")
    } else if (mongoose.connection.readyState == 1) {
      console.log("Connection status: (1)...  CONNECTED to MongoDB.")
    } else if (mongoose.connection.readyState == 2) {
      console.log("Connection status: (2)...  CONNECTING to MongoDB)")
    } else if (mongoose.connection.readyState == 3) {
      console.log("Connection status: (3)...  DISCONNECTING to MongoDb)")
    } else {
      console.log("Connection status: (99)...  UNINITIALIZED MongoDB)")
    }
  }
);



// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Api Endpoints //

  // #1. POST request creating new username, and response with objects username & _id
app.post("/api/users", (req, res) => {
  UserInfo.find({ "username": req.body.username }, (err, userData) => {
    if (err) {
      console.log("Error with server => ", err)
    } else {
      if (userData.length === 0) {
        const test = new UserInfo({
          "_id": req.body.id,
          "username": req.body.username,
        })

        test.save((err, data) => {
          if (err) {
            console.log("Error saving data => ", err)
          } else {
            res.json({
              "_id": data.id,
              "username": data.username,
            })
          }
        })
      } else {
        res.send("Username already Exists")
      }
    }
  })
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is hosting on port ' + listener.address().port)
})