import conn from '../repositories/MongoDBConnection';
import { UsuarioTypes } from '../models/Usuario';

const findUsuarioController =async function(_id){
    let Usuario = conn.model<UsuarioTypes>('usuario');
    let usuarioEncontrado = await Usuario.findById(_id);
    return usuarioEncontrado;
};

const findUsuarioControllerByUsername =async function(username){
    let Usuario = conn.model<UsuarioTypes>('usuario');
    let usuarioEncontrado = await Usuario.findOne({usuario:username});
    return usuarioEncontrado;
};

export {findUsuarioController}