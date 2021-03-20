import jwt from 'jsonwebtoken';
import User from '../Model/userModel';

export const auth = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized',
      });
    }

    const decode = jwt.verify(token, process.env.TOKEN_SECRET);

    const verifyUser = await User.findById(decode.id);
    if (!verifyUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'The user belong to this token those no longer exist',
      });
    }
    req.user = verifyUser;
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid token',
    });
  }

  next();
};

export const userRole = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Your are not allowed to perform this action',
      });
    }
    next();
  };
};
