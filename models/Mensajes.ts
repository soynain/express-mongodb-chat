import { Schema, Types } from 'mongoose';

interface MensajesTypes{
    sala_fk:Types.ObjectId,
    mensaje:String,
    fecha_envio:Date,
    visto:Boolean,
    fecha_visto:Date,
    emisor_usuario_fk:Types.ObjectId,
    destinatario_usuario_fk:Types.ObjectId
};

const mensajesSchema=new Schema<MensajesTypes>({
    sala_fk:{type:Schema.Types.ObjectId,required:false,ref:'chat_salas'},
    mensaje:{type:String,required:true},
    fecha_envio:{type:Date,required:true},
    visto:{type:Boolean,required:true},
    fecha_visto:{type:Date,required:true},
    emisor_usuario_fk:{type:Schema.Types.ObjectId,required:false,ref:'usuario'},
    destinatario_usuario_fk:{type:Schema.Types.ObjectId,required:false,ref:'usuario'}
});

mensajesSchema.path('_id');

export default mensajesSchema;
export {MensajesTypes};
