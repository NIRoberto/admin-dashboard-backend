import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import userRoute from './routes/userRoute';

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the node backend API',
  });
});

app.use('/api/v1/users', userRoute);

export default app;
