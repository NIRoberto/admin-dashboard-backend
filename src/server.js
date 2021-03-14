import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE_URL;

mongoose
  .connect(process.env.DATABASE_URL_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log('DB connected'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App  is listening to  the port ${PORT}`);
});
