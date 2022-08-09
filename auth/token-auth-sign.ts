import { sign, SignOptions } from "jsonwebtoken";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config()

const signInOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '1h'
};

const generarToken = async (payload) => {
    return await sign(payload,process.env.SECRET_TOKEN,signInOptions);
}

export default generarToken;