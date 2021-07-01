import Vue from 'vue'
import Router from 'vue-router'
import Signup from '../components/Signup.vue'
import Signin from '../components/Signin.vue'
import Admin from '../views/Admin.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: '/',
			component: Signin,
		},
		{
			path: '/signup',
			name: 'signup',
			component: Signup,
		},
		{
			path: '/admin',
			name: 'main_admin',
			component: Admin,
		},
		{
			path: '/admin/area/:areaCode',
			name: 'main_admin',
			component: Admin,
		},
	],
})
