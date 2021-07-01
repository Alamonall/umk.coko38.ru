import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import store from './store'
import App from './App.vue'
import router from './router'

import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

sync(store, router)

/* eslint-disable no-new */
new Vue({
	store,
	router,
	vuetify,
	render: (h) => h(App),
}).$mount('#app')
