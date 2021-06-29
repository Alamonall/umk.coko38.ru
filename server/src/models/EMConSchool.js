'use strict'
module.exports = (sequelize, DataTypes) => {
	const EMConSchool = sequelize.define('EMConSchool',{
		using_coz: DataTypes.TEXT,
		correction_coz: DataTypes.TEXT,
		swap_coz: DataTypes.TEXT,
		students_count: DataTypes.INTEGER
	})
    
	EMConSchool.associate = (models) => {}
	
	return EMConSchool
}