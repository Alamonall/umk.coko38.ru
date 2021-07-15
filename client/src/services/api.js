import dotenv from 'dotenv'
import axios from 'axios'
// eslint-disable-next-line
import store from '../store'

dotenv.config()

export default () => {
	return axios.create({
		headers: {
			Authorization: `Bearer ${store.state.token}`,
		},
	})
}
