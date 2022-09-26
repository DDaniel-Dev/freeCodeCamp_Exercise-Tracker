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
let mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
