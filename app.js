const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingItems');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { NOT_FOUND } = require('./utils/errors');

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.post('/signin', login);
app.post('/signup', createUser);
app.get('/items', clothingItemsRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('/items', clothingItemsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});