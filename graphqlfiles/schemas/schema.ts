import { GraphQLID, GraphQLList, GraphQLNonNull, execute, subscribe, GraphQLInt, GraphQLBoolean } from "graphql";
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { findUsuarioController, registrarUsuarioController } from '../../controllers/UsuarioController';
import { registrarCredencialesController, findCredencialController } from "../../controllers/CredencialesController";
import { findAmigosAceptadosOfUserId, findSolicitudesEnviadasOfUserId, enviarSolicitudAmistad,findFriendshipBetweenTwoUsers } from "../../controllers/SolicitudesAmistadController";
import { enviarMensajes, findMensajesBetweenFriends } from "../../controllers/MensajesController";
import { findSalaChat,crearNuevaSalaChat,dropSalaChat } from "../../controllers/ChatSalasController";
import pubsub from "../resolvers/SSEHandler";
import mongoose from "mongoose";
import { resolve } from "path";


/*A clearer example of a graphql schema can be found here 
https://progressivecoder.com/how-to-create-a-graphql-schema-with-graphqljs-and-express/
documentation for this is pretty scarce*/

const Usuario = new GraphQLObjectType({
    name: "Usuario",
    fields: () => ({
        _id: { type: GraphQLID },
        nombres: { type: GraphQLString },
        apellido_paterno: { type: GraphQLString },
        apellido_materno: { type: GraphQLString },
        fecha_nac: { type: GraphQLString },

        /*Documentation for embedded objects can be found here 
        https://www.fullstacklabs.co/blog/express-graphql-server
        this website was REALLY HELPFUL */

        /*solicitudes_amistad_grupo_id:{
            type:conjuntoSolicitudesAmistad,
            async resolve(parent,args){
                return await findConjuntoSolicitudesIdForUser(mongoose.Types.ObjectId.createFromHexString(parent.id));
            }
        }*/
    })
});

const Credenciales = new GraphQLObjectType({
    name: "Credenciales",
    fields: () => ({
        _id: { type: GraphQLID },
        usuario_fk: { type: GraphQLString },
        usuario: { type: GraphQLString },
        contrasena: { type: GraphQLString }
    })
});

const SolicitudesAmistad = new GraphQLObjectType({
    name: "SolicitudesAmistad",
    fields: () => ({
        _id: { type: GraphQLID },
        emisor_usuario_fk: { type: GraphQLString },
        destinatario_usuario_fk: { type: GraphQLString },
        status: { type: GraphQLString },
        fecha_envio: { type: GraphQLString },
        fecha_accion: { type: GraphQLString },
        nombres_usuario: {
            type: Credenciales,
            args: {
                id_usuario_cliente: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return await findCredencialController(args.id_usuario_cliente,parent.emisor_usuario_fk,parent.destinatario_usuario_fk);
            }
        },
        find_sala_id:{
            type:chat_salas,
            async resolve(parent,args){
                return await findSalaChat(parent._id);
            }
        }
    })
});

const chat_salas = new GraphQLObjectType({
    name: "chat_salas",
    fields: () => ({
        _id: { type: GraphQLID },
        amigos_fk: { type: GraphQLString }
    })
});

const mensajes = new GraphQLObjectType({
    name: "mensajes",
    fields: () => ({
        _id: { type: GraphQLID },
        sala_fk: { type: GraphQLString },
        mensaje: { type: GraphQLString },
        fecha_envio: { type: GraphQLString },
        visto: { type: GraphQLBoolean },
        fecha_visto: { type: GraphQLString },
        emisor_usuario_fk: { type: GraphQLString },
        destinatario_usuario_fk: { type: GraphQLString }
    })
});
/*const conjuntoSolicitudesAmistad=new GraphQLObjectType({
    name:"conjunto_solicitudes_amistad",
    fields:()=>({
        _id:{type:GraphQLID},
        usuario_fk:{type:GraphQLString}
    })
});*/

/*In this section, query's will be defined*/
const rootQuery = new GraphQLObjectType({
    name: "query",
    fields: () => ({
        findUsuario: {
            type: Usuario,
            args: { _id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await findUsuarioController(args._id);
            }
        },
        findAmigosUsuario: {
            type: new GraphQLList(SolicitudesAmistad),
            args: {
                emisor_usuario_fk: { type: GraphQLString },
                status: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return await findAmigosAceptadosOfUserId(args.emisor_usuario_fk);
            }
        },
        findSolicitudesPendientes: {
            type: new GraphQLList(SolicitudesAmistad),
            args: { _id: { type: GraphQLString } },
            async resolve(parent, args) {
                return await findSolicitudesEnviadasOfUserId(args._id);
            }
        },
        findPrivateMensajes: {
            type: new GraphQLList(mensajes),
            args: {
                emisor_usuario_fk: { type: GraphQLString },
                destinatario_usuario_fk: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return await findMensajesBetweenFriends(args);
            }
        },
        findAmistadParticular:{
            type:SolicitudesAmistad,
            args:{
                emisor_usuario_fk:{type:GraphQLString},
                destinatario_usuario_fk:{type:GraphQLString}
            },
            async resolve(parent, args){
                return await findFriendshipBetweenTwoUsers(args);
            }
        }
    })
});

