import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save

const routes = [
  {
    path: "/trang-chu",
    component: () => import("../components/TrangChu/index.vue"),
  },
  {
    path: "/dang-ky",
    component: () => import("../components/DangKy/index.vue"),
  },
  {
    path: "/dang-nhap",
    component: () => import("../components/DangNhap/index.vue"),
  },
  {
    path: "/sell",
    component: () => import("../components/Sell/index.vue"),
  },
  {
    path: "/client/kich-hoat/:hash_active",
    name: "client.kich-hoat",
    component: () => import("../components/KichHoat/index.vue"),
  },
  {
    path: "/trang-ban-hang",
    component: () => import("../components/TrangBanHang/index.vue"),
  },

];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
