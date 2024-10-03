const express = require('express');
require('dotenv').config();
const PDF = require('./server/api/pdf');

const PORT = '5000';
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = async (data) => {
    res.send = oldSend; // set function back to avoid the 'double-send'
    const { statusCode } = res;
    return res.status(statusCode).send(data);
  };

  next();
});

// Route middlewares
app.use('/api/pdf', PDF);

app.listen(PORT, () => {
  console.log(['Info'], `Server started on port ${PORT}`);
});
