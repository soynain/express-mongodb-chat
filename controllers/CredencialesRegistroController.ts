import conn from '../repositories/MongoDBConnection';
import { CredencialesTypes } from '../models/Credenciales';

const registrarCredencialesController=async(credenciales)=>{
    let Credenciales=conn.model<CredencialesTypes>('credenciales');
    let credencialCreada=Credenciales.create({
        usuario_fk:credenciales.usuario_fk,
        usuario:credenciales.usuario,
        contrasena:credenciales.contrasena
    });
    return credencialCreada;
}

export default registrarCredencialesController;