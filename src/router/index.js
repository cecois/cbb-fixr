import Vue from "vue";
import Router from "vue-router";

import FIXR from "@/components/Fixr";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/fixr",
      name: "FIXR",
      component: FIXR
    }
  ]
});
