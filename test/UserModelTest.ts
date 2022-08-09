import assert from 'assert';
import conn from '../repositories/MongoDBConnection';
import { UsuarioTypes } from '../models/Usuario';
import { it } from 'mocha';
import * as _ from 'lodash';
import mongoose from 'mongoose';


describe('Usuarios Modelo', function () {
  describe('Consulta por ID', function () {
    it(`Deberia poder consultar los datos de un usuario por ID, si el objeto keys es igual a 5, significa que si trae el result set`, function () {
      let Usuario = conn.model<UsuarioTypes>('usuario');
      Usuario.findOne({ _id:mongoose.Types.ObjectId.createFromHexString('62ec4db67dfb251c94be319b')}).exec((err, usuario) => {
        if(err)throw err;
        //console.log(usuario['_doc'],Object.keys(usuario['_doc']))
        assert.equal(Object.keys(usuario['_doc']).length, 5);
      });
    });
  });
  describe('Consulta comparación resultados JSON', async function () {
    it('El objeto de una consulta por ID debería ser igual a un objeto JSON con los mismos datos', async function () {
      let UsuarioNew = conn.model<UsuarioTypes>('usuario');
      UsuarioNew.findOne({ _id:mongoose.Types.ObjectId.createFromHexString('62ec4db67dfb251c94be319b')}).exec((err, res) => {
        

      });
    })
  });
});

//process.exit(1);