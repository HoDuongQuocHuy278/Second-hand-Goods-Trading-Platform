import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save

const routes = [
  {
    path: "/",
    component: () => import("../components/Test/index.vue"),
  },
  {
    path: "/trang-chu",
    component: () => import("../components/TrangChu/index.vue"),
  },
  {
    path: "/on-for",
    component: () => import("../components/on_for/index.vue"),
  },
  {
    path: "/dang-ki",
    component: () => import("../components/DangKi/index.vue"),
  },
  {
    path: "/dang-nhap",
    component: () => import("../components/DangNhap/index.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
