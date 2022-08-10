import express from 'express';
import graphQLServerInitializer from '../graphqlfiles/graphqlserver/graphqlhttp';

const routerGraph = express.Router();
routerGraph.use('/',graphQLServerInitializer);

export default routerGraph;