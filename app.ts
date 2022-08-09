import express from 'express';
import path from 'path';
//var cookieParser = require('cookie-parser');
import { graphqlHTTP } from 'express-graphql';
import morgan from 'morgan';
import router from './routes/UsuariosRoutes';
import schema from './graphqlfiles/schemas/schema';
const app = express();
const portVar=3000||process.env.PORT;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/usuario',router);
app.use('/graphql',graphqlHTTP({
    schema:schema,
    graphiql:true
}));

app.listen(portVar,()=>{
    console.log('SERVER STARTED IN PORT: ',portVar);
});

