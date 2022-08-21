import { GraphQLID, GraphQLList, GraphQLNonNull, execute, subscribe, GraphQLInt, GraphQLBoolean } from "graphql";
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { findUsuarioController, registrarUsuarioController } from '../../controllers/UsuarioController';
import { registrarCredencialesController, findCredencialController } from "../../controllers/CredencialesController";
import { findAmigosAceptadosOfUserId, findSolicitudesEnviadasOfUserId, enviarSolicitudAmistad } from "../../controllers/SolicitudesAmistadController";
import { enviarMensajes } from "../../controllers/MensajesController";
//import { findConjuntoSolicitudesIdForUser } from "../../controllers/ConjuntoSolicitudesAmistadController";
import pubsub from "../resolvers/SSEHandler";
import mongoose from "mongoose";

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
    name: "Solicitudes_Amistad",
    fields: () => ({
        _id: { type: GraphQLID },
        emisor_usuario_fk: { type: GraphQLString },
        destinatario_usuario_fk: { type: GraphQLString },
        status: { type: GraphQLString },
        fecha_envio: { type: GraphQLString },
        fecha_accion: { type: GraphQLString }
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
        findCredenciales: {
            type: Credenciales,
            args: { usuario_fk: { type: GraphQLString } },
            async resolve(parent, args) {
                return await findCredencialController(args.usuario_fk)
            }
        },
        findAmigosUsuario: {
            type: SolicitudesAmistad,
            args: { _id: { type: GraphQLString } },
            async resolve(parent, args) {
                return await findAmigosAceptadosOfUserId(args._id);
            }
        },
        findSolicitudesPendientes: {
            type: SolicitudesAmistad,
            args: { _id: { type: GraphQLString } },
            async resolve(parent, args) {
                return await findSolicitudesEnviadasOfUserId(args._id);
            }
        }
    })
});

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
        enviarMensajes:{
            type:mensajes,
            args:{
                sala_fk:{type:new GraphQLNonNull(GraphQLString)},
                mensaje:{type:new GraphQLNonNull(GraphQLString)},
                emisor_usuario_fk:{type:new GraphQLNonNull(GraphQLString)},
                destinatario_usuario_fk:{type:new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent,args){
                let mensajeEnviadoBroadcast=await enviarMensajes(args);
                await pubsub.publish(args.destinatario_usuario_fk, {recibirMensajes:mensajeEnviadoBroadcast});
                return mensajeEnviadoBroadcast;
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
                sala_id: { type: GraphQLString },
            },
            subscribe: async (parent, args) => {
                await pubsub.asyncIterator(args.sala_id);
            }
        }
    }
});

export default new GraphQLSchema({ query: rootQuery, mutation: rootMutation, subscription: subscriptionPrueba });
export { execute, subscribe }