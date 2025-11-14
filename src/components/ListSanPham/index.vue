<template>
  <div class="product-page container py-4">
    <section class="d-flex flex-column flex-lg-row gap-3 gap-lg-4 mb-4">
      <aside class="filter-card card shadow-sm">
        <div class="card-header bg-white border-bottom">
          <h5 class="m-0 fw-semibold">Bộ lọc</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Tìm kiếm</label>
            <div class="input-group">
              <input v-model="filters.keyword" type="search" class="form-control" placeholder="Từ khóa, thương hiệu..." @keyup.enter="fetchProducts">
              <button class="btn btn-outline-secondary" type="button" @click="fetchProducts">
                <i class="bx bx-search"></i>
              </button>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Danh mục</label>
            <select v-model="filters.category" class="form-select" @change="fetchProducts">
              <option value="">Tất cả</option>
              <option v-for="cat in categories" :key="cat.slug || cat.id" :value="cat.slug || cat.id">
                {{ cat.name || cat.ten_danh_muc }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Mức giá</label>
            <select v-model="filters.price" class="form-select" @change="fetchProducts">
              <option value="all">Tất cả</option>
              <option value="0-500">Dưới 500.000đ</option>
              <option value="500-1000">500.000đ - 1.000.000đ</option>
              <option value="1000-3000">1.000.000đ - 3.000.000đ</option>
              <option value="3000-99999">Trên 3.000.000đ</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Tình trạng</label>
            <select v-model="filters.condition" class="form-select" @change="fetchProducts">
              <option value="">Tất cả</option>
              <option value="new">Mới 100%</option>
              <option value="likenew">Như mới (99%)</option>
              <option value="good">Tốt</option>
              <option value="fair">Khá</option>
            </select>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary w-50" type="button" @click="resetFilters">Đặt lại</button>
            <button class="btn btn-success w-50" type="button" @click="fetchProducts">Áp dụng</button>
          </div>
        </div>
      </aside>

      <section class="flex-grow-1">
        <header class="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-2 mb-3">
          <div>
            <h2 class="fw-bold m-0">Danh sách sản phẩm</h2>
            <p class="text-muted mb-0">Khám phá những món đồ cũ chất lượng được cập nhật mỗi ngày.</p>
          </div>
          <div class="d-flex flex-wrap align-items-center gap-2">
            <label class="text-muted small m-0">Sắp xếp:</label>
            <select v-model="filters.sort" class="form-select form-select-sm" style="width: 200px;" @change="fetchProducts">
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="popular">Bán chạy</option>
            </select>
          </div>
        </header>

        <div v-if="isLoading" class="row g-3">
          <div v-for="n in 8" :key="n" class="col-6 col-md-4 col-lg-3">
            <div class="skeleton-card">
              <div class="sk-img"></div>
              <div class="sk-line w-75"></div>
              <div class="sk-line w-50"></div>
            </div>
          </div>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
          <button type="button" class="btn btn-sm btn-outline-light ms-2" @click="fetchProducts">Thử lại</button>
        </div>

        <template v-else>
          <div v-if="products.length === 0" class="empty-state text-center p-5 border rounded-4 bg-light-subtle">
            <div class="emoji">🔍</div>
            <h5 class="fw-semibold">Không tìm thấy sản phẩm phù hợp</h5>
            <p class="text-muted">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.</p>
            <button class="btn btn-outline-secondary" type="button" @click="resetFilters">Xóa bộ lọc</button>
          </div>

          <div v-else class="row g-3 g-lg-4">
            <article v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div class="product-card card h-100 shadow-sm">
                <div class="ratio ratio-4x3">
                  <img :src="product.image || fallbackImg" class="card-img-top" :alt="product.name" @error="replaceImage($event)">
                  <span v-if="product.discount" class="badge badge-discount">-{{ product.discount }}%</span>
                </div>
                <div class="card-body d-flex flex-column">
                  <h6 class="card-title text-truncate" :title="product.name">{{ product.name }}</h6>
                  <p class="card-text text-muted small mb-2 line-clamp-2">{{ product.description }}</p>
                  <div class="d-flex align-items-baseline gap-2 mb-2">
                    <span class="price">{{ formatCurrency(finalPrice(product)) }}</span>
                    <span v-if="product.discount" class="text-muted text-decoration-line-through small">{{ formatCurrency(product.price) }}</span>
                  </div>
                  <div class="mt-auto d-flex flex-wrap gap-2">
                    <router-link :to="`/san-pham/${product.id}`" class="btn btn-outline-primary btn-sm flex-grow-1">
                      Xem chi tiết
                    </router-link>
                    <button class="btn btn-success btn-sm flex-grow-1" type="button" @click="addToCart(product)">
                      Thêm vào giỏ
                    </button>
                    <button class="btn btn-primary btn-sm flex-grow-1" type="button" @click="buyNow(product)">
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <nav v-if="pagination.last_page > 1" class="pagination-wrap d-flex justify-content-center align-items-center gap-2 mt-4">
            <button class="btn btn-outline-secondary btn-sm" type="button" :disabled="pagination.current_page === 1" @click="changePage(pagination.current_page - 1)">
              Trước
            </button>
            <span class="small text-muted">Trang {{ pagination.current_page }} / {{ pagination.last_page }}</span>
            <button class="btn btn-outline-secondary btn-sm" type="button" :disabled="pagination.current_page === pagination.last_page" @click="changePage(pagination.current_page + 1)">
              Sau
            </button>
          </nav>
        </template>
      </section>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/client'
const PRODUCTS_API = `${API_BASE_URL}/san-pham`
const CATEGORY_API = `${API_BASE_URL}/danh-muc`
const CART_STORAGE_KEY = 'fe_marketplace_cart'

const products = ref([])
const categories = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const fallbackImg = 'https://via.placeholder.com/400x300.png?text=No+Image'
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 12
})

