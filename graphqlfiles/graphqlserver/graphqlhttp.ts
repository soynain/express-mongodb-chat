import { graphqlHTTP } from 'express-graphql';
import schema from '../schemas/schema';

const graphQLServerInitializer=graphqlHTTP({
    schema:schema,
    graphiql:true
});

export default graphQLServerInitializer;