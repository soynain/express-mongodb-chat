import conn from '../repositories/MongoDBConnection';
import { CredencialesTypes } from '../models/Credenciales';
import mongoose from 'mongoose';

const registrarCredencialesController = async (credenciales) => {
    let Credenciales = conn.model<CredencialesTypes>('credenciales');
    let credencialCreada = Credenciales.create({
        usuario_fk: credenciales.usuario_fk,
        usuario: credenciales.usuario,
        contrasena: credenciales.contrasena
    });
    return credencialCreada;
}

const findCredencialController = async (id_cliente, emisor_usuario_fk, destinatario_usuario_fk) => {
    if (mongoose.Types.ObjectId.createFromHexString(id_cliente).equals(destinatario_usuario_fk)) {
        let Credenciales = conn.model<CredencialesTypes>('credenciales');
        let credencialEncontrada = await Credenciales.findOne({ usuario_fk: emisor_usuario_fk });
        return credencialEncontrada;
    }
    
    let Credenciales = conn.model<CredencialesTypes>('credenciales');
    let credencialEncontrada = await Credenciales.findOne({ usuario_fk: destinatario_usuario_fk });
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