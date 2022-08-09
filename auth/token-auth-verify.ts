import { verify,VerifyOptions } from "jsonwebtoken";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

/*Useful guide for implementing jwt with typescript
https://www.becomebetterprogrammer.com/jwt-authentication-middleware-nodejs-typescript/
*/
interface TokenPayload {
    usuario: string,
    usuario_id: string,
    iat:number,
    exp:number
}

const verifyOptions:VerifyOptions={
    algorithms:["HS256"]
}

const validarToken=(token_string)=>{
    return new Promise((resolve,reject)=>{
        verify(token_string,process.env.SECRET_TOKEN,verifyOptions,(error,tokenGenerado:TokenPayload)=>{
            if (error) return reject(error);
            resolve(tokenGenerado);
        });
    })
}

export default validarToken;