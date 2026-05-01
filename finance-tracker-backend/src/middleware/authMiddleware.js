import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import AppError from '../utils/appError.js';
import prisma from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token does no longer exist.', 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid token or token has expired', 401));
  }
});
