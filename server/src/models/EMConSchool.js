'use strict'
module.exports = (sequelize, DataTypes) => {
	const EMConSchool = sequelize.define('EMConSchool',{
		usingCoz: DataTypes.TEXT,
		correctionCoz: DataTypes.TEXT,
		swapCoz: DataTypes.TEXT,
		studentsCount: DataTypes.INTEGER,
		isApproved: DataTypes.BOOLEAN
	})
    
	EMConSchool.associate = (models) => {
		EMConSchool.belongsTo(models.EMC, { foreignKey:'emcId' })
		EMConSchool.belongsTo(models.School, { foreignKey: 'schoolId' })
	}
	
	return EMConSchool
}