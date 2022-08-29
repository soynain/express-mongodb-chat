import conn from '../repositories/MongoDBConnection';
import { ChatSalasTypes } from '../models/ChatSalas';

const crearNuevaSalaChat=async(fk_solictud_amistad)=>{
    let ChatSalas=conn.model<ChatSalasTypes>('chat_salas');
    let idSalaChatGenerado=await ChatSalas.create({amigos_fk:fk_solictud_amistad});
    console.log(idSalaChatGenerado);
    return idSalaChatGenerado
}

const findSalaChat=async(_id)=>{
    let ChatSalas=conn.model<ChatSalasTypes>('chat_salas');
    let salaChatEncontrada=await ChatSalas.findOne({amigos_fk:_id});
    return salaChatEncontrada;
}

const dropSalaChat=async(_id)=>{
    let ChatSalas=conn.model<ChatSalasTypes>('chat_salas');
    let salaChatIdDropped=await ChatSalas.remove({amigos_fk:_id});
    return salaChatIdDropped;
}

export {crearNuevaSalaChat,findSalaChat,dropSalaChat};