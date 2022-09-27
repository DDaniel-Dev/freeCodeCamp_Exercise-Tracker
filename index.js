// -- http://localhost:3000/ -- //

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/* Connect MongoDB */
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

/* Create User Schema */
const userSchema = new Schema({
  username: {
    type: String,
    require: true
  }
});

const User = mongoose.model("User", userSchema);


/* Check MongoDb Connection Status */
app.get("/mongo-status", (req, res) => {
  res.json({ status: mongoose.connection.readyState });
      /* MongoDB 'status:
            0: disconnected;
            1: connected;
            2: connecting;
            3: disconnecting; */
});

app.route("/api/users")
  // -- POST request to /api/users with form data username to create new users; includes _id -- //
  .post((req, res) => {
    const username = req.body.username
    const user = new User({ username })
    user.save((err, data) => {
      if (err) {
        res.json({ error: err})
      } else {
        res.json(data)
      };
    })
  })
  // -- GET request to /api/users to return an array with username and _id -- //
  .get((req, res) => {
    User.find((err, data) => {
      if (err) {
        res.json({ error: err })
      } else {
        res.json(data)
      }
    })
  })



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
