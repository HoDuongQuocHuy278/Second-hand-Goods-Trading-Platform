<template>

    <body class="bg-light">
    
    <div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
      <div class="card shadow p-4" style="width: 400px; border-radius: 15px;">
        <h3 class="text-center mb-4">Đăng nhập</h3>
        <form>
          <!-- Email -->
           
          <div class="mb-3">
            <label for="email" class="form-label">Email hoặc Tên đăng nhập</label>
            <input type="email" class="form-control" id="email" placeholder="Nhập email của bạn">
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu</label>
            <input type="password" class="form-control" id="password" placeholder="Nhập mật khẩu">
          </div>

          <!-- Ghi nhớ -->
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="remember">
            <label class="form-check-label" for="remember">Ghi nhớ đăng nhập</label>
          </div>

          <!-- Nút -->
          <button v-on:click="login()" type="submit" class="btn btn-success w-100">Đăng nhập</button>

          <!-- Quên mật khẩu + Đăng ký -->
          <div class="d-flex justify-content-between mt-3">
            <a href="#">Quên mật khẩu?</a>
            <a  href="#">Đăng ký</a>
          </div>
        </form>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</template>
<script>
import axios from 'axios';
import { get } from 'v-calendar/dist/types/src/utils/helpers.js';
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://your-api-url.com/login', {
          username: this.username,
          password: this.password,
        });
        if (response.data.success) {
          alert('Đăng nhập thành công!');
          this.$router.push('/trang-chu'); // Chuyển hướng sau khi đăng nhập thành công
        } else {
          alert('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        alert('Đăng nhập thất bại. Vui lòng thử lại!');
      }
    },
  }
}
</script>
<style>
  
</style>