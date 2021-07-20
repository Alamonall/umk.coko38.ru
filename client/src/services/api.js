import axios from 'axios'
// eslint-disable-next-line
import store from '../store'

export default () => {
	return axios.create({
		headers: {
			Authorization: `Bearer ${store.state.token}`,
		},
	})
}
