'use strict';
module.exports = (sequelize, DataTypes) => {
  const EMCOnSchool = sequelize.define('EMCOnSchool', {
    usingCoz: DataTypes.TEXT,
    correctionCoz: DataTypes.TEXT,
    swapCoz: DataTypes.TEXT,
    studentsCount: DataTypes.INTEGER,
    isApproved: DataTypes.BOOLEAN,
  });

  EMCOnSchool.associate = (models) => {
    EMCOnSchool.belongsTo(models.EMC, { foreignKey: 'emcId' });
    EMCOnSchool.belongsTo(models.School, { foreignKey: 'schoolId' });
  };

  return EMCOnSchool;
};
