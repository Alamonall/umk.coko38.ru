'use strict'
module.exports = (sequelize, DataTypes) => {
	const School = sequelize.define('School',{
		name: DataTypes.STRING,
		code: DataTypes.INTEGER,
		gia: DataTypes.INTEGER,
		area_id: DataTypes.UUID,
		people: DataTypes.INTEGER,
		is_complete: DataTypes.BOOLEAN,
		legacy_id: DataTypes.UUID
	})
    
	School.associate = (models) => {
		School.belongsTo(models.Area, { foreignKey: 'area_id',	onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
		School.belongsToMany(models.EMC, {through: 'EMConSchool' })
		School.hasMany(models.User, { foreignKey: 'school_id'})
	}
	return School
}