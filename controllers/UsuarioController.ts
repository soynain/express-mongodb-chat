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

const registrarUsuarioController = async (usuario) => {
    let Usuario = conn.model<UsuarioTypes>('usuario');
    let resultUsuarioCreation = await Usuario.create({
        nombres: usuario.nombres.toString().toUpperCase(),
        apellido_paterno: usuario.apellido_paterno.toString().toUpperCase(),
        apellido_materno: usuario.apellido_materno.toString().toUpperCase(),
        fecha_nac: new Date(usuario.fecha_nac)
    });
    return resultUsuarioCreation;
}

export {findUsuarioController, registrarUsuarioController}