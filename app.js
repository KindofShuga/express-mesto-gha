const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes/index');
const { PORT, DB_ADDRESS } = require('./config');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

mongoose.connect(DB_ADDRESS);
mongoose.set('strictQuery', false);

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: 'http://127.0.0.1:3000' }));
// app.use((req, res, next) => {
//   req.user = {
//     _id: '6404baff8a35df27e2e1ba02',
//   };

//   next();
// });
app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});