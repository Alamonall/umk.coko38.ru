'use strict'
module.exports = (sequelize, DataTypes) => {
	const EMC = sequelize.define('EMC',{
		subjectId: DataTypes.INTEGER,
		type: DataTypes.INTEGER,
		gia: DataTypes.INTEGER,
		authors: DataTypes.TEXT,
		title: DataTypes.STRING,
		class: DataTypes.STRING,
		publisherId: DataTypes.INTEGER,
		createdBy: DataTypes.INTEGER
	})

    
	EMC.associate = (models) => {
		EMC.belongsTo(models.Publisher, { foreignKey: 'publisherId' })
		EMC.belongsTo(models.User, { foreignKey: 'createdBy' })
		EMC.belongsTo(models.Subject, { foreignKey: 'subjectId' })
		EMC.belongsToMany(models.School, {through: 'EMConSchool' })
	}

	return EMC
}