import { buildSchema, GraphQLID, GraphQLList, GraphQLNonNull, execute, subscribe, GraphQLInt } from "graphql";
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { findUsuarioController, registrarUsuarioController } from '../../controllers/UsuarioController';
import { registrarCredencialesController, findCredencialController } from "../../controllers/CredencialesController";
import pubsub from "../resolvers/SSEHandler";
import mongoose from "mongoose";

const PRUEBA_SUBSCRIPCION = 'PRUEBA_SUBSCRIPCION';

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

        user_credentials: {
            type: Credenciales,
            resolve(parent, args) {
                return findCredencialController(mongoose.Types.ObjectId.createFromHexString(parent.id))
            }
        }
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

/*In this section, query's will be defined*/
const rootQuery = new GraphQLObjectType({
    name: "root",
    fields: () => ({
        findUsuario: {
            type: Usuario,
            args: { _id: { type: GraphQLID } },
            async resolve(parent, args) {
                const prueba= await findUsuarioController(args._id);
                console.log(prueba)
                await pubsub.publish('CACA', {countdown:prueba})
                return prueba;
            }
        },
        findCredenciales: {
            type: Credenciales,
            args: { usuario_fk: { type: GraphQLString } },
            async resolve(parent, args) {
                return findCredencialController(args.usuario_fk)                
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
                let sendObjectThroughSocket = await registrarUsuarioController(args);
                console.log({ ...sendObjectThroughSocket });
                //   await pubsub.publish(PRUEBA_SUBSCRIPCION,{nuevoUsuario:{nombres:sendObjectThroughSocket.nombres}});
                return sendObjectThroughSocket;
            }
        },
        registrarCredenciales: {
            type: Credenciales,
            args: {
                usuario_fk: { type: new GraphQLNonNull(GraphQLString) },
                usuario: { type: new GraphQLNonNull(GraphQLString) },
                contrasena: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return registrarCredencialesController(args);
            }
        }
    }
});

const subscriptionPrueba = new GraphQLObjectType({
    name: 'Subscription',
    fields: {
        countdown: {
            type: Usuario,
          //  args:{from:{type:GraphQLInt}},
            subscribe:async()=> /*async function* (parent,args) {
            //    console.log(args.from)
                for (let i = args.from; i >= 0; i--) {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    yield { countdown: i }
                }
            }*/
            await pubsub.asyncIterator(['CACA'])
        }
    }
});

export default new GraphQLSchema({ query: rootQuery, mutation: rootMutation, subscription:subscriptionPrueba });
export { execute, subscribe }