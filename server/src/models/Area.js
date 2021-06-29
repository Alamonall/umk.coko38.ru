'use strict'
module.exports = (sequelize, DataTypes) => {
	const Area = sequelize.define('Area',{
		AreaID: {
			type: DataTypes.UUID,
			primaryKey: true
		},
		name: DataTypes.STRING,
		code: DataTypes.INTEGER,
		gia: DataTypes.INTEGER,
		isEditable: DataTypes.BOOLEAN
	})
    
	Area.associate = (models) => {
		Area.hasMany(models.School, { foreignKey:'areaId' })
		Area.hasMany(models.User, { foreignKey:'areaId'})
	}

	return Area
}