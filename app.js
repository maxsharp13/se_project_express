const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingItems');

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

mongoose.connect('mongodb+srv://maxsharpnack_db_user:GEWLM98WPvy1b7yF@cluster0.opycxjw.mongodb.net/?appName=Cluster0');

app.use((req, res, next) => {
  req.user = {
    _id: '69a8ce2114f80f5301a6b818',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/items', clothingItemsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});