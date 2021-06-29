'use strict'
module.exports = (sequelize, DataTypes) => {
	const UserRole = sequelize.define('UserRole',{
		name: DataTypes.STRING,
		code: DataTypes.INTEGER
	})

    
	UserRole.associate = (models) => {
	}

	return UserRole
}