const filters = reactive({
  keyword: '',
  category: '',
  price: 'all',
  condition: '',
  sort: 'newest'
})

// Đọc query parameters từ URL khi component mount hoặc route thay đổi
function loadQueryParams() {
  const query = route.query
  if (query.category) {
    filters.category = query.category
  }
  if (query.q) {
    filters.keyword = query.q
  }
  if (query.sort) {
    filters.sort = query.sort
  }
  if (query.page) {
    pagination.current_page = parseInt(query.page) || 1
  }
}

onMounted(() => {
  loadQueryParams()
  fetchInitialData()
})

// Watch route changes để cập nhật filters khi URL thay đổi
watch(() => route.query, () => {
  loadQueryParams()
  fetchProducts()
}, { deep: true })

async function fetchInitialData() {
  await Promise.allSettled([fetchCategories(), fetchProducts()])
}

async function fetchCategories() {
  try {
    const { data } = await axios.get(CATEGORY_API)
    const rawCategories = data?.data || data || []
    // Map field names từ backend (ten_danh_muc -> name)
    categories.value = Array.isArray(rawCategories) 
      ? rawCategories.map(cat => ({
          id: cat.id,
          name: cat.ten_danh_muc || cat.name,
          slug: cat.slug,
          mo_ta: cat.mo_ta,
          hinh_anh: cat.hinh_anh,
        }))
      : []
  } catch (err) {
    console.warn('Không thể tải danh mục', err)
    categories.value = []
  }
}

function buildParams() {
  const params = {
    page: pagination.current_page,
    sort: filters.sort
  }
  if (filters.keyword) params.q = filters.keyword
  if (filters.category) params.category = filters.category
  if (filters.condition) params.condition = filters.condition
  if (filters.price && filters.price !== 'all') {
    const [min, max] = filters.price.split('-').map(Number)
    params.price_min = min * 1000
    if (max && max < 99999) {
      params.price_max = max * 1000
    }
  }
  return params
}

async function fetchProducts() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data } = await axios.get(PRODUCTS_API, { params: buildParams() })
    const payload = data?.data || data
    if (payload?.data) {
      products.value = payload.data
      pagination.current_page = Number(payload.current_page || 1)
      pagination.last_page = Number(payload.last_page || 1)
      pagination.total = Number(payload.total || payload.data.length)
      pagination.per_page = Number(payload.per_page || pagination.per_page)
    } else if (Array.isArray(payload)) {
      products.value = payload
      pagination.current_page = 1
      pagination.last_page = 1
      pagination.total = payload.length
    } else {
      products.value = []
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = err?.response?.data?.message || 'Không thể tải danh sách sản phẩm.'
  } finally {
    isLoading.value = false
  }
}

function resetFilters() {
  filters.keyword = ''
  filters.category = ''
  filters.price = 'all'
  filters.condition = ''
  filters.sort = 'newest'
  pagination.current_page = 1
  fetchProducts()
}

function changePage(next) {
  if (next < 1 || next > pagination.last_page) return
  pagination.current_page = next
  fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function finalPrice(product) {
  const base = Number(product?.price || 0)
  const discount = Number(product?.discount || 0)
  return base * (1 - discount / 100)
}

function formatCurrency(value) {
  return (Number(value) || 0).toLocaleString('vi-VN') + ' ₫'
}

function replaceImage(event) {
  event.target.src = fallbackImg
}

function addToCart(product) {
  const raw = localStorage.getItem(CART_STORAGE_KEY)
  const list = raw ? JSON.parse(raw) : []
  const idx = Array.isArray(list) ? list.findIndex(item => item.id === product.id) : -1
  if (idx > -1) {
    list[idx].quantity = Math.min(99, Number(list[idx].quantity || 0) + 1)
  } else {
    list.push({
      id: product.id,
      name: product.name,
      price: Number(finalPrice(product)),
      quantity: 1,
      image: product.image || fallbackImg,
      category: product.category || ''
    })
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(list))
  // Nếu có plugin toast có thể gọi, còn không dùng alert
  if (typeof window !== 'undefined' && window?.$toast) {
    window.$toast.success('Đã thêm vào giỏ hàng!')
  } else {
    alert('Đã thêm vào giỏ hàng!')
  }
}

function buyNow(product) {
  if (!product?.id) return
  router.push({
    name: 'checkout',
    query: {
      product_id: product.id,
    },
  })
}
</script>

<style scoped>
.product-page {
  min-height: 70vh;
}
.filter-card {
  width: 100%;
  max-width: 280px;
}
.product-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12) !important;
}
.card-img-top {
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.badge-discount {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ef4444;
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 8px 16px rgba(239, 68, 68, 0.25);
}
.price {
  font-weight: 700;
  color: #16a34a;
}
.empty-state .emoji {
  font-size: 40px;
  margin-bottom: 8px;
}
.skeleton-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 220px;
  animation: pulse 1.6s infinite;
}
.sk-img {
  flex: 1;
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.25);
}
.sk-line {
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
}
.w-75 {
  width: 75%;
}
.w-50 {
  width: 50%;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.65;
  }
  100% {
    opacity: 1;
  }
}
@media (max-width: 992px) {
  .filter-card {
    max-width: none;
  }
}
</style>

