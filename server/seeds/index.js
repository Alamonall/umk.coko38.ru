const { sequelize,
	Publisher, User, EMC, Area, School, Subject, EMConSchool, UserRole, EMCType
} = require('../src/models')

const userSeed = require('./user.json')
const publisherSeed = require('./publisher.json')
const areaSeed = require('./area.json')
const schoolSeed = require('./school.json')
const subjectSeed = require('./subject.json')
const emcSeed = require('./emc.json')
const emconschoolSeed = require('./emconschool.json')
const userroleSeed = require('./userrole.json')
const emctypeSeed = require('./emctype.json')

sequelize.sync({force: true})
	.then(async () => {
		await Promise.all( subjectSeed.map(seed => Subject.create(seed)))		
		await Promise.all( publisherSeed.map(seed => Publisher.create(seed)))
		await Promise.all( areaSeed.map(seed => Area.create(seed)))
		await Promise.all( schoolSeed.map(seed => School.create(seed)))
		await Promise.all( userSeed.map(seed => User.create(seed)))
		await Promise.all( emcSeed.map(seed => EMC.create(seed)))
		await Promise.all( emconschoolSeed.map(seed => EMConSchool.create(seed)))
		await Promise.all( userroleSeed.map(seed => UserRole.create(seed)))
		await Promise.all( emctypeSeed.map(seed => EMCType.create(seed)))
	})
	.catch(err => console.log(err))