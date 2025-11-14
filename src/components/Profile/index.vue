<template>
    <div class="account-page">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="profile-mini">
                <div class="avatar-circle">T</div>
                <div>
                    <h3>{{ user.username }}</h3>
                    <p class="edit-link" @click="activeMenu = 'profile'">✏️ Sửa Hồ Sơ</p>
                </div>
            </div>

            <ul class="menu">
                <li class="section-title">Tài Khoản Của Tôi</li>
                <li :class="{ active: activeMenu === 'profile' }" @click="activeMenu = 'profile'">Hồ Sơ</li>
                <li :class="{ active: activeMenu === 'bank' }" @click="activeMenu = 'bank'">Ngân Hàng</li>
                <li :class="{ active: activeMenu === 'address' }" @click="activeMenu = 'address'">Địa Chỉ</li>
                <li :class="{ active: activeMenu === 'password' }" @click="activeMenu = 'password'">Đổi Mật Khẩu</li>

                <li class="section-title">Đơn Hàng</li>
                <li :class="{ active: activeMenu === 'orders' }" @click="activeMenu = 'orders'">Đơn Mua</li>

                <li class="section-title">Khác</li>
                <li :class="{ active: activeMenu === 'voucher' }" @click="activeMenu = 'voucher'">Kho Voucher</li>
            </ul>
        </aside>

        <!-- Nội dung -->
        <main class="main-content">
            <transition name="fade" mode="out-in">
                <div :key="activeMenu" class="content-box">
                    <!-- Hồ sơ -->
                    <div v-if="activeMenu === 'profile'">
                        <h2 class="title">Hồ Sơ Của Tôi</h2>
                        <p class="desc">Quản lý thông tin hồ sơ để bảo mật tài khoản của bạn</p>

                        <div class="profile-container">
                            <div class="form-section">
                                <div class="form-group">
                                    <label>Tên đăng nhập</label>
                                    <input type="text" v-model="user.username" disabled />
                                    <small>Tên đăng nhập chỉ có thể thay đổi một lần.</small>
                                </div>

                                <div class="form-group">
                                    <label>Tên</label>
                                    <input type="text" v-model="user.fullName" />
                                </div>

                                <div class="form-group">
                                    <label>Email</label>
                                    <div class="inline-field">
                                        <input type="text" v-model="user.email" />
                                        <a href="#" class="change-link">Thay đổi</a>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>Số điện thoại</label>
                                    <div class="inline-field">
                                        <input type="text" v-model="user.phone" />
                                        <a href="#" class="change-link">Thêm</a>
                                    </div>
                                </div>

                                <div class="form-group gender-group">
                                    <label>Giới tính</label>
                                    <div>
                                        <label><input type="radio" value="Nam" v-model="user.gender" /> Nam</label>
                                        <label><input type="radio" value="Nữ" v-model="user.gender" /> Nữ</label>
                                        <label><input type="radio" value="Khác" v-model="user.gender" /> Khác</label>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>Ngày sinh</label>
                                    <div class="dob">
                                        <select v-model="dob.day">
                                            <option disabled>Ngày</option>
                                            <option v-for="d in 31" :key="'day' + d">{{ d }}</option>
                                        </select>

                                        <select v-model="dob.month">
                                            <option disabled>Tháng</option>
                                            <option v-for="m in 12" :key="'month' + m">{{ m }}</option>
                                        </select>

                                        <select v-model="dob.year">
                                            <option disabled>Năm</option>
                                            <option v-for="y in years" :key="'year' + y">{{ y }}</option>
                                        </select>
                                    </div>
                                </div>


                                <button class="save-btn" @click="saveProfile" :disabled="isLoading">💾 Lưu Thay Đổi</button>
                            </div>

                            <div class="avatar-section">
                                <div class="avatar-preview">T</div>
                                <button class="upload-btn">Chọn Ảnh</button>
                                <p class="hint">Dung lượng file tối đa 1 MB<br />Định dạng: .JPEG, .PNG</p>
                            </div>
                        </div>
                    </div>

                    <!-- Ngân hàng -->
                    <div v-else-if="activeMenu === 'bank'">
                        <h2 class="title">Tài Khoản Ngân Hàng</h2>
                        <div class="card-box">
                            <div class="form-group">
                                <label>Tên Ngân Hàng</label>
                                <input type="text" v-model="bank.name" placeholder="Ví dụ: Vietcombank" />
                            </div>
                            <div class="form-group">
                                <label>Số Tài Khoản</label>
                                <input type="text" v-model="bank.number" placeholder="Nhập số tài khoản" />
                            </div>
                            <div class="form-group">
                                <label>Chủ Tài Khoản</label>
                                <input type="text" v-model="bank.owner" placeholder="Tên chủ tài khoản" />
                            </div>
                            <button class="save-btn" @click="saveBank" :disabled="isLoading">💳 Lưu Thông Tin</button>
                        </div>
                    </div>

                    <!-- Địa chỉ -->
                    <div v-else-if="activeMenu === 'address'">
                        <h2 class="title">Địa Chỉ Của Tôi</h2>
                        <div class="card-box">
                            <div class="form-group">
                                <label>Họ Tên Người Nhận</label>
                                <input type="text" v-model="address.name" />
                            </div>
                            <div class="form-group">
                                <label>Số Điện Thoại</label>
                                <input type="text" v-model="address.phone" />
                            </div>
                            <div class="form-group">
                                <label>Địa Chỉ Cụ Thể</label>
                                <textarea v-model="address.full" rows="3"></textarea>
                            </div>
                            <button class="save-btn" @click="saveAddress" :disabled="isLoading">📍 Lưu Địa Chỉ</button>
                        </div>
                    </div>

                    <!-- Đổi mật khẩu -->
                    <div v-else-if="activeMenu === 'password'">
                        <h2 class="title">Đổi Mật Khẩu</h2>
                        <div class="card-box">
                            <div class="form-group">
                                <label>Mật Khẩu Hiện Tại</label>
                                <input type="password" v-model="password.current" />
                            </div>
                            <div class="form-group">
                                <label>Mật Khẩu Mới</label>
                                <input type="password" v-model="password.new" />
                            </div>
                            <div class="form-group">
                                <label>Nhập Lại Mật Khẩu Mới</label>
                                <input type="password" v-model="password.confirm" />
                            </div>
                            <button class="save-btn" @click="changePassword" :disabled="isLoading">🔐 Cập Nhật Mật Khẩu</button>
                        </div>
                    </div>

                    <!-- Đơn hàng -->
                    <div v-else-if="activeMenu === 'orders'">
                        <h2 class="title">Đơn Mua Của Tôi</h2>
                        <div class="order-list">
                            <div class="order-card" v-for="(order, i) in orders" :key="i">
                                <img :src="order.image" class="order-img" />
                                <div class="order-info">
                                    <h3>{{ order.product }}</h3>
                                    <p>Số lượng: {{ order.quantity }}</p>
                                    <p>Trạng thái: <span :class="order.status.toLowerCase()">{{ order.status }}</span>
                                    </p>
                                </div>
                                <div class="order-price">{{ order.price.toLocaleString() }}₫</div>
                            </div>
                        </div>
                    </div>

                    <!-- Voucher -->
                    <div v-else-if="activeMenu === 'voucher'">
                        <h2 class="title">Kho Voucher</h2>
                        <div class="voucher-list">
                            <div v-for="(v, i) in vouchers" :key="i" class="voucher-card">
                                <h3>{{ v.title }}</h3>
                                <p>{{ v.desc }}</p>
                                <button class="save-btn small">Dùng Ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </main>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "UserProfileShopeeStyle",
    data() {
        return {
            API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/client',
            activeMenu: "profile",
            isLoading: false,
            user: { username: "toicua_toi", fullName: "Tôi", email: "toi***@gmail.com", phone: "", gender: "Nam" },
            dob: { day: "Ngày", month: "Tháng", year: "Năm" },
            bank: { name: "", number: "", owner: "" },
            address: { name: "", phone: "", full: "" },
            password: { current: "", new: "", confirm: "" },
            orders: [],
            vouchers: [],
        };
    },
    computed: {
        years() {
            const now = new Date().getFullYear();
            return Array.from({ length: 50 }, (_, i) => now - i);
        },
    },
    mounted() {
        this.fetchProfile()
        this.fetchOrders()
        this.fetchVouchers()
    },
    methods: {
        async fetchProfile() {
            this.isLoading = true
            try {
                const { data } = await axios.get(`${this.API_BASE_URL}/profile`)
                const payload = data?.data || data
                if (payload) {
                    this.user = {
                        username: payload.username || payload.ten_dang_nhap || this.user.username,
                        fullName: payload.ho_va_ten || payload.full_name || this.user.fullName,
                        email: payload.email || this.user.email,
                        phone: payload.so_dien_thoai || payload.phone || this.user.phone,
                        gender: payload.gioi_tinh || payload.gender || this.user.gender
                    }
                    if (payload.ngay_sinh) {
                        const date = new Date(payload.ngay_sinh)
                        this.dob.day = date.getDate()
                        this.dob.month = date.getMonth() + 1
                        this.dob.year = date.getFullYear()
                    }
                }
            } catch (err) {
                console.warn('Không thể tải thông tin profile', err)
            } finally {
                this.isLoading = false
            }
        },
        async fetchOrders() {
            try {
                const { data } = await axios.get(`${this.API_BASE_URL}/don-hang`)
                this.orders = data?.data || data || []
            } catch (err) {
                console.warn('Không thể tải đơn hàng', err)
                this.orders = []
            }
        },
        async fetchVouchers() {
            try {
                const { data } = await axios.get(`${this.API_BASE_URL}/voucher`)
                this.vouchers = data?.data || data || []
            } catch (err) {
                console.warn('Không thể tải voucher', err)
                this.vouchers = []
            }
        },
        async saveProfile() {
            this.isLoading = true
            try {
                const payload = {
                    ho_va_ten: this.user.fullName,
                    email: this.user.email,
                    so_dien_thoai: this.user.phone,
                    gioi_tinh: this.user.gender,
                    ngay_sinh: `${this.dob.year}-${String(this.dob.month).padStart(2, '0')}-${String(this.dob.day).padStart(2, '0')}`
                }
                await axios.put(`${this.API_BASE_URL}/profile`, payload)
                if (window?.$toast) {
                    window.$toast.success('Cập nhật hồ sơ thành công!')
                } else {
                    alert('Cập nhật hồ sơ thành công!')
                }
            } catch (err) {
                const msg = err?.response?.data?.message || 'Không thể cập nhật hồ sơ.'
                if (window?.$toast) {
                    window.$toast.error(msg)
                } else {
                    alert(msg)
                }
            } finally {
                this.isLoading = false
            }
        },
        async saveBank() {
            this.isLoading = true
            try {
                await axios.put(`${this.API_BASE_URL}/profile/bank`, this.bank)
                if (window?.$toast) {
                    window.$toast.success('Cập nhật thông tin ngân hàng thành công!')
                } else {
                    alert('Cập nhật thông tin ngân hàng thành công!')
                }
            } catch (err) {
                const msg = err?.response?.data?.message || 'Không thể cập nhật thông tin ngân hàng.'
                if (window?.$toast) {
                    window.$toast.error(msg)
                } else {
                    alert(msg)
                }
            } finally {
                this.isLoading = false
            }
        },
        async saveAddress() {
            this.isLoading = true
            try {
                await axios.put(`${this.API_BASE_URL}/profile/address`, this.address)
                if (window?.$toast) {
                    window.$toast.success('Cập nhật địa chỉ thành công!')
                } else {
                    alert('Cập nhật địa chỉ thành công!')
                }
            } catch (err) {
                const msg = err?.response?.data?.message || 'Không thể cập nhật địa chỉ.'
                if (window?.$toast) {
                    window.$toast.error(msg)
                } else {
                    alert(msg)
                }
            } finally {
                this.isLoading = false
            }
        },
        async changePassword() {
            if (this.password.new !== this.password.confirm) {
                alert('Mật khẩu nhập lại không khớp!')
                return
            }
            this.isLoading = true
            try {
                await axios.put(`${this.API_BASE_URL}/profile/password`, {
                    current_password: this.password.current,
                    new_password: this.password.new
                })
                if (window?.$toast) {
                    window.$toast.success('Đổi mật khẩu thành công!')
                } else {
                    alert('Đổi mật khẩu thành công!')
                }
                this.password = { current: "", new: "", confirm: "" }
            } catch (err) {
                const msg = err?.response?.data?.message || 'Không thể đổi mật khẩu.'
                if (window?.$toast) {
                    window.$toast.error(msg)
                } else {
                    alert(msg)
                }
            } finally {
                this.isLoading = false
            }
        }
    }
};
</script>

<style scoped>
/* 🌈 Tổng thể */
.account-page {
  display: flex;
  background: #f6f7fb;
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", sans-serif;
  color: #333;
  overflow-x: hidden;
}

/* 🧭 Sidebar */
.sidebar {
  width: 270px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 30px 22px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  height: 100vh;
}

.profile-mini {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 40px;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff784e, #ff5722);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 22px;
  box-shadow: 0 3px 6px rgba(255, 87, 34, 0.3);
}

.edit-link {
  color: #ff5722;
  font-size: 13px;
  cursor: pointer;
  margin-top: 2px;
  transition: 0.2s;
}

.edit-link:hover {
  color: #e64a19;
  text-decoration: underline;
}

.menu {
  list-style: none;
  padding: 0;
}

.section-title {
  font-size: 12px;
  color: #999;
  margin-top: 18px;
  text-transform: uppercase;
  font-weight: 600;
}

.menu li {
  padding: 10px 12px;
  border-radius: 8px;
  margin-top: 4px;
  color: #444;
  transition: 0.25s;
  cursor: pointer;
}

.menu li:hover {
  background: #fff3e0;
  color: #ff5722;
}

.menu li.active {
  background: #fff1e0;
  color: #ff5722;
  font-weight: 600;
  box-shadow: inset 0 0 0 1px #ffb48a;
}

/* 📦 Main content */
.main-content {
  flex: 1;
  padding: 50px 70px;
}

.content-box {
  background: #fff;
  border-radius: 12px;
  padding: 35px 45px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.4s ease;
}

/* ✏️ Tiêu đề */
.title {
  font-size: 24px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
}

.desc {
  font-size: 15px;
  color: #777;
  margin-bottom: 30px;
}

/* 📋 Form */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  color: #444;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  transition: all 0.25s ease;
  background-color: #fff;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #ff784e;
  box-shadow: 0 0 6px rgba(255, 112, 67, 0.25);
}

textarea {
  resize: none;
  min-height: 80px;
}

.inline-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.change-link {
  color: #ff5722;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s;
}

.change-link:hover {
  text-decoration: underline;
  color: #e64a19;
}

/* 🧍 Hồ sơ */
.profile-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.avatar-section {
  text-align: center;
  border-left: 1px solid #eee;
  padding-left: 40px;
}

.avatar-preview {
  background: linear-gradient(135deg, #ff784e, #ff5722);
  color: #fff;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  font-size: 42px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  box-shadow: 0 4px 8px rgba(255, 87, 34, 0.3);
}

.upload-btn {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 18px;
  cursor: pointer;
  transition: 0.25s;
}

.upload-btn:hover {
  border-color: #ff784e;
  color: #ff5722;
}

.hint {
  font-size: 13px;
  color: #777;
  margin-top: 8px;
}

/* 💾 Nút lưu */
.save-btn {
  background: linear-gradient(135deg, #ff784e, #ff5722);
  color: #fff;
  border: none;
  padding: 10px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s ease;
  box-shadow: 0 3px 8px rgba(255, 87, 34, 0.25);
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(255, 87, 34, 0.35);
}

.small {
  padding: 6px 14px;
  font-size: 13px;
}

/* 📅 Ngày sinh */
.dob {
  display: flex;
  gap: 10px;
}

.dob select {
  flex: 1;
}

/* 🛒 Đơn hàng */
.order-list {
  margin-top: 20px;
}

.order-card {
  display: flex;
  align-items: center;
  background: #fffaf7;
  border: 1px solid #ffe0cc;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(255, 87, 34, 0.08);
  transition: 0.25s;
}

.order-card:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 10px rgba(255, 87, 34, 0.15);
}

.order-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.order-info {
  flex: 1;
  margin-left: 15px;
}

.order-info h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.order-info p {
  font-size: 14px;
  color: #666;
  margin: 2px 0;
}

.order-price {
  font-weight: bold;
  color: #ff5722;
}

/* 🎟 Voucher */
.voucher-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.voucher-card {
  background: #fff9f5;
  border: 1px dashed #ff7043;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(255, 87, 34, 0.05);
  transition: 0.25s;
}

.voucher-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.15);
}

.voucher-card h3 {
  color: #ff5722;
  font-weight: 600;
  margin-bottom: 8px;
}

/* ✨ Hiệu ứng chuyển trang */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>