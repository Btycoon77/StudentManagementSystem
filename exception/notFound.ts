import { Request, Response, NextFunction } from 'express';


const notFound = (req: Request, res: Response, next: NextFunction, error: any) => {
    const errorNotFound = `Not found ${req.originalUrl}`;
    return res.status(404).json({ errorNotFound });
}

export default notFound;

