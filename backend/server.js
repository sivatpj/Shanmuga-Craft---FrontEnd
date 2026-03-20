require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const contact    = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/contact', contact);

app.listen(PORT, () =>
  console.log(` Shanmuga Craft API running on http://localhost:${PORT}`)
);