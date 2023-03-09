const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
mongoose.set('strictQuery', false);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6404baff8a35df27e2e1ba02',
  };

  next();
});
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});