const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingItems');
const { NOT_FOUND } = require('./utils/errors');

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use((req, res, next) => {
  req.user = {
    _id: '69a8ce2114f80f5301a6b818',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/items', clothingItemsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});