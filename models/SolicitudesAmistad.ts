import { Schema, Types } from 'mongoose';
enum StatusOptions {
    EN_ESPERA = 'EN ESPERA',
    ACEPTADO = 'ACEPTADO'
};

interface SolicitudesAmistadTypes {
    emisor_usuario_fk: Types.ObjectId,
    destinatario_usuario_fk: Types.ObjectId,
    status: StatusOptions.EN_ESPERA | StatusOptions.ACEPTADO,
    fecha_envio: Date,
    fecha_accion: Date
};

const solicitudesAmistadSchema = new Schema({
    emisor_usuario_fk: { type: Schema.Types.ObjectId, required: true, ref: 'usuario' },
    destinatario_usuario_fk: { type: Schema.Types.ObjectId, required: true, ref: 'usuario' },
    status: { type: String,required:true },
    fecha_envio: { type: Schema.Types.Date, required: true },
    fecha_accion: { type: Schema.Types.Date, required: false }
});

solicitudesAmistadSchema.path('_id');

export default solicitudesAmistadSchema;
export { SolicitudesAmistadTypes, StatusOptions };