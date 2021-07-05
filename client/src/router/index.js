import Vue from 'vue'
import Router from 'vue-router'
import Signup from '../components/Signup.vue'
import Signin from '../components/Signin.vue'
import Admin from '../views/Admin.vue'
import EMCOnSchool from '../views/EMCOnSchool.vue' 
import EMCEdit from '../views/EMCEdit.vue' 
import EMCCreate from '../views/EMCCreate.vue'  
import EMCs from '../views/EMCs.vue' 
import PageNotFound from '../components/PageNotFound.vue' 

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
			name: 'main-admin',
			component: Admin,
		},
		{
			name: 'admin-emcs-on-school-index',
			path: '/admin/emcs-on-school',
			component: EMCOnSchool,
		},
		{
			name: 'admin-emcs-on-school',
			path: '/admin/areas/:areaCode/schools/:schoolCode/subjects/:subjectCode/emcs-on-school',
			component: EMCOnSchool,
		},
		{
			name: 'admin-emcs',
			path: '/admin/emcs',
			component: EMCs,
		},
		{
			name: 'admin-subject-emcs',
			path: '/admin/subjects/:subjectCode/emcs',
			component: EMCs,
		},
		{
			name: 'admin-emc-create',
			path: '/admin/emcs/create',
			component: EMCCreate,
		},
		{
			name: 'admin-emc-edit',
			path: '/admin/emcs/:emcId/edit',
			component: EMCEdit,
		},
		{ 
			path: '*', 
			component: PageNotFound 
		}
	],
})
