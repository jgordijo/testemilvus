module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('clientes', 'active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('clientes', 'active');
  },
};
