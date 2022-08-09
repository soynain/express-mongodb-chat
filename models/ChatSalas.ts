import { Schema, Types } from 'mongoose';

interface ChatSalasTypes{
    amigos_fk:Types.ObjectId
};

const chatSalasSchema=new Schema({
    amigos_fk:{type:Schema.Types.ObjectId,ref:'solicitudes_amistad',required:false}
});

chatSalasSchema.path('_id');

export default chatSalasSchema;
export {ChatSalasTypes};