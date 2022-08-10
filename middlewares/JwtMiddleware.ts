import validarToken from "../auth/token-auth-verify";
import { TokenExpiredError,JsonWebTokenError } from "jsonwebtoken";

/*Middleware to check if token is expired or malformed*/
const tokenMiddleware = async(req, res, next) => {
    console.log(req.header('access-token'));
    const token = req.header('access-token')
    if (!token) return res.status(404).json({ error: 'Invalid credentials' })
    try {
        const verified = await validarToken(token);
        req.user = verified
        next() 
    }catch(error){
        switch(true){
            case (error instanceof TokenExpiredError):{
                return res.status(500).json({'Status':'Token expired','Expired at':error.expiredAt});
                break;
            }
            case (error instanceof JsonWebTokenError):{
                return res.status(500).json({'Status':'Token is wrong'});
                break;
            }
        }
    }
}

export default tokenMiddleware;