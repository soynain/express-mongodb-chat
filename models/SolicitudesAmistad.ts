import { Schema, Types } from 'mongoose';
enum StatusOptions{
    EN_ESPERA='EN ESPERA',
    ACEPTADO='ACEPTADO'
};

interface SolicitudesAmistadTypes{
    emisor_usuario_fk:Types.ObjectId,
    destinatario_usuario_fk:Types.ObjectId,
    status:StatusOptions.EN_ESPERA|StatusOptions.ACEPTADO,
    fecha_envio:Date,
    fecha_accion:Date
};

const solicitudesAmistad=new Schema({
    emisor_usuario_fk:{type:Schema.Types.ObjectId,required:true,ref:'usuario'},
    destinatario_usuario_fk:{type:Schema.Types.ObjectId,required:true,ref:'usuario'},
    status:{Type:StatusOptions,required:true},
    fecha_envio:{type:Date,required:true},
    fecha_accion:{type:Date,required:true}
});

solicitudesAmistad.path('_id');

export default solicitudesAmistad;
export {SolicitudesAmistadTypes};