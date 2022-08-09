import conn from '../repositories/MongoDBConnection';
import { CredencialesTypes } from '../models/Credenciales';

const findCredencialController=async(usuario_fk)=>{
    let Credenciales=conn.model<CredencialesTypes>('credenciales');
    let credencialEncontrada=await Credenciales.findOne({usuario_fk:usuario_fk});
    return credencialEncontrada;
}

const findCredencialControllerByUsername=async(usuario)=>{
    let Credenciales=conn.model<CredencialesTypes>('credenciales');
    let credencialEncontrada=await Credenciales.findOne({usuario:usuario});
    return credencialEncontrada;
}

export {findCredencialController,findCredencialControllerByUsername};