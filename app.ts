import express from 'express';
import path from 'path';
//var cookieParser = require('cookie-parser');
import morgan from 'morgan';
import router from './routes/UsuariosRoutes'
import cors from 'cors';
import graphQlSubscriptionServer  from './helpers/WebSocketServer';
import { Server } from 'socket.io';
import { createServer } from 'http';
const app = express();
const portVar = 3000 || process.env.PORT;

const httpServerForWebSocket=createServer().listen(8080);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/usuario', router);

/*We need to create another http aditional instance, reserved
for the new websocket because
the express instance is already being used by graphql*/

/*For handling new connections, specially with cors,
you must set the origin header to null, soo, its best to
read this article
https://socket.io/docs/v4/handling-cors/
*/
const io=new Server(httpServerForWebSocket,{
    path:'/websocket',
    cors:{
        origin:'http://127.0.0.1:5173',
        credentials:true
    }
});

let usuariosOnlineArray=new Map()

io.on('connection', (socket) => {
    /*Socket param of on function is for client information,
    as also to obtain the socket id*/
    //console.log('si se conecto');
    socket.on('online-helper', usuario_id => {
       // console.log(usuario_id)
        socket.broadcast.emit('online-helper',usuario_id)
    });
});

const server=app.listen(portVar, ()=>{
    console.log('SERVIDOR ARRIBA');
    console.log(httpServerForWebSocket.address());
    graphQlSubscriptionServer;
});

