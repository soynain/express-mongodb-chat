import { Schema, Types } from 'mongoose';

interface CredencialesTypes{
    usuario_fk:Types.ObjectId,
    usuario:String,
    contrasena:String
};

const credencialesSchema=new Schema({
    usuario_fk:{type:Schema.Types.ObjectId,required:true,ref:'usuario'},
    usuario:{type:String,required:true},
    contrasena:{type:String,required:true}
});

credencialesSchema.path('_id');

export default credencialesSchema;
export {CredencialesTypes};