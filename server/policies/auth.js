const Joi = require('joi')

module.exports = {
	signup(req, res, next) {
		const schema = Joi.object({
			username: Joi.string().pattern(
				new RegExp('^[a-zA-Z0-9]{8,32}$')
			),
			password: Joi.string().pattern(
				new RegExp('^[a-zA-Z0-9]{8,32}$')
			)
		})

		const {
			error
		} = schema.validate(req.body)

		if (error) {
			switch (error.details[0].context.key) {
			case 'username':
				res.status(400).send({
					error: 'Что-то не так с логином'
				})
				break
			case 'password':
				res.status(400).send({
					error: 'Пароль должен быть соответствовать правилам'
				})
				break
			default:
				res.status(400).send({
					error: 'Неизвестная ошибка'
				})
				break
			}
		} else {
			next()
		}
	}
}