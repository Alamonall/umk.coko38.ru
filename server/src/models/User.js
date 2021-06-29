const bcrypt = require('bcrypt')

function hashPassword (user, options){
	const SALT_FACTOR = 8
  
	if(!user.changed('password')){
		return
	}

	return bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if(err) console.log(err)
    bcrypt.hash(user.password, salt, (err, hash) => {
			if(err) console.log(err)
			user.setDataValue('password', hash)
    })
	})
}

module.exports = (sequelize, DataTypes) => { 
	const User = sequelize.define('User', {
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		email: DataTypes.STRING,
		role_code: DataTypes.INTEGER,
		gia: DataTypes.INTEGER,
		school_id: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Schools', // Can be both a string representing the table name or a Sequelize model
				key: 'id'
			},
			onDelete: 'NO ACTION',
			onUpdate: 'NO ACTION'
		},
		area_id: {
			type: DataTypes.UUID,
			references: {
				model: 'Areas', // Can be both a string representing the table name or a Sequelize model
				key: 'AreaID'
			},
			onDelete: 'NO ACTION',
			onUpdate: 'NO ACTION'
		}
	}, {
		hooks: {
			beforeCreate: hashPassword,
			beforeUpdate: hashPassword,
			beforeSave: hashPassword
		}
	})
	try {
		User.prototype.comparePassword = async (password) => {
			return await bcrypt.compare(password, this.password)
		}
	} catch (err) { console.log(err)}

	User.associate = (models) => {
	}
  
	return User
}