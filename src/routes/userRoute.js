import express from 'express';
// import passport from 'passport';
import multer from 'multer';
import userController, {
  upload,
  userProfileUpload,
} from '../controllers/userController';
import { auth, userRole } from '../middleware/auth';

const route = express.Router();

route.post('/signup', userController.postOne);
route.post('/signin', userController.post);

// route.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: 'https://www.googleapis.com/auth/plus.login',
//   })
// );
// route.get('/google/callback', passport.authenticate('google', {}));

route.get('/', auth, userController.findAll);
route.get('/user/', auth, userController.getOne);
route.patch(
  '/update/:id',
  auth,
  upload.single('profileImage'),
  userController.resizeUserPhoto,
  userController.UpdateOne
);
route.delete('/delete/:id', auth, userRole('admin'), userController.deleteOne);

export default route;
