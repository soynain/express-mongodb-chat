import conn from '../repositories/MongoDBConnection';
import { MensajesTypes } from '../models/Mensajes';

const enviarMensajes=async(args)=>{
    let Mensajes=conn.model<MensajesTypes>('mensajes');
    let mensajesEnviado=Mensajes.create({
        sala_fk:args.sala_fk,
        mensaje:args.mensaje,
        fecha_envio:new Date(),
        visto:false,
        emisor_usuario_fk:args.emisor_usuario_fk,
        destinatario_usuario_fk:args.destinatario_usuario_fk
    });
    return mensajesEnviado;
}

export{enviarMensajes};