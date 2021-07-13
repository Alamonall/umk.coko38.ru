'use strict'
module.exports = (sequelize, DataTypes) => {
	const UserRole = sequelize.define('UserRole',{
		name: DataTypes.STRING,
		code: DataTypes.INTEGER
	})
    
	UserRole.associate = (models) => {
		UserRole.hasMany(models.User, { foreignKey: 'role_id' })
	}

	return UserRole
}