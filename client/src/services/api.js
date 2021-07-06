import axios from 'axios'
import store from '../store'

axios.interceptors.response.use(function (response) {
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	console.log('axios interceptors response')
	return response
}, function (error) {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error
	console.log('axios interceptors error')
	return Promise.reject(error)
})

export default () => {
	return axios.create({
		baseURL: 'http://localhost:3000/',
		headers: {
			Authorization: `Bearer ${store.state.token}`,
		},
	})
}
