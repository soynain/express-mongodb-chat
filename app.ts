import express from 'express';
import path from 'path';
//var cookieParser = require('cookie-parser');
import morgan from 'morgan';
import router from './routes/UsuariosRoutes'
import { WebSocketServer } from 'ws'; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
import { useServer } from 'graphql-ws/lib/use/ws';
import schema from './graphqlfiles/schemas/schema';

const app = express();
const portVar = 3000 || process.env.PORT;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/usuario', router);
const server = new WebSocketServer({
    port: 4000,
    path: '/graphql',
});

server.on('open', function open() {
    server.send('something');
  });

useServer({ schema }, server);

app.listen(portVar, () => {
    console.log('SERVER STARTED IN PORT: ', portVar);
});

