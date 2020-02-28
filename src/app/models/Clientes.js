import Sequelize, { Model } from 'sequelize';

class Clientes extends Model {
  static init(sequelize) {
    super.init(
      {
        cnpj: Sequelize.INTEGER,
        nome_fantasia: Sequelize.STRING,
        razao_social: Sequelize.STRING,
        cep: Sequelize.STRING,
        logradouro: Sequelize.STRING,
        numero: Sequelize.INTEGER,
        complemento: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Clientes;
