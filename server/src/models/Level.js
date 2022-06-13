'use strict';
module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define('Level', {
    name: DataTypes.STRING,
    code: DataTypes.INTEGER,
  });

  Level.associate = (models) => {
    Level.hasMany(models.EMC, { foreignKey: 'levelId' });
  };

  return Level;
};
