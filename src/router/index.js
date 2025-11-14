import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save

const routes = [
  {
    path: "/",
    redirect: "/trang-chu",
  },
  {
    path: "/trang-chu",
    name: "home",
    component: () => import("../components/TrangChu/index.vue"),
  },
  {
    path: "/danh-sach-san-pham",
    name: "products.list",
    component: () => import("../components/ListSanPham/index.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../components/ListSanPham/index.vue"),
  },
  {
    path: "/san-pham/:id",
    name: "products.show",
    component: () => import("../components/SanPham/index.vue"),
    props: true,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("../components/Checkout/index.vue"),
  },
  {
    path: "/gio-hang",
    name: "cart",
    component: () => import("../components/GioHang/index.vue"),
  },
  {
    path: "/dang-ky",
    name: "auth.register",
    component: () => import("../components/DangKy/index.vue"),
  },
  {
    path: "/dang-nhap",
    name: "auth.login",
    component: () => import("../components/DangNhap/index.vue"),
  },
  {
    path: "/sell",
    name: "seller.create",
    component: () => import("../components/NguoiDangBan/Sell/index.vue"),
  },
  {
    path: "/nguoi-ban/san-pham",
    name: "seller.products",
    component: () => import("../components/NguoiDangBan/SanPhamCuaToi/index.vue"),
  },
  {
    path: "/trang-ban-hang",
    name: "seller.dashboard",
    component: () => import("../components/NguoiDangBan/TrangBanHang/index.vue"),
  },
  {
    path: "/client/kich-hoat/:hash_active",
    name: "client.kich-hoat",
    component: () => import("../components/KichHoat/index.vue"),
  },
  {
    path: "/profile",
    name: "client.profile",
    component: () => import("../components/Profile/index.vue"),
  },
  {
    path: "/admin/quan-ly-nguoi-dung",
    name: "admin.qlnguoidung",
    component: () => import("../components/admin/QuanLyNguoiDung/index.vue"),
  },
  {
    path: "/admin/quan-ly-san-pham",
    name: "admin.qlsanpham",
    component: () => import("../components/admin/QuanLySanPham/index.vue"),
  },
  {
    path: "/admin/quan-ly-don-hang",
    name: "admin.qldonhang",
    component: () => import("../components/admin/QuanLyDonHang/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: {
      template: `<div class="container py-5 text-center"><h1>404</h1><p>Không tìm thấy trang.</p></div>`,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
