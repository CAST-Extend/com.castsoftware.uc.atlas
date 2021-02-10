import { NextFunction, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { RequestWithToken } from '../interfaces/auth.interface';
import TokenService from '../services/token.service';

const authMiddleware = async (req: RequestWithToken, res: Response, next: NextFunction) => {
  try {
    
    if (req.headers.authorization) {
      // Detect if token is valid
      const token: string = String(req.headers.authorization).replace("Bearer ", "");
      
      if (TokenService.isValidToken(token)) {
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication header missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
