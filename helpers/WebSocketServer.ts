import { useServer } from 'graphql-ws/lib/use/ws';
import schema from '../graphqlfiles/schemas/schema';
import { execute, subscribe } from '../graphqlfiles/schemas/schema';
import {WebSocketServer} from 'ws';
//import pubsub from "../graphqlfiles/resolvers/SSEHandler";
const wsServer = new WebSocketServer({
    port: 4000,
    path: '/usuario/subscriptions/graphql',
});
const graphQlSubscriptionServer=useServer(
    {
        schema,
        execute,
        subscribe/*,
        onConnect: (ctx) => {
            console.log(ctx.connectionParams);
        },
        onSubscribe: async(ctx, msg) => {
          //  console.log(ctx.connectionParams);
          //  await pubsub.publish('ONLINE-CONN-DETECTER', {activarStatusOnline:'hola perro'});
        },
        onNext: (ctx, msg, args, result) => {
            console.debug('Next');
        },
        onError: (ctx, msg, errors) => {
            console.error('Error');
        },
        onComplete: (ctx, msg) => {
            console.log('Complete');
        }*/
    },
    wsServer
);

export default graphQlSubscriptionServer;