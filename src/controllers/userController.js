import jwt from 'jsonwebtoken';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
const cloudinary = require('cloudinary').v2;
// import Datauri from 'datauri';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
dotenv.config();
import userModel from '../Model/userModel';

const multerStorage = multer.memoryStorage();

export const upload = multer({
  storage: multerStorage,
});

class userController {
  static async resizeUserPhoto(req, res, next) {
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
    if (!req.file) return next();
    sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`upload/users/${req.file.filename}`);
    next();
  }

  static async findAll(req, res) {
    try {
      const users = await userModel.find();

      res.status(200).json({
        status: 'success',
        data: {
          users,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        error: 'Not user found',
      });
    }
  }

  static async getOne(req, res) {
    const user = req.user;
    try {
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: 'fail',
      });
    }
  }
  static async postOne(req, res) {
    const { firstName, lastName, email, password, role } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        status: 'fail',
        message: 'Email in use',
      });
    }

    try {
      const newUser = await userModel.create(req.body);
      const token = await jwt.sign(
        { id: newUser._id },
        process.env.TOKEN_SECRET,
        {
          expiresIn: process.env.JWT_EXPERISIN,
        }
      );

      res.status(200).json({
        status: 'success',
        users: 'Signup success and login',
        token,
        data: {
          newUser,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        error: error,
      });
    }
  }
  static async post(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email and password are required',
      });
    }
    const user = await userModel.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    try {
      const token = await jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPERISIN,
      });
      res.status(200).json({
        status: 'success',
        users: 'SignIn success and login',
        message: `Welcome again ${user.firstName}`,
        token,
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        error: error,
      });
    }
  }
  static async UpdateOne(req, res) {
    const { password } = req.body;

    if (password) {
      return res.status(400).json({
        status: 'fail',
        message: 'this is not the route for updating password is for others',
      });
    }
    // console.log(req.file);

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    try {
      let cld_upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: 'users',
        },
        async function (error, result) {
          const newInfo = {
            // profileImage: result.url,
            location: req.body.location,
            phone: req.body.phone,
            birthDate: req.body.birthDate,
            desc: req.body.desc,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
          };
          const updateUser = await userModel.findByIdAndUpdate(
            req.params.id,
            newInfo,
            {
              new: true,
              runValidators: false,
            }
          );
          res.status(200).json({
            status: 'success',
            message: 'Update success done ',
            data: {
              updateUser,
            },
          });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
    } catch (error) {
      res.status(404).json({
        status: 'error',
        error: error.message,
      });
    }
  }
  static async deleteOne(req, res) {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found',
      });
    }
    try {
      await userModel.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({
        status: 'success',
        users: 'Delete user successfully done',
      });
    } catch (error) {
      res.status(204).json({
        status: 'error',
        error: 'Delete failed',
      });
    }
  }
}
export default userController;
