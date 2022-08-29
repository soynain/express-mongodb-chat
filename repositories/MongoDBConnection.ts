import { Schema, model, createConnection } from 'mongoose';
import usuarioSchema from '../models/Usuario';
import credencialesSchema from '../models/Credenciales';
import solicitudesAmistadSchema from '../models/SolicitudesAmistad';
import mensajesSchema from '../models/Mensajes';
import chatSalasSchema from '../models/ChatSalas';
//import conjuntoSolicitudesAmistadSchema from '../models/ConjuntoSolicitudesAmistad';
const conn = createConnection('mongodb://127.0.0.1:27017/mongodbchat');

/*I didn't get to work the pluralize function, that detail about the s concat
sucks ass in mongoose, makes u lose time debugging.

So another solution is to use the third model() function's parameter
that consists to set the schema name by yourself,
so it doesnt get pluralized by mongoose,
so you avoid:
usuario=>usuarios
and you just get the name you set in your original schema
usuario =>usuario
*/
conn.model('usuario', usuarioSchema, 'usuario');
conn.model('credenciales', credencialesSchema, 'credenciales');
conn.model('solicitudes_amistad',solicitudesAmistadSchema,'solicitudes_amistad');
conn.model('mensajes',mensajesSchema,'mensajes');
conn.model('chat_salas',chatSalasSchema,'chat_salas');

export default conn;
