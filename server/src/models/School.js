'use strict'
module.exports = (sequelize, DataTypes) => {
	const School = sequelize.define('School',{
		name: DataTypes.STRING,
		code: DataTypes.INTEGER,
		gia: DataTypes.INTEGER,
		areaId: DataTypes.UUID,
		people: DataTypes.INTEGER,
		isComplete: DataTypes.BOOLEAN,
		legacyId: DataTypes.UUID
	})
    
	School.associate = (models) => {
		School.belongsTo(models.Area, { foreignKey: 'areaId',	onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
		School.hasMany(models.EMConSchool, { foreignKey: 'schoolId'  })
		School.hasMany(models.User, { foreignKey: 'schoolId'})
	}
	return School
}