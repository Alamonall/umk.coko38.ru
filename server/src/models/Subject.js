'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    SubjectGlobalID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    code: DataTypes.INTEGER,
    name: DataTypes.STRING,
  });

  Subject.associate = (models) => {
    Subject.hasMany(models.EMC, { foreignKey: 'subjectId' });
  };

  return Subject;
};
