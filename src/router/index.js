import Vue from "vue";
import Router from "vue-router";
import JKR from "@/components/JKR";
Vue.use(Router);
export default new Router({
	routes: [{
		path: "/"
		, name: "JKR"
		, component: JKR
	}]
});