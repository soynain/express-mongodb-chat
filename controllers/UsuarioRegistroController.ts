import conn from '../repositories/MongoDBConnection';
import { UsuarioTypes } from '../models/Usuario';

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


export default registrarUsuarioController;