import { Schema, Types } from 'mongoose';

interface UsuarioTypes{
    nombres:String,
    apellido_paterno:String,
    apellido_materno:String,
    fecha_nac:Date
};

const usuarioSchema=new Schema<UsuarioTypes>({
    nombres:{type:String,required:true},
    apellido_paterno:{type:String,required:true},
    apellido_materno:{type:String,required:true},
    fecha_nac:{type:Date,required:true}
});

usuarioSchema.path('_id');

export default usuarioSchema;
export {UsuarioTypes};


