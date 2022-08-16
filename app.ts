import express from 'express';
import path from 'path';
//var cookieParser = require('cookie-parser');
import morgan from 'morgan';
import router from './routes/UsuariosRoutes'
import cors from 'cors';
import graphQlSubscriptionServer  from './helpers/WebSocketServer';
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
app.use(cors());
app.use('/usuario', router);

app.listen(portVar, ()=>{
    console.log('SERVIDOR ARRIBA');
    graphQlSubscriptionServer;
})

