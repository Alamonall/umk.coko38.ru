'use strict';
module.exports = (sequelize, DataTypes) => {
  const Publisher = sequelize.define('Publisher', {
    name: DataTypes.STRING,
  });

  Publisher.associate = (models) => {
    Publisher.hasMany(models.EMC, { foreignKey: 'publisherId' });
  };

  return Publisher;
};
