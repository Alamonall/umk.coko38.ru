'use strict'
module.exports = (sequelize, DataTypes) => {
	const EMC = sequelize.define('EMC',{
		subjectId: DataTypes.INTEGER,
		isCustom: DataTypes.BOOLEAN,
		gia: DataTypes.INTEGER,
		authors: DataTypes.TEXT,
		title: DataTypes.STRING,
		grades: DataTypes.STRING,
		level: DataTypes.INTEGER,
		publisherId: DataTypes.INTEGER,
		createdBy: DataTypes.INTEGER
	})

    
	EMC.associate = (models) => {
		EMC.belongsTo(models.Publisher, { foreignKey: 'publisherId' })
		EMC.belongsTo(models.User, { foreignKey: 'createdBy' })
		EMC.belongsTo(models.Subject, { foreignKey: 'subjectId' })
		EMC.hasMany(models.EMCOnSchool, { foreignKey: 'emcId' })
	}

	return EMC
}