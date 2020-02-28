module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'testemilvus',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
