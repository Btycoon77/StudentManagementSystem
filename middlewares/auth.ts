import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers['authorization']?.split(' ')[1] as string;

    console.log(token);
    if (!token) {
      res.status(401).json({ message: 'Auth failed', success: false });
    }

    
   jwt.verify(token,process.env.JWT_SECRET as string,(err,decode:any)=>{
        if(err){
            res.status(401).json({
                message:"Auth failed"
            })
        }else{
            console.log("succesfully authenticated");
            // creating decoded in req.body for its further user;
            req.body.decoded = decode;
            //  so basically you are getting the guid of the user that has logged in;
            console.log(req.body.decoded)
        }

   })

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export default authMiddleware;
