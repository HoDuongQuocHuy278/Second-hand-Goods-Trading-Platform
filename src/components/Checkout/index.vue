<template>
  <div class="checkout-page container py-4">
    <div class="mb-4">
      <button class="btn btn-link ps-0" type="button" @click="router.back()">
        ← Quay lại
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center justify-content-between">
      <span>{{ errorMessage }}</span>
      <button class="btn btn-sm btn-outline-light" type="button" @click="loadProduct">Thử lại</button>
    </div>

    <div v-if="orderResult" class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm border-success-subtle">
          <div class="card-header bg-success text-white fw-semibold">
            Đặt hàng thành công
          </div>
          <div class="card-body">
            <p class="text-muted">Mã đơn: <strong>{{ orderResult.ma_don_hang }}</strong></p>
            <p class="mb-1"><strong>Sản phẩm:</strong> {{ orderResult?.san_pham?.ten_san_pham || product?.name }}</p>
            <p class="mb-1"><strong>Số lượng:</strong> {{ orderResult.so_luong }}</p>
            <p class="mb-1"><strong>Tổng tiền:</strong> {{ formatCurrency(orderResult.tong_tien) }}</p>
            <p class="mb-1"><strong>Phương thức thanh toán:</strong> {{ getPaymentLabel(orderResult.payment_method) }}</p>
            <p class="text-muted small mt-3">
              {{ paymentInstruction(orderResult.payment_method) }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="fw-semibold">Bước tiếp theo</h5>
            <ul class="list-unstyled small text-muted mb-3">
              <li>• Kiểm tra email/SMS xác nhận.</li>
              <li>• Liên hệ người bán để thống nhất giao hàng.</li>
              <li>• Theo dõi trạng thái đơn trong mục đơn hàng.</li>
            </ul>
            <button class="btn btn-success w-100 mb-2" type="button" @click="router.push('/trang-chu')">
              Về trang chủ
            </button>
            <button class="btn btn-outline-primary w-100" type="button" @click="router.push(`/san-pham/${orderResult.san_pham_id}`)">
              Xem lại sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading && product" class="row g-4">
      <div class="col-lg-8">
        <section class="card shadow-sm">
          <div class="card-header bg-white border-bottom">
            <h5 class="m-0 fw-semibold">Thông tin người mua</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
                <input v-model="form.buyer_name" type="text" class="form-control" placeholder="Nguyễn Văn A" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại</label>
                <input v-model="form.buyer_phone" type="tel" class="form-control" placeholder="0123 456 789">
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="form.buyer_email" type="email" class="form-control" placeholder="ban@example.com">
              </div>
              <div class="col-md-6">
                <label class="form-label">Địa chỉ nhận hàng</label>
                <input v-model="form.shipping_address" type="text" class="form-control" placeholder="Số nhà, đường, quận/huyện">
              </div>
            </div>

            <div class="mt-4">
              <label class="form-label">Ghi chú cho người bán</label>
              <textarea v-model="form.notes" class="form-control" rows="3" placeholder="Ví dụ: Giao chiều thứ 7, gọi mình trước 30 phút..."></textarea>
            </div>
          </div>
        </section>

        <section class="card shadow-sm mt-4">
          <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 class="m-0 fw-semibold">Phương thức thanh toán</h5>
            <span class="badge bg-success-subtle text-success">Bảo mật 100%</span>
          </div>
          <div class="card-body">
            <div class="payment-grid">
              <label
                v-for="option in paymentOptions"
                :key="option.value"
                class="payment-card"
                :class="{ active: form.payment_method === option.value }"
              >
                <input
                  type="radio"
                  class="form-check-input me-2"
                  :value="option.value"
                  v-model="form.payment_method"
                >
                <div>
                  <div class="fw-semibold">{{ option.label }}</div>
                  <div class="text-muted small">{{ option.desc }}</div>
                </div>
                <span class="badge bg-light text-muted ms-auto">{{ option.badge }}</span>
              </label>
            </div>
            <p class="text-muted small mt-3">
              {{ paymentInstruction(form.payment_method) }}
            </p>
          </div>
        </section>
      </div>

      <div class="col-lg-4">
        <section class="card summary-card shadow-sm">
          <div class="card-header bg-white">
            <h5 class="fw-semibold m-0">Chi tiết hóa đơn</h5>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center gap-3 mb-3">
              <img :src="productImage" alt="product" class="summary-thumb" @error="onImgError">
              <div>
                <p class="fw-semibold mb-1">{{ product?.name || 'Đang tải...' }}</p>
                <p class="text-muted small mb-0">{{ product?.category?.name || product?.category || 'Danh mục khác' }}</p>
              </div>
            </div>

            <div class="d-flex align-items-center justify-content-between mb-3">
              <span class="text-muted">Đơn giá</span>
              <span class="fw-semibold">{{ formatCurrency(product?.price || 0) }}</span>
            </div>

            <div class="mb-3">
              <label class="form-label small text-muted">Số lượng</label>
              <div class="quantity-control">
                <button class="btn btn-sm btn-light" type="button" @click="changeQuantity(-1)" :disabled="form.quantity <= 1">−</button>
                <input type="number" min="1" max="99" v-model.number="form.quantity" @input="clampQuantity">
                <button class="btn btn-sm btn-light" type="button" @click="changeQuantity(1)">＋</button>
              </div>
            </div>

            <hr>

            <div class="d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>{{ formatCurrency(totalAmount) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <div class="d-flex justify-content-between fw-semibold fs-5 mt-3">
              <span>Tổng tiền</span>
              <span>{{ formatCurrency(totalAmount) }}</span>
            </div>

            <button
              class="btn btn-success w-100 mt-4"
              type="button"
              :disabled="submitting || !product"
              @click="submitOrder"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              Xác nhận &amp; thanh toán
            </button>
          </div>
        </section>
      </div>
    </div>

    <div v-else-if="isLoading" class="d-flex justify-content-center align-items-center py-5">
      <div class="text-center">
        <div class="spinner-border text-success mb-3" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="text-muted">Đang tải thông tin sản phẩm...</p>
        <p class="text-muted small">Product ID: {{ productId }}</p>
      </div>
    </div>

    <div v-else-if="!productId && !isLoading" class="alert alert-warning">
      <h5>Không tìm thấy sản phẩm</h5>
      <p>Vui lòng chọn sản phẩm để tiếp tục thanh toán.</p>
      <router-link to="/danh-sach-san-pham" class="btn btn-primary">Xem sản phẩm</router-link>
    </div>

    <div v-else-if="!product && !isLoading && productId" class="alert alert-danger">
      <h5>Không thể tải thông tin sản phẩm</h5>
      <p>{{ errorMessage || 'Có lỗi xảy ra khi tải thông tin sản phẩm.' }}</p>
      <button class="btn btn-primary" type="button" @click="loadProduct">Thử lại</button>
      <router-link to="/danh-sach-san-pham" class="btn btn-outline-secondary ms-2">Xem sản phẩm khác</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/client'

const product = ref(null)
const isLoading = ref(true) // Bắt đầu với true để hiển thị loading
const errorMessage = ref('')
const orderResult = ref(null)
const submitting = ref(false)

const form = reactive({
  buyer_name: '',
  buyer_email: '',
  buyer_phone: '',
  shipping_address: '',
  notes: '',
  quantity: Number(route.query.quantity || 1) || 1,
  payment_method: 'vnpay'
})

const paymentOptions = [
  { value: 'vnpay', label: 'Ví VNPAY', desc: 'Thanh toán online qua QR hoặc thẻ liên kết.', badge: 'Khuyến nghị' },
  { value: 'momo', label: 'Ví MoMo', desc: 'Quét mã hoặc thanh toán trên app MoMo.', badge: 'Phổ biến' },
  { value: 'cash', label: 'Tiền mặt (COD)', desc: 'Thanh toán khi nhận hàng.', badge: 'Tiện lợi' }
]

const productId = computed(() => route.query.product_id || route.query.product || null)

const totalAmount = computed(() => {
  if (!product.value) return 0
  const price = Number(product.value.price || 0)
  return price * Math.max(1, form.quantity)
})

const productImage = computed(() => {
  if (!product.value) return 'https://via.placeholder.com/160x120?text=No+Image'
  if (product.value.image) return product.value.image
  if (Array.isArray(product.value.images) && product.value.images.length) {
    return product.value.images[0]
  }
  return 'https://via.placeholder.com/160x120?text=No+Image'
})

const loadProduct = async () => {
  console.log('Loading product, productId:', productId.value)
  
  if (!productId.value) {
    errorMessage.value = 'Không tìm thấy sản phẩm để mua. Vui lòng chọn sản phẩm từ danh sách.'
    product.value = null
    isLoading.value = false
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  orderResult.value = null
  
  try {
    console.log('Fetching product from:', `${API_BASE_URL}/san-pham/${productId.value}`)
    const response = await axios.get(`${API_BASE_URL}/san-pham/${productId.value}`)
    console.log('API Response:', response.data)
    
    // Backend trả về format: { status: true, data: {...} }
    const payload = response.data?.data || response.data
    
    if (payload && payload.id) {
      product.value = payload
      console.log('Product loaded:', product.value)
      
      // Auto-fill thông tin người mua từ localStorage nếu có
      const userInfo = localStorage.getItem('user_info')
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo)
          if (user.ho_va_ten) form.buyer_name = user.ho_va_ten
          if (user.email) form.buyer_email = user.email
          if (user.so_dien_thoai) form.buyer_phone = user.so_dien_thoai
        } catch (e) {
          console.warn('Không thể parse user info', e)
        }
      }
    } else {
      console.error('Invalid payload:', payload)
      errorMessage.value = 'Không tìm thấy thông tin sản phẩm. Dữ liệu trả về không hợp lệ.'
      product.value = null
    }
  } catch (err) {
    console.error('Error loading product:', err)
    console.error('Error details:', err.response)
    errorMessage.value = err?.response?.data?.message || err?.message || 'Không thể tải thông tin sản phẩm. Vui lòng thử lại.'
    product.value = null
  } finally {
    isLoading.value = false
    console.log('Loading complete. isLoading:', isLoading.value, 'product:', product.value)
  }
}

