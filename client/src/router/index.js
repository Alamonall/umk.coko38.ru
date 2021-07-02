import Vue from 'vue'
import Router from 'vue-router'
import Signup from '../components/Signup.vue'
import Signin from '../components/Signin.vue'
import Admin from '../views/Admin.vue'
import EMConSchool from '../views/EMCOnSchool.vue'
import EMConSchoolEdit from '../views/EMCOnSchoolEdit.vue'

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
			name: 'admin-view-emcs',
			path: '/admin/area/:areaCode/school/:schoolCode/subject/:subjectCode',
			component: EMConSchool,
		},
		{
			name: 'admin-emc-edit',
			path: '/admin/emc/edit',
			component: EMConSchoolEdit,
		},
		{
			name: 'admin-emc-make-official',
			path: '/admin/emc/:emcId/make-official',
			component: EMConSchool,
		},
		{
			name: 'admin-emc-make-custom',
			path: '/admin/emc/:emcId/make-custom',
			component: EMConSchool,
		},
	],
})
