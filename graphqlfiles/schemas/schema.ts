import { buildSchema, GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import {findUsuarioController,registrarUsuarioController} from '../../controllers/UsuarioController';
import { registrarCredencialesController,findCredencialController } from "../../controllers/CredencialesController";
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
            resolve(parent, args) {
                return findUsuarioController(args._id);
            }
        },
        findCredenciales: {
            type: Credenciales,
            args: { usuario_fk: { type: GraphQLString } },
            resolve(parent, args) {
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
            resolve(parent,args){
                return registrarUsuarioController(args);
            }
        },
        registrarCredenciales:{
            type:Credenciales,
            args:{
                usuario_fk:{type:new GraphQLNonNull(GraphQLString)},
                usuario:{type:new GraphQLNonNull(GraphQLString)},
                contrasena:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                return registrarCredencialesController(args);
            }
        }
    }
});

export default new GraphQLSchema({ query: rootQuery, mutation: rootMutation });