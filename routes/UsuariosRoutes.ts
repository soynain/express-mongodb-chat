import express from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
const router = express.Router();
import loginController from '../controllers/LoginController';
import routerGraph from './GraphQLRouteAccess';
import tokenMiddleware from '../middlewares/JwtMiddleware';
/*This way, I can apply a jwt middleware to the graphqlhttpserver*/
router.use('/graphql',routerGraph);
//normal Routes
router.post('/login', loginController);

export default router;