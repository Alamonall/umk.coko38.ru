import api from './api'

export default {
	signup(credentials) {
		return api().post('signup', credentials)
	},
	signin(credentials) {
		return api().post('signin', credentials)
	},
}
