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

async function getUserRole(user, options){
	try {		
		const {UserRole} = require('./index')
		const role = await UserRole.findOne({ where: { id: user.role_id } })
		user.setDataValue('role_id', role.id)
	} catch (err) { console.error(err)}
}

module.exports = (sequelize, DataTypes) => { 
	const User = sequelize.define('User', {
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		email: DataTypes.STRING,
		role_id: DataTypes.INTEGER,
		gia: DataTypes.INTEGER,
		schoolId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Schools', // Can be both a string representing the table name or a Sequelize model
				key: 'id'
			},
			onDelete: 'NO ACTION',
			onUpdate: 'NO ACTION'
		},
		areaId: {
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
			beforeCreate: [hashPassword, getUserRole],
			beforeUpdate: hashPassword,
			beforeSave: hashPassword
		}
	})
	try {
		User.prototype.comparePassword = async function (password) {
			console.log(password)
			console.log(this.password)
			return await bcrypt.compare(password, this.password)
		}
	} catch (err) { console.log(err)}

	User.associate = (models) => {
		User.hasMany(models.EMC, { foreignKey:'createdBy' })
		User.belongsTo(models.UserRole, { foreignKey:'role_id' })
	}
  
	return User
}
