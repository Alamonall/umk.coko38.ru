import Vue from 'vue'
import Router from 'vue-router'
import Signup from '../components/Signup.vue'
import Signin from '../components/Signin.vue'
import PageNotFound from '../components/PageNotFound.vue'
import store from '../store'

import adminMainUserPage from '../components/admin/MainUserPage.vue'
import adminEmcOnSchool from '../components/admin/EMCOnSchool.vue'
import adminEmcEdit from '../components/admin/EMCEdit.vue'
import adminEmcCreate from '../components/admin/EMCCreate.vue'
import adminEmc from '../components/admin/EMC.vue'

import pmoMainUserPage from '../components/pmo/MainUserPage.vue'
import pmoEmcOnSchool from '../components/pmo/EMCOnSchool.vue'
import pmoEmcEdit from '../components/pmo/EMCEdit.vue'
import pmoEmcCreate from '../components/pmo/EMCCreate.vue'
import pmoEmc from '../components/pmo/EMC.vue'

import pooMainUserPage from '../components/poo/MainUserPage.vue'
import pooEmcOnSchool from '../components/poo/EMCOnSchool.vue'
import pooEmcEdit from '../components/poo/EMCEdit.vue'
import pooEmcCreate from '../components/poo/EMCCreate.vue'
import pooEmc from '../components/poo/EMC.vue'

Vue.use(Router)

const SignedAdmin = (to, from, next) => {
	if (store.state.isSignin && store.state.user.UserRole.code === 1) {
		next()
		return
	}
	next('/')
}

const SignedPMO = (to, from, next) => {
	if (store.state.isSignin && store.state.user.UserRole.code === 2) {
		next()
		return
	}
	next('/')
}

const SignedPOO = (to, from, next) => {
	console.log('Signed poo: ', store.state.isSignin && store.state.user.UserRole.code === 3)
	if (store.state.isSignin && store.state.user.UserRole.code === 3) {
		next()
		return
	}
	next('/')
}

export default new Router({
	mode: 'history',
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
			name: 'main-admin',
			component: adminMainUserPage,
			beforeEnter: SignedAdmin,
		},
		{
			name: 'admin-emc-on-school',
			path: '/admin/list_emc_on_school',
			component: adminEmcOnSchool,
			beforeEnter: SignedAdmin,
		},
		{
			name: 'admin-emc',
			path: '/admin/list_emc',
			component: adminEmc,
			beforeEnter: SignedAdmin,
		},
		{
			name: 'admin-emc-create',
			path: '/admin/create_emc',
			component: adminEmcCreate,
			beforeEnter: SignedAdmin,
		},
		{
			name: 'admin-emc-edit',
			path: '/admin/update_emc',
			component: adminEmcEdit,
			beforeEnter: SignedAdmin,
		},

		{
			path: '/pmo',
			name: 'main-pmo',
			component: pmoMainUserPage,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-emc-on-school',
			path: '/pmo/list_emc_on_school',
			component: pmoEmcOnSchool,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-emc',
			path: '/pmo/list_emc',
			component: pmoEmc,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-emc-create',
			path: '/pmo/create_emc',
			component: pmoEmcCreate,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-emc-edit',
			path: '/pmo/update_emc',
			component: pmoEmcEdit,
			beforeEnter: SignedPMO,
		},

		{
			path: '/poo',
			name: 'main-poo',
			component: pooMainUserPage,
			beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emc-on-school',
			path: '/poo/list_emc_on_school',
			component: pooEmcOnSchool,
			beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emc',
			path: '/poo/emc',
			component: pooEmc,
			beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emc-create',
			path: '/poo/create_emc',
			component: pooEmcCreate,
			beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emc-edit',
			path: '/poo/update_emc',
			component: pooEmcEdit,
			beforeEnter: SignedPOO,
		},

		{
			path: '*',
			component: PageNotFound,
		},
	],
})
