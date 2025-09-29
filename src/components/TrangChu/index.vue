<template>
    <div class="container py-3">
      <!-- HERO: Banner + 2 thẻ cam kết -->
      <div class="row g-3 align-items-stretch">
        <div class="col-lg-9">
          <div class="hero-box h-100">
            <h3 class="fw-bold mb-2">“DỌN NHÀ” THÔNG MINH – RINH NGÀN ƯU ĐÃI</h3>
            <p class="text-muted mb-3">Hoàn 100% phí bán hàng · Giao dịch miễn phí · Nhiều voucher hấp dẫn</p>
            <a class="btn btn-success" :href="isLoggedIn ? routes.sell : routes.login">+ Đăng bán ngay</a>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="side-card mb-3">
            <div class="d-flex align-items-center gap-2">
              <span>✅</span>
              <div>
                <div class="fw-semibold">Nhận sản phẩm như mô tả</div>
                <div class="text-muted small">Hoặc nhận tiền hoàn</div>
              </div>
            </div>
          </div>
          <div class="side-card">
            <div class="d-flex align-items-center gap-2">
              <span>📱</span>
              <div>
                <div class="fw-semibold">Mua bán thuận tiện</div>
                <div class="text-muted small">Quét QR để tải app</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- DANH MỤC -->
      <div class="mt-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h4 class="m-0">Danh mục nổi bật</h4>
          <a href="#" class="text-decoration-none">Xem tất cả</a>
        </div>
  
        <div class="row g-3">
          <div class="col-6 col-md-4 col-lg-2" v-for="c in cats" :key="c.slug">
            <a class="cat-card text-reset" :href="buildSearchUrl(c.slug)">
              <div class="cat-ico">{{ c.icon }}</div>
              <div class="fw-semibold mt-1">{{ c.name }}</div>
            </a>
          </div>
        </div>
      </div>
  
      <!-- CHATBOT FLOATING -->
      <button id="chat-toggle" class="btn" type="button" @click="toggleChat">💬</button>
  
      <div id="chat-widget" v-show="showChat">
        <div class="chat-header">Chatbot</div>
        <div id="chatbox" ref="chatboxRef">
          <p v-for="(m,i) in messages" :key="i" :class="m.from==='you' ? 'msg-you' : 'msg-bot'">
            <b>{{ m.from==='you' ? 'Bạn' : 'Bot' }}:</b> {{ m.text }}
          </p>
        </div>
        <div class="chat-input">
          <input v-model="msg" @keyup.enter="sendMessage" type="text" placeholder="Nhập tin nhắn..." />
          <button class="btn-send" @click="sendMessage">Gửi</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, nextTick } from 'vue'
  
  const isLoggedIn = ref(false) // TODO: thay bằng check thật (fetch /api/me)
  const routes = reactive({
    sell: '/sell',
    login: '/login',
    search: '/search'
  })
  
  const cats = ref([
    { slug:'dien-thoai', name:'Điện thoại', icon:'📱' },
    { slug:'sach', name:'Sách', icon:'📚' },
    { slug:'do-dien-tu', name:'Đồ điện tử', icon:'💡' },
    { slug:'may-tinh', name:'Máy tính', icon:'🖥️' },
    { slug:'thoi-trang', name:'Thời trang', icon:'👕' },
    { slug:'do-gia-dung', name:'Gia dụng', icon:'🍳' },
  ])
  
  const showChat = ref(false)
  const messages = ref([])
  const msg = ref('')
  const chatboxRef = ref(null)
  
  function toggleChat () {
    showChat.value = !showChat.value
    nextTick(() => {
      if (showChat.value && chatboxRef.value) {
        chatboxRef.value.scrollTop = chatboxRef.value.scrollHeight
      }
    })
  }
  
  function buildSearchUrl (slug) {
    return `${routes.search}?category=${encodeURIComponent(slug)}`
  }
  
  async function sendMessage () {
    const text = msg.value.trim()
    if (!text) return
    messages.value.push({ from: 'you', text })
    msg.value = ''
  
    try {
      const res = await fetch('/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      messages.value.push({ from: 'bot', text: data.reply || data.error || 'Không có phản hồi' })
    } catch (e) {
      messages.value.push({ from: 'bot', text: 'Lỗi kết nối server' })
    }
  
    await nextTick()
    if (chatboxRef.value) chatboxRef.value.scrollTop = chatboxRef.value.scrollHeight
  }
  
  onMounted(() => {
    // ví dụ: auto check đăng nhập
    // fetch('/api/me').then(r => r.ok ? isLoggedIn.value = true : null).catch(() => {})
  })
  </script>
  
  <style scoped>
  /* Hero + các card */
  .hero-box{
    background: linear-gradient(135deg,#ffe3d9 0%, #ffffff 55%);
    border: 1px solid #eee; border-radius:16px; padding:24px;
    box-shadow: 0 10px 24px rgba(0,0,0,.06);
  }
  .side-card{
    background:#fff; border:1px solid #eee; border-radius:14px;
    padding:16px; box-shadow:0 6px 18px rgba(0,0,0,.05);
  }
  /* Danh mục */
  .cat-card{
    background:#fff; border:1px solid #eef0f3; border-radius:14px; padding:16px;
    text-align:center; text-decoration:none; color:#1f2937; height:100%;
    transition: transform .15s ease, box-shadow .15s ease;
    box-shadow:0 8px 22px rgba(2,12,27,.06);
    display:block;
  }
  .cat-card:hover{ transform: translateY(-2px); box-shadow:0 16px 30px rgba(2,12,27,.12); }
  .cat-ico{ font-size:32px; line-height:1; }
  
  /* Chat floating */
  #chat-toggle{
    position:fixed; bottom:20px; right:20px; background:#28a745; color:#fff;
    border-radius:50%; width:50px; height:50px; display:flex; align-items:center;
    justify-content:center; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.2); z-index:1000;
    user-select:none;
  }
  #chat-widget{
    position:fixed; bottom:80px; right:20px; width:320px; height:400px; border:1px solid #ccc;
    border-radius:10px; background:#fff; box-shadow:0 6px 16px rgba(0,0,0,0.3); z-index:1000; overflow:hidden;
  }
  .chat-header{ background:#28a745; color:#fff; padding:10px; font-weight:bold; }
  #chatbox{ height:300px; overflow-y:auto; padding:10px; font-size:14px; }
  .chat-input{ display:flex; border-top:1px solid #ddd; }
  .chat-input input{ flex:1; border:none; padding:10px; outline:none; }
  .btn-send{ background:#28a745; color:#fff; border:none; padding:10px 15px; cursor:pointer; }
  .msg-you{ margin:0 0 6px; }
  .msg-bot{ margin:0 0 6px; color:#166534; }
  </style>
  