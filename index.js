// -- http://localhost:3000/ -- //

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/* Connect MongoDB */
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});


/* Check MongoDb Connection Status */
app.get("/mongo-status", (req, res) => {
  res.json({ status: mongoose.connection.readyState });
      /* MongoDB 'status:
            0: disconnected;
            1: connected;
            2: connecting;
            3: disconnecting; */
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
