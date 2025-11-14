<template>
  <div class="seller-page container py-4">
    <header class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-between gap-3 mb-4">
      <div>
        <h2 class="fw-bold m-0">Sản phẩm của tôi</h2>
        <p class="text-muted mb-0">Quản lý kho hàng, cập nhật trạng thái và theo dõi lượt xem.</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <router-link to="/sell" class="btn btn-success">
          <i class="bx bx-plus-circle me-1"></i> Đăng sản phẩm mới
        </router-link>
        <button class="btn btn-outline-secondary" type="button" @click="fetchProducts">
          <i class="bx bx-refresh me-1"></i> Làm mới
        </button>
      </div>
    </header>

    <section class="card shadow-sm">
      <div class="card-body">
        <div class="row g-3 align-items-center mb-3">
          <div class="col-md-4">
            <label class="form-label text-muted small mb-1">Tìm kiếm</label>
            <div class="input-group">
              <input v-model.trim="filters.keyword" type="search" class="form-control" placeholder="Tên, mã sản phẩm..." @keyup.enter="fetchProducts">
              <button class="btn btn-outline-secondary" type="button" @click="fetchProducts"><i class="bx bx-search"></i></button>
            </div>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Trạng thái</label>
            <select v-model="filters.status" class="form-select" @change="fetchProducts">
              <option value="all">Tất cả</option>
              <option value="published">Đang hiển thị</option>
              <option value="draft">Bản nháp</option>
              <option value="sold">Đã bán</option>
              <option value="hidden">Tạm ẩn</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small mb-1">Sắp xếp</label>
            <select v-model="filters.sort" class="form-select" @change="fetchProducts">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="views_desc">Lượt xem nhiều</option>
            </select>
          </div>
          <div class="col-md-2 d-grid">
            <button class="btn btn-outline-secondary" type="button" @click="resetFilters">Đặt lại</button>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{{ errorMessage }}</span>
          <button class="btn btn-sm btn-light" type="button" @click="fetchProducts">Thử lại</button>
        </div>

        <template v-else>
          <div v-if="products.length === 0" class="empty-state text-center p-5 border border-dashed rounded-4">
            <div class="emoji mb-2">📦</div>
            <h5 class="fw-semibold">Chưa có sản phẩm nào</h5>
            <p class="text-muted mb-3">Đăng sản phẩm đầu tiên để tiếp cận hàng nghìn người mua mỗi ngày.</p>
            <router-link to="/sell" class="btn btn-success">Đăng bán ngay</router-link>
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle">
              <thead class="table-light">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Lượt xem</th>
                  <th>Cập nhật</th>
                  <th>Trạng thái</th>
                  <th class="text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in products" :key="item.id">
                  <td>
                    <div class="d-flex align-items-center gap-3">
                      <img :src="item.image || fallbackImg" class="thumb" :alt="item.name" @error="onImgError($event)">
                      <div>
                        <h6 class="mb-1 text-truncate" :title="item.name">{{ item.name }}</h6>
                        <p class="text-muted small mb-0">{{ item.category?.name || item.category || 'Danh mục khác' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="fw-semibold">{{ formatCurrency(item.price) }}</td>
                  <td>{{ item.quantity || item.stock || 0 }}</td>
                  <td>{{ item.views || 0 }}</td>
                  <td>{{ formatDate(item.updated_at || item.created_at) }}</td>
                  <td>
                    <span :class="['badge', statusBadge(item.status)]">{{ statusLabel(item.status) }}</span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group">
                      <router-link class="btn btn-sm btn-outline-primary" :to="`/san-pham/${item.id}`">Xem</router-link>
                      <button class="btn btn-sm btn-outline-secondary" type="button" @click="togglePublish(item)">
                        {{ item.status === 'published' ? 'Ẩn' : 'Hiển thị' }}
                      </button>
                      <button class="btn btn-sm btn-outline-danger" type="button" @click="removeProduct(item)">Xóa</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SanPhamCuaToi',
  data() {
    return {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/client',
      fallbackImg: 'https://via.placeholder.com/120x120.png?text=No+Image',
      filters: {
        keyword: '',
        status: 'all',
        sort: 'newest'
      },
      products: [],
      isLoading: false,
      errorMessage: ''
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true
      this.errorMessage = ''
      try {
        const { data } = await axios.get(`${this.API_BASE_URL}/seller/products`, { params: { ...this.filters } })
        this.products = data?.data || data || []
      } catch (err) {
        console.error(err)
        this.errorMessage = err?.response?.data?.message || 'Không thể tải danh sách sản phẩm.'
        this.products = []
      } finally {
        this.isLoading = false
      }
    },
    resetFilters() {
      this.filters.keyword = ''
      this.filters.status = 'all'
      this.filters.sort = 'newest'
      this.fetchProducts()
    },
    async togglePublish(item) {
      try {
        const { data } = await axios.post(`${this.API_BASE_URL}/seller/products/${item.id}/toggle`)
        if (data?.status === false) throw new Error(data?.message || 'Không thể cập nhật trạng thái.')
        item.status = data?.data?.status || (item.status === 'published' ? 'hidden' : 'published')
      } catch (err) {
        alert(err?.response?.data?.message || err.message || 'Không thể cập nhật trạng thái.')
      }
    },
    async removeProduct(item) {
      if (!confirm(`Bạn chắc chắn muốn xóa "${item.name}"?`)) return
      try {
        await axios.delete(`${this.API_BASE_URL}/seller/products/${item.id}`)
        this.products = this.products.filter(p => p.id !== item.id)
      } catch (err) {
        alert(err?.response?.data?.message || err.message || 'Không thể xóa sản phẩm.')
      }
    },
    formatCurrency(value) {
      return (Number(value) || 0).toLocaleString('vi-VN') + ' ₫'
    },
    statusBadge(status) {
      switch (status) {
        case 'published':
          return 'bg-success-subtle text-success'
        case 'draft':
          return 'bg-warning-subtle text-warning'
        case 'sold':
          return 'bg-primary-subtle text-primary'
        default:
          return 'bg-secondary-subtle text-secondary'
      }
    },
    statusLabel(status) {
      switch (status) {
        case 'published':
          return 'Đang hiển thị'
        case 'draft':
          return 'Bản nháp'
        case 'sold':
          return 'Đã bán'
        case 'hidden':
        default:
          return 'Tạm ẩn'
      }
    },
    onImgError(event) {
      event.target.src = this.fallbackImg
    },
    formatDate(value) {
      if (!value) return '—'
      try {
        const date = new Date(value)
        return date.toLocaleDateString('vi-VN')
      } catch {
        return value
      }
    }
  }
}
</script>

<style scoped>
.seller-page {
  min-height: 70vh;
}
.empty-state {
  border-style: dashed !important;
  background: #f8fafc;
}
.empty-state .emoji {
  font-size: 44px;
}
.thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
.table td, .table th {
  vertical-align: middle;
}
</style>


