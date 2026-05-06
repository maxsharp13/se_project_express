const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');

const usersRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingItems');

const { getClothingItems } = require('./controllers/clothingItems');
const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

const NotFoundError = require('./errors/not-found-error');

const {
  validateLogin,
  validateCreateUser,
} = require('./middlewares/validation');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.get('/items', getClothingItems);

app.use(auth);

app.use('/users', usersRouter);
app.use('/items', clothingItemsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);