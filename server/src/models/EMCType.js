'use strict'
module.exports = (sequelize, DataTypes) => {
	const EMCType = sequelize.define('EMCType',{
		name: DataTypes.STRING,
		code: DataTypes.INTEGER
	})

    
	EMCType.associate = (models) => {
	}

	return EMCType
}