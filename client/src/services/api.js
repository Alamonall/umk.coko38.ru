import axios from 'axios'
// eslint-disable-next-line
import store from '../store'

export default () => {
	return axios.create({
		baseURL: 'https://umk.coko38.ru/',
		headers: {
			Authorization: `Bearer ${store.state.token}`,
		},
	})
}