const changeQuantity = (delta) => {
  form.quantity = Math.min(Math.max(form.quantity + delta, 1), 99)
}

const clampQuantity = () => {
  form.quantity = Math.min(Math.max(form.quantity || 1, 1), 99)
}

const submitOrder = async () => {
  clampQuantity()
  if (!form.buyer_name.trim()) {
    errorMessage.value = 'Vui lòng nhập họ tên người nhận.'
    return
  }
  if (!product.value) {
    errorMessage.value = 'Không tìm thấy sản phẩm.'
    return
  }

  submitting.value = true
  errorMessage.value = ''
  try {
    const payload = {
      product_id: product.value.id,
      quantity: form.quantity,
      payment_method: form.payment_method,
      buyer_name: form.buyer_name,
      buyer_email: form.buyer_email || null,
      buyer_phone: form.buyer_phone || null,
      shipping_address: form.shipping_address || null,
      notes: form.notes || null,
    }

    const { data } = await axios.post(`${API_BASE_URL}/don-hang`, payload)
    orderResult.value = data?.data || data
  } catch (err) {
    console.error(err)
    errorMessage.value = err?.response?.data?.message || 'Không thể tạo đơn hàng.'
  } finally {
    submitting.value = false
  }
}

const paymentInstruction = (method) => {
  switch (method) {
    case 'vnpay':
      return 'Sau khi xác nhận, hệ thống sẽ gửi mã QR/Link VNPAY để bạn hoàn tất thanh toán.'
    case 'momo':
      return 'Bạn sẽ nhận được hướng dẫn thanh toán qua ví MoMo. Vui lòng hoàn tất trong 15 phút.'
    default:
      return 'Thanh toán trực tiếp cho người giao hàng hoặc người bán khi nhận sản phẩm.'
  }
}

