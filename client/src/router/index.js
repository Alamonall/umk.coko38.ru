import Vue from 'vue'
import Router from 'vue-router'
import Signup from '../components/Signup.vue'
import Signin from '../components/Signin.vue'
import PageNotFound from '../components/PageNotFound.vue'
import store from '../store'

import adminMainUserPage from '../components/admin/MainUserPage.vue'
import adminEMCOnSchool from '../components/admin/EMCOnSchool.vue'
import adminEMCEdit from '../components/admin/EMCEdit.vue'
import adminEMCCreate from '../components/admin/EMCCreate.vue'
import adminEMCs from '../components/admin/EMCs.vue'

import pmoMainUserPage from '../components/pmo/MainUserPage.vue'
import pmoEMCOnSchool from '../components/pmo/EMCOnSchool.vue'
import pmoEMCEdit from '../components/pmo/EMCEdit.vue'
import pmoEMCCreate from '../components/pmo/EMCCreate.vue'
import pmoEMCs from '../components/pmo/EMCs.vue'

import pooMainUserPage from '../components/poo/MainUserPage.vue'
import pooEmcOnSchool from '../components/poo/EmcOnSchool.vue'
import pooEmcEdit from '../components/poo/EmcEdit.vue'
import pooEmcCreate from '../components/poo/EmcCreate.vue'
import pooEmcs from '../components/poo/Emc.vue'

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
			name: 'admin-emcs-on-school-index',
			path: '/admin/emcs-on-school',
			component: adminEMCOnSchool,
			beforeEnter: SignedAdmin,
		},
		{
			name: 'admin-emcs-on-school',
			path: '/admin/areas/:areaCode/schools/:schoolCode/subjects/:subjectCode/emcs-on-school',
			component: adminEMCOnSchool,
			beforeEnter: SignedAdmin,
		},
		{
			name: 'admin-emcs',
			path: '/admin/emcs',
			component: adminEMCs,
			beforeEnter: SignedAdmin,
		},
		{
			name: 'admin-subject-emcs',
			path: '/admin/subjects/:subjectCode/emcs',
			component: adminEMCs,
			beforeEnter: SignedAdmin,
		},
		{
			name: 'admin-emc-create',
			path: '/admin/emcs/create',
			component: adminEMCCreate,
			beforeEnter: SignedAdmin,
		},
		{
			name: 'admin-emc-edit',
			path: '/admin/emcs/:emcId/edit',
			component: adminEMCEdit,
			beforeEnter: SignedAdmin,
		},

		{
			path: '/pmo',
			name: 'main-pmo',
			component: pmoMainUserPage,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-emcs-on-school-index',
			path: '/pmo/emcs-on-school',
			component: pmoEMCOnSchool,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-emcs-on-school',
			path: '/pmo/areas/:areaCode/schools/:schoolCode/subjects/:subjectCode/emcs-on-school',
			component: pmoEMCOnSchool,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-emcs',
			path: '/pmo/emcs',
			component: pmoEMCs,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-subject-emcs',
			path: '/pmo/subjects/:subjectCode/emcs',
			component: pmoEMCs,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-emc-create',
			path: '/pmo/emcs/create',
			component: pmoEMCCreate,
			beforeEnter: SignedPMO,
		},
		{
			name: 'pmo-emc-edit',
			path: '/pmo/emcs/:emcId/edit',
			component: pmoEMCEdit,
			beforeEnter: SignedPMO,
		},

		{
			path: '/poo',
			name: 'main-poo',
			component: pooMainUserPage,
			beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emcs-on-school',
			path: '/poo/emcs_on_school',
			component: pooEmcOnSchool,
			beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emcs',
			path: '/poo/emcs',
			component: pooEmcs,
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
