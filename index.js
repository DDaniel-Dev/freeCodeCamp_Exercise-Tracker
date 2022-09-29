// -- http://localhost:3000/ -- //

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
require('dotenv').config()


// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


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


// Api Endpoints //

  /* -- #1. POST request creating new username, 
          and response with Objects username & _id -- */
app.post("/api/users", (req, res) => {
  UserInfo.find({ "username": req.body.username }, (err, userData) => {
    if (err) {
      console.log("Error with server => ", err)
    } else {
      if (userData.length === 0) {
        const test = new UserInfo({
          "username": req.body.username,
          "_id": req.body.id,
        })

        test.save((err, data) => {
          if (err) {
            console.log("Error saving data => ", err)
          } else {
            res.json({
              "username": data.username,
              "_id": data.id,
            })
          }
        })
      } else {
        res.send("Username already Exists")
      }
    }
  })
});


  /* -- #2. GET request to list ALL available Users data -- */ 
  app.get('/api/users', (req, res) => {
    UserInfo.find({}, (err, data) => {
      if (err) {
        res.send("No Users");
      } else {
        res.json(data);
      }
    })
  })
  
  
  /* -- #3. POST request to update and return the User's exercises data -- */
  app.post('/api/users/:_id/exercises', (req, res) => {
    let idJson = { "id": req.params._id};
    let checkedDate = new Date(req.body.date);
    let idToCheck = idJson.id;
  
    let noDateHandler = () => {
      if (checkedDate instanceof Date && !isNaN(checkedDate)) {
        return checkedDate
      } else {
        checkedDate = new Date();
      }
    }
  
    UserInfo.findById(idToCheck, (err, data) => {
      noDateHandler(checkedDate);
  
      if (err) {
        console.log("error with id=> ", err);
      } else {
        const test = new ExerciseInfo({
          "username": data.username,
          "description": req.body.description,
          "duration": req.body.duration,
          "date": checkedDate.toDateString(),
        })
  
        test.save((err, data) => {
          if (err) {
            console.log("error saving=> ", err);
          } else {
            console.log("saved exercise successfully");
            res.json({
              "_id": idToCheck,
              "username": data.username,
              "description": data.description,
              "duration": data.duration,
              "date": data.date.toDateString(),
            })
          }
        })
      }
    })
  })



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is hosting on port ' + listener.address().port)
})