async function pivotFunctionForBroadcastingUserId(usuario_id){
    await pubsub.publish('ONLINE-CONN-DETECTER', {activarStatusOnline:usuario_id});
}

/*In this section is where mutations will be defined, all operations that 
envolve modification, deletion and insertion*/
const rootMutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        registrarUsuario: {
            type: Usuario,
            args: {
                nombres: { type: new GraphQLNonNull(GraphQLString) },
                apellido_paterno: { type: new GraphQLNonNull(GraphQLString) },
                apellido_materno: { type: new GraphQLNonNull(GraphQLString) },
                fecha_nac: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                return await registrarUsuarioController(args);
            }
        },
        registrarCredenciales: {
            type: Credenciales,
            args: {
                usuario_fk: { type: new GraphQLNonNull(GraphQLString) },
                usuario: { type: new GraphQLNonNull(GraphQLString) },
                contrasena: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                return await registrarCredencialesController(args);
            }
        },
        enviarSolicitudAmistad: {
            type: SolicitudesAmistad,
            args: {
                emisor_usuario_fk: { type: new GraphQLNonNull(GraphQLString) },
                destinatario_usuario_fk: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLString) },
                fk_conjunto: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                let solicitudEnviada = await enviarSolicitudAmistad(args);
                await pubsub.publish(
                    solicitudEnviada.destinatario_usuario_fk.toString(),
                    {
                        listenForSolicitudesAmistad: solicitudEnviada
                    });
                return solicitudEnviada;
            }
        },
        enviarMensajes: {
            type: mensajes,
            args: {
                sala_fk: { type: new GraphQLNonNull(GraphQLString) },
                mensaje: { type: new GraphQLNonNull(GraphQLString) },
                emisor_usuario_fk: { type: new GraphQLNonNull(GraphQLString) },
                destinatario_usuario_fk: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                let mensajeEnviadoBroadcast = await enviarMensajes(args);
                await pubsub.publish(args.sala_fk, { recibirMensajes: mensajeEnviadoBroadcast });
                return mensajeEnviadoBroadcast;
            }
        },
        crearNuevaSalaDeChat:{
            type:chat_salas,
            args:{
                _id:{type:GraphQLString}
            },
            async resolve(parent,args){
                return await crearNuevaSalaChat(args._id);
            }
        },
        borrarSalaChatId:{
            type:chat_salas,
            args:{
                amigos_fk:{type:GraphQLString}
            },
            async resolve(parent,args){
                return await dropSalaChat(args._id);
            }
        },
        bouncingOnlineConnectionBack:{
            type:GraphQLString,
            args:{
                usuario_id:{type:GraphQLString}
            },
            async resolve(parent,args){
                await pubsub.publish('ONLINE-CONN-DETECTER', {activarStatusOnline:args.usuario_id});
            }
        }
    }
});

const subscriptionPrueba = new GraphQLObjectType({
    name: 'Subscription',
    fields: {
        listenForSolicitudesAmistad: {
            type: SolicitudesAmistad,
            args: {
                MyUserId: { type: new GraphQLNonNull(GraphQLString) }
            },
            subscribe: async (parent, args) => {
                await pubsub.asyncIterator(args.MyUserId)
            }
        },
        recibirMensajes: {
            type: mensajes,
            args: {
                sala_fk: { type: GraphQLString },
            },
            subscribe: async (parent, args) => {
                return await pubsub.asyncIterator(args.sala_fk);
            }
        },
        activarStatusOnline:{
            type: GraphQLString,
            args:{
                usuario_id:{type:GraphQLString}
            },
            subscribe:async (parent,args) => { 
                await pivotFunctionForBroadcastingUserId(args.usuario_id);
                return await pubsub.asyncIterator('ONLINE-CONN-DETECTER');
            }
        }
    }
});

export default new GraphQLSchema({ query: rootQuery, mutation: rootMutation, subscription: subscriptionPrueba });
export { execute, subscribe }