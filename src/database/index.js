import Sequelize from 'sequelize';
// import path from 'path';
// import { readdirSync } from 'fs';
import databaseConfig from '../config/database';

import Usuarios from '../app/models/Usuarios';

import Clientes from '../app/models/Clientes';

const models = [Usuarios, Clientes];

// const modelos = readdirSync(path.join(__dirname, '../app/models/'));

// modelos.forEach(arquivoModelo => {
//   const modelo = require(path.join(
//     __dirname,
//     `../app/models/${arquivoModelo}`
//   ));

//   models.push(modelo);
// });

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
