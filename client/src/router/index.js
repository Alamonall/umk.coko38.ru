import Vue from 'vue'
import Router from 'vue-router' 
import Signup from '../components/Signup.vue' 
import Signin from '../components/Signin.vue' 
import PageNotFound from '../components/PageNotFound.vue' 
import store from '../store'

import adminMainUserPage from '../components/Admin/MainUserPage.vue'
import adminEMCOnSchool from '../components/Admin/EMCOnSchool.vue' 
import adminEMCEdit from '../components/Admin/EMCEdit.vue' 
import adminEMCCreate from '../components/Admin/EMCCreate.vue'  
import adminEMCs from '../components/Admin/EMCs.vue' 

import pmoMainUserPage from '../components/PMO/MainUserPage.vue'
import pmoEMCOnSchool from '../components/PMO/EMCOnSchool.vue' 
import pmoEMCEdit from '../components/PMO/EMCEdit.vue' 
import pmoEMCCreate from '../components/PMO/EMCCreate.vue'  
import pmoEMCs from '../components/PMO/EMCs.vue' 

import pooMainUserPage from '../components/POO/MainUserPage.vue'
import pooEMCOnSchool from '../components/POO/EMCOnSchool.vue' 
import pooEMCEdit from '../components/POO/EMCEdit.vue' 
import pooEMCCreate from '../components/POO/EMCCreate.vue'  
import pooEMCs from '../components/POO/EMCs.vue' 

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
  if (store.state.isSignin && store.state.user.UserRole.code === 3) {
    next()
    return
  }
  next('/')
}

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
			name: 'poo-emcs-on-school-index',
			path: '/poo/emcs-on-school',
			component: pooEMCOnSchool,
      beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emcs-on-school',
			path: '/poo/areas/:areaCode/schools/:schoolCode/subjects/:subjectCode/emcs-on-school',
			component: pooEMCOnSchool,
      beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emcs',
			path: '/poo/emcs',
			component: pooEMCs,
      beforeEnter: SignedPOO,
		},
		{
			name: 'poo-subject-emcs',
			path: '/poo/subjects/:subjectCode/emcs',
			component: pooEMCs,
      beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emc-create',
			path: '/poo/emcs/create',
			component: pooEMCCreate,
      beforeEnter: SignedPOO,
		},
		{
			name: 'poo-emc-edit',
			path: '/poo/emcs/:emcId/edit',
			component: pooEMCEdit,
      beforeEnter: SignedPOO,
		},

		{ 
			path: '*', 
			component: PageNotFound 
		}
	],
})
