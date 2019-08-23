// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import moment from 'moment';
import underscore from "vue-underscore";
import vueHeadful from 'vue-headful';

Vue.component('vue-headful', vueHeadful)
Vue.use(underscore);
Vue.config.productionTip = false;
Object.defineProperty(Vue.prototype, '$MOMENT', { value: moment })
/* eslint-disable no-new */
new Vue({
	el: "#app"
	, router
	, template: "<App/>"
	, components: {
		App
	}
});

