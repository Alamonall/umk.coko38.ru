'use strict'
module.exports = (sequelize, DataTypes) => {
	const EMConSchool = sequelize.define('EMConSchool',{
		usingCoz: DataTypes.TEXT,
		correctionCoz: DataTypes.TEXT,
		swapCoz: DataTypes.TEXT,
		studentsCount: DataTypes.INTEGER,
	})
    
	EMConSchool.associate = (models) => {}
	
	return EMConSchool
}