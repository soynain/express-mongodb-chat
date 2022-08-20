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

export {findAmigosAceptadosOfUserId,findSolicitudesEnviadasOfUserId};