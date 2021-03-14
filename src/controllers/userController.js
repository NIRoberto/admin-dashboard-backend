import jwt from 'jsonwebtoken';
import userModel from '../Model/userModel';

const signInToken = (id) => {};
class userController {
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
        LoggedInAs: {
          user,
        },
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
    const updateUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    try {
      res.status(200).json({
        status: 'success',
        message: 'Update success done ',
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        error: error,
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
