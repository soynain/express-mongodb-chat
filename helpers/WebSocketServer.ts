import { useServer } from 'graphql-ws/lib/use/ws';
import schema from '../graphqlfiles/schemas/schema';
import { execute, subscribe } from '../graphqlfiles/schemas/schema';
import {WebSocketServer} from 'ws';
const wsServer = new WebSocketServer({
    port: 4000,
    path: '/graphql',
});
const graphQlSubscriptionServer=useServer(
    {
        schema,
        execute,
        subscribe/*,
        onConnect: (ctx) => {
            console.log('Connect');
        },
        onSubscribe: (ctx, msg) => {
            console.log('Subscribe');
        },
        onNext: (ctx, msg, args, result) => {
            console.debug('Next');
        },
        onError: (ctx, msg, errors) => {
            console.error('Error');
        },
        onComplete: (ctx, msg) => {
            console.log('Complete');
        },*/
    },
    wsServer
);

export default graphQlSubscriptionServer;