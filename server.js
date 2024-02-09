const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const router = require('./routes/router');

require('./config/db');
const port = 8080;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Add the following middleware
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

app.use("/",router);

app.get('/', (req, res) => {
  res.status(201).json('server created');
});

app.listen(port, () => {
  console.log(`listening on port no: ${port}`);
});
