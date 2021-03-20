import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import userRoute from './routes/userRoute';

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-Width,Content-Type,Accept,auth-token"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the node backend API',
  });
});

app.use('/api/v1/users', userRoute);

export default app;
