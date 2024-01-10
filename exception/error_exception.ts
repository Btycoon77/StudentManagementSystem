import { Request, Response, NextFunction } from 'express';

//  error handler

export default (error: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(409).json({
    error: error?.message,
    statusCode: 409,
    // message: error?.message
  });
};

