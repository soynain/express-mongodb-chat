import conn from '../repositories/MongoDBConnection';
import { SolicitudesAmistadTypes } from '../models/SolicitudesAmistad';
import { StatusOptions } from '../models/SolicitudesAmistad';

const findAmigosAceptadosOfUserId=async(idUsuario)=>{
    let SolicitudesAmistad=conn.model<SolicitudesAmistadTypes>('solicitudes_amistad');
    let amigosAceptadosEncontrados=await SolicitudesAmistad.find({_id:idUsuario.id,status:StatusOptions.ACEPTADO});
    return amigosAceptadosEncontrados;
}

const findSolicitudesEnviadasOfUserId=async(idUsuario)=>{
    let SolicitudesAmistad=conn.model<SolicitudesAmistadTypes>('solicitudes_amistad');
    let solicitudesPendientes=await SolicitudesAmistad.find({_id:idUsuario.id,status:StatusOptions.EN_ESPERA});
    return solicitudesPendientes;
}

const enviarSolicitudAmistad=async(args)=>{
    let SolicitudesAmistad=conn.model<SolicitudesAmistadTypes>('solicitudes_amistad');
    let solicitudEnviada=await SolicitudesAmistad.create({
        emisor_usuario_fk:args.emisor_usuario_fk,
        destinatario_usuario_fk:args.destinatario_usuario_fk,
        status:args.status,
        fecha_envio:new Date()
    });
    return solicitudEnviada;
}

export {findAmigosAceptadosOfUserId,findSolicitudesEnviadasOfUserId,enviarSolicitudAmistad};