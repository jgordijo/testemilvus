module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usuarios', 'active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('usuarios', 'active');
  },
};
