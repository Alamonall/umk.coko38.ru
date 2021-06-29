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
		is_editable: DataTypes.BOOLEAN
	})
    
	Area.associate = (models) => {
		Area.hasMany(models.School, { foreignKey:'area_id' })
		Area.hasMany(models.User, { foreignKey:'area_id'})
	}

	return Area
}