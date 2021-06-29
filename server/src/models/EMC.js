'use strict'
module.exports = (sequelize, DataTypes) => {
	const EMC = sequelize.define('EMC',{
		subject_id: DataTypes.INTEGER,
		type: DataTypes.INTEGER,
		gia: DataTypes.INTEGER,
		authors: DataTypes.TEXT,
		title: DataTypes.STRING,
		class: DataTypes.INTEGER,
		publisher_id: DataTypes.INTEGER,
		created_by: DataTypes.INTEGER
	})

    
	EMC.associate = (models) => {
		EMC.belongsTo(models.Publisher, { foreignKey: 'publisher_id' })
		EMC.belongsTo(models.User, { foreignKey: 'created_by' })
		EMC.belongsTo(models.Subject, { foreignKey: 'subject_id' })
		EMC.belongsToMany(models.School, {through: 'EMConSchool' })
	}

	return EMC
}