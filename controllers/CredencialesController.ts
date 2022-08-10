import conn from '../repositories/MongoDBConnection';
import { CredencialesTypes } from '../models/Credenciales';

const registrarCredencialesController = async (credenciales) => {
    let Credenciales = conn.model<CredencialesTypes>('credenciales');
    let credencialCreada = Credenciales.create({
        usuario_fk: credenciales.usuario_fk,
        usuario: credenciales.usuario,
        contrasena: credenciales.contrasena
    });
    return credencialCreada;
}

const findCredencialController = async (usuario_fk) => {
    let Credenciales = conn.model<CredencialesTypes>('credenciales');
    let credencialEncontrada = await Credenciales.findOne({ usuario_fk: usuario_fk });
    return credencialEncontrada;
}

const findCredencialControllerByUsername = async (usuario) => {
    let Credenciales = conn.model<CredencialesTypes>('credenciales');
    let credencialEncontrada = await Credenciales.findOne({ usuario: usuario });
    return credencialEncontrada;
}

export { 
    registrarCredencialesController, 
    findCredencialController, 
    findCredencialControllerByUsername 
};