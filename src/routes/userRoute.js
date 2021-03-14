import express from 'express';
import userController from '../controllers/userController';
import { auth, userRole } from '../middleware/auth';

const route = express.Router();

route.post('/signup', userController.postOne);
route.post('/signin', userController.post);
route.get('/', auth, userController.findAll);
route.patch('/update/:id', auth, userController.UpdateOne);
route.delete('/delete/:id', auth, userRole('admin'), userController.deleteOne);

export default route;
