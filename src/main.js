// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import moment from 'moment';
import underscore from "vue-underscore";
import vueHeadful from 'vue-headful';
import vueTopprogress from 'vue-top-progress'

const TURFSIMPLE = require('@turf/simplify').default
const TURFCLEAN = require('@turf/clean-coords').default
const TURFMETA = require('@turf/meta')

Vue.component('vue-headful', vueHeadful)
Vue.use(underscore);
Vue.use(vueTopprogress,{color:"#ffffff"})
Vue.config.productionTip = false;
Object.defineProperty(Vue.prototype, '$MOMENT', { value: moment })
Object.defineProperty(Vue.prototype, '$TURFSIMPLE', { value: TURFSIMPLE })
Object.defineProperty(Vue.prototype, '$TURFCLEAN', { value: TURFCLEAN })
Object.defineProperty(Vue.prototype, '$TURFMETA', { value: TURFMETA })
/* eslint-disable no-new */
new Vue({
	el: "#app"
	, router
	, template: "<App/>"
	, components: {
		App
	}
});