const getPaymentLabel = (method) => {
  return paymentOptions.find((item) => item.value === method)?.label || method
}

const onImgError = (event) => {
  event.target.src = 'https://via.placeholder.com/160x120?text=No+Image'
}

watch(() => route.query.product_id, (newId, oldId) => {
  if (newId !== oldId) {
    console.log('Product ID changed:', oldId, '->', newId)
    form.quantity = Number(route.query.quantity || 1) || 1
    clampQuantity()
    orderResult.value = null
    product.value = null
    loadProduct()
  }
}, { immediate: false })

watch(() => route.query.quantity, (newQty) => {
  if (newQty) {
    form.quantity = Number(newQty) || 1
    clampQuantity()
  }
})

onMounted(() => {
  console.log('Checkout component mounted')
  console.log('Route query:', route.query)
  console.log('Product ID:', productId.value)
  
  // Đảm bảo quantity được set từ query
  if (route.query.quantity) {
    form.quantity = Number(route.query.quantity) || 1
    clampQuantity()
  }
  
  loadProduct()
})
</script>

<style scoped>
.checkout-page {
  min-height: 70vh;
}
.payment-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.payment-card {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.payment-card input {
  margin-top: 0;
}
.payment-card.active {
  border-color: #16a34a;
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.15);
}
.summary-card {
  position: sticky;
  top: 80px;
}
.summary-thumb {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
}
.quantity-control {
  display: inline-flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 4px 10px;
  gap: 8px;
  background: #f8fafc;
}
.quantity-control input {
  width: 48px;
  border: none;
  background: transparent;
  text-align: center;
  font-weight: 600;
}
</style>

