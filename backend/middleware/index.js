import { JWT_SECRET } from "./../config"
import jwt from "jsonwebtoken"

const authHeader = (req,res, next ) => {
    const authHeader = req.headers.authorization;
    if(! authHeader || !authHeader.startWith('Bearer')){
        return res.status(403).json({
            message:"There is not token in authorization Headers"
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        if(decoded.userId){
            req.userId = decoded.userId;
            next()
        }
        else {
            return res.status(403).json({
                
            })
        }
    }
    catch(err){
        return res.status(401).json({
            message:"not auth"
        })
    }
}