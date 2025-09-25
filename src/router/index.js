import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save

const routes = [
    {
        path : '/dang-nhap',
        component: ()=>import('../components/DangNhap/index.html')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router