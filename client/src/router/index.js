import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/view/:id",
      name: "image",
      props: true,
      component: () => import("../views/ImageView.vue"),
    },
    {
      path: "/draw/:id",
      name: "draw",
      props: true,
      component: () => import("../views/drawView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/control",
      name: "control",
      component: () => import("../views/ControlView.vue"),
    },
    /* {
      path: '/svg/',
      name: 'svg',
      component: () => import('../views/SvgView.vue')
    },
    {
      path: '/vega/',
      name: 'vega',
      component: () => import('../views/vegaView.vue')
    },
    {
      path: '/plot/',
      name: 'plot',
      component: () => import('../views/plotView.vue')
    },*/
    {
      path: "/create",
      name: "create",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/CreateView.vue"),
    },
  ],
});

export default router;
