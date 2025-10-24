<template>
  <div class="container py-4 page-wrap">
    <!-- HERO + PROMISE CARDS -->
    <div class="row g-3 align-items-stretch">
      <div class="col-lg-9">
        <section class="hero-box h-100 position-relative overflow-hidden">
          <div class="hero-content">
            <span class="badge-soft">Ưu đãi tháng này</span>
            <h2 class="hero-title">“DỌN NHÀ” THÔNG MINH – RINH NGÀN ƯU ĐÃI</h2>
            <p class="hero-sub">Hoàn 100% phí bán hàng · Giao dịch miễn phí · Nhiều voucher hấp dẫn</p>

            <!-- CTA đổi theo trạng thái đăng nhập -->
            <div class="cta-group" v-if="isLoggedIn">
              <a class="btn cta-btn" :href="routes.sell" aria-label="Đăng bán ngay">
                <i class="i">＋</i> <span>Đăng bán ngay</span>
              </a>
            </div>
            <div class="cta-group" v-else>
              <a class="btn cta-btn alt" :href="routes.login" aria-label="Đăng nhập">Đăng nhập</a>
              <a class="btn cta-btn ghost" :href="routes.register" aria-label="Đăng ký miễn phí">Đăng ký miễn phí</a>
            </div>
          </div>

          <div class="hero-art" aria-hidden="true">
            <div class="blob b1"></div>
            <div class="blob b2"></div>
            <div class="blob b3"></div>
          </div>
        </section>
      </div>

      <div class="col-lg-3">
        <aside class="stack gap-3">
          <div class="side-card">
            <div class="d-flex align-items-center gap-2">
              <span class="emoji">✅</span>
              <div>
                <div class="fw-semibold">Nhận sản phẩm như mô tả</div>
                <div class="text-muted small">Hoặc nhận tiền hoàn</div>
              </div>
            </div>
          </div>
          <div class="side-card">
            <div class="d-flex align-items-center gap-2">
              <span class="emoji">📱</span>
              <div>
                <div class="fw-semibold">Mua bán thuận tiện</div>
                <div class="text-muted small">Quét QR để tải app</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- CATEGORIES -->
    <section class="mt-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h4 class="m-0 section-title">Danh mục nổi bật</h4>
        <a href="#" class="link-more">Xem tất cả</a>
      </div>

      <div class="row g-3">
        <div class="col-6 col-md-4 col-lg-2" v-for="c in cats" :key="c.slug">
          <a class="cat-card text-reset" :href="buildSearchUrl(c.slug)" :aria-label="`Xem danh mục ${c.name}`">
            <div class="cat-ico">{{ c.icon }}</div>
            <div class="fw-semibold mt-1 cat-name">{{ c.name }}</div>
          </a>
        </div>
      </div>
    </section>

    <!-- FLOATING CHAT -->
    <button
      id="chat-toggle"
      class="btn chat-toggle"
      type="button"
      :aria-expanded="showChat ? 'true' : 'false'"
      aria-controls="chat-widget"
      @click="toggleChat"
      title="Mở chatbot (Alt+C)"
    >
      <span class="dot" v-show="!showChat && unreadCount>0"></span>
      💬
    </button>

    <transition name="pop">
      <div id="chat-widget" v-show="showChat" class="chat-wrap" role="dialog" aria-label="Hộp thoại Chatbot">
        <div class="chat-header d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <span class="status online"></span>
            <strong>Chatbot</strong>
          </div>
          <button class="icon-btn" @click="toggleChat" title="Đóng (Esc)">✕</button>
        </div>
        <div id="chatbox" ref="chatboxRef" class="chat-box" aria-live="polite" aria-atomic="false">
          <p v-for="(m,i) in messages" :key="i" :class="m.from==='you' ? 'msg-you' : 'msg-bot'">
            <b>{{ m.from==='you' ? 'Bạn' : 'Bot' }}:</b> {{ m.text }}
          </p>
          <p v-if="typing" class="msg-bot typing">
            <b>Bot:</b>
            <span class="dots"><span>.</span><span>.</span><span>.</span></span>
          </p>
        </div>
        <div class="chat-input">
          <input
            v-model="msg"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Nhập tin nhắn..."
            aria-label="Nội dung tin nhắn"
          />
          <button class="btn-send" @click="sendMessage" :disabled="!msg.trim()">Gửi</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

const isLoggedIn = ref(false)
const routes = reactive({
  sell: '/sell',
  login: '/dang-nhap',
  register: '/dang-ky',   // thêm route đăng ký
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
const typing = ref(false)
const unreadCount = ref(0)
const chatboxRef = ref(null)

function toggleChat () {
  showChat.value = !showChat.value
  if (showChat.value) unreadCount.value = 0
  nextTick(scrollToBottom)
}

function buildSearchUrl (slug) {
  return `${routes.search}?category=${encodeURIComponent(slug)}`
}

async function sendMessage () {
  const text = msg.value.trim()
  if (!text) return

  // (Tuỳ chọn) bắt buộc đăng nhập trước khi dùng chat:
  // if (!isLoggedIn.value) {
  //   messages.value.push({ from: 'bot', text: 'Vui lòng đăng nhập để dùng chatbot nhé.' })
  //   showChat.value = true
  //   return
  // }

  messages.value.push({ from: 'you', text })
  msg.value = ''
  typing.value = true

  try {
    const res = await fetch('/chatbot', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
    const data = await res.json()
    messages.value.push({ from: 'bot', text: data.reply || data.error || 'Không có phản hồi' })
  } catch (e) {
    messages.value.push({ from: 'bot', text: 'Lỗi kết nối server' })
  } finally {
    typing.value = false
  }

  await nextTick()
  scrollToBottom()
  if (!showChat.value) unreadCount.value++
}

function scrollToBottom () {
  if (chatboxRef.value) chatboxRef.value.scrollTop = chatboxRef.value.scrollHeight
}

// Keyboard shortcuts
function onKey (e) {
  if (e.altKey && (e.key === 'c' || e.key === 'C')) {
    e.preventDefault(); toggleChat()
  }
  if (e.key === 'Escape' && showChat.value) {
    toggleChat()
  }
}

onMounted(() => {
  // Detect đăng nhập: dựa vào token lưu từ backend của bạn
  isLoggedIn.value = !!localStorage.getItem('key_client')

  // Hoặc gọi API /client/check nếu bạn đã làm (đồng bộ với controller)
  // fetch('/api/client/check').then(r => r.json()).then(d => {
  //   isLoggedIn.value = !!d?.status
  // }).catch(() => {})

  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// Auto-scroll when new messages arrive while open
watch(messages, () => nextTick(scrollToBottom))
</script>

<style scoped>
/* ========== THEME ========== */
:root {
  --bg: #f7fafc;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #6b7280;
  --brand: #16a34a;
  --brand-600: #16a34a;
  --brand-700: #15803d;
  --ring: rgba(22,163,74,.35);
  --shadow: 0 10px 24px rgba(2,12,27,.08);
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b1220; --card: #0f172a; --text:#e5e7eb; --muted:#9ca3af;
    --ring: rgba(16,185,129,.35); --shadow: 0 10px 24px rgba(0,0,0,.5);
  }
}
.page-wrap {
  background:
    radial-gradient(1200px 600px at 10% -10%, #e6fff4 0%, transparent 50%),
    radial-gradient(1000px 500px at 110% 10%, #ffe8f6 0%, transparent 50%);
}

/* ===== HERO ===== */
.hero-box{
  background: linear-gradient(135deg,#fff 0%, #f5fff8 60%);
  border: 1px solid rgba(0,0,0,.06); border-radius: 18px; padding: 28px;
  box-shadow: var(--shadow); position: relative; isolation: isolate;
}
.hero-content{ position: relative; z-index: 2; max-width: 680px; }
.badge-soft{
  display:inline-block; padding:6px 10px; border-radius:999px; font-size:12px;
  background: rgba(22,163,74,.08); color: var(--brand-700); margin-bottom:8px; border:1px solid rgba(22,163,74,.15);
}
.hero-title{ font-weight:800; letter-spacing:.2px; margin:0 0 8px; color: var(--text); }
.hero-sub{ color: var(--muted); margin:0 0 16px; }

.cta-group { display:flex; gap:10px; flex-wrap:wrap; }
.cta-btn{
  background: var(--brand-600); color:#fff; border:none; border-radius:12px; padding:10px 16px;
  display:inline-flex; align-items:center; gap:8px; box-shadow:0 10px 20px rgba(22,163,74,.2);
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
}
.cta-btn:hover{ background: var(--brand-700); transform: translateY(-1px); box-shadow:0 16px 30px rgba(22,163,74,.3); }
.cta-btn .i{ transform: translateY(-1px); font-weight:700; color: #0b1220; }

/* biến thể đăng nhập/đăng ký */
.cta-btn.alt{ background:#111827; color:#fff; }
.cta-btn.alt:hover{ background:#0b1220; }
.cta-btn.ghost{
  background:transparent; color:var(--brand-700); border:1px solid rgba(22,163,74,.35);
}
.cta-btn.ghost:hover{ background: rgba(22,163,74,.06); }

/* hero art */
.hero-art .blob{ position:absolute; border-radius:50%; filter: blur(24px); opacity:.6; animation: float 12s ease-in-out infinite; }
.hero-art .b1{ width:220px; height:220px; background:#a7f3d0; right:-40px; top:-30px; }
.hero-art .b2{ width:260px; height:260px; background:#fde68a; right:140px; bottom:-60px; animation-delay: -3s; }
.hero-art .b3{ width:180px; height:180px; background:#fecdd3; right:-80px; bottom:40px; animation-delay: -6s; }
@keyframes float{ 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-12px)} }

/* ===== SIDE CARDS ===== */
.stack { display:flex; flex-direction:column; }
.side-card{
  background: var(--card); border:1px solid rgba(0,0,0,.06); border-radius:16px; padding:16px;
  box-shadow: var(--shadow); transition: transform .2s ease, box-shadow .2s ease;
}
.side-card:hover{ transform: translateY(-2px); box-shadow: 0 16px 30px rgba(2,12,27,.16); }
.emoji{ font-size:22px; }

/* ===== CATEGORIES ===== */
.section-title{ color: var(--text); }
.link-more{ text-decoration:none; color: var(--brand-700); font-weight:600; }
.link-more:hover{ text-decoration:underline; }

.cat-card{
  background: var(--card); border:1px solid #eef0f3; border-radius:16px; padding:16px; text-align:center;
  text-decoration:none; color:var(--text); height:100%; display:block; position:relative;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  box-shadow: var(--shadow);
}
.cat-card::after{
  content:""; position:absolute; inset:0; border-radius:16px; pointer-events:none;
  background: linear-gradient(120deg, rgba(22,163,74,.12), transparent 40%, rgba(236,72,153,.12));
  opacity:0; transition:opacity .2s ease;
}
.cat-card:hover{ transform: translateY(-3px); box-shadow:0 18px 34px rgba(2,12,27,.18); border-color: rgba(22,163,74,.35); }
.cat-card:hover::after{ opacity:1; }
.cat-ico{ font-size:34px; line-height:1; }
.cat-name{ font-size:15px; }

/* ===== CHAT WIDGET ===== */
.chat-toggle{
  position:fixed; bottom:20px; right:20px; background:var(--brand-600); color:#fff;
  border-radius:50%; width:56px; height:56px; display:flex; align-items:center; justify-content:center;
  box-shadow: 0 14px 30px rgba(0,0,0,.25); z-index:1000; user-select:none; border:none;
}
.chat-toggle:hover{ background: var(--brand-700); }
.chat-toggle .dot{ position:absolute; top:6px; right:6px; width:10px; height:10px; background:#ef4444; border-radius:50%; box-shadow:0 0 0 6px rgba(239,68,68,.25); animation:pulse 1.6s infinite; }
@keyframes pulse{ 0%{ transform:scale(1)} 50%{ transform:scale(1.3)} 100%{ transform:scale(1)} }

.chat-wrap{
  position:fixed; bottom:90px; right:20px; width:340px; max-width:calc(100vw - 32px); height:430px;
  background: var(--card); border:1px solid rgba(0,0,0,.1); border-radius:16px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,.35); z-index:1000;
}
.pop-enter-active, .pop-leave-active{ transition: all .18s ease; }
.pop-enter-from, .pop-leave-to{ opacity:0; transform: translateY(8px) scale(.98); }

.chat-header{ background: linear-gradient(90deg, var(--brand-600), #22c55e); color:#fff; padding:10px 12px; font-weight:600; }
.icon-btn{ background:transparent; border:none; color:#fff; font-size:16px; line-height:1; opacity:.9; }
.icon-btn:hover{ opacity:1; }
.status{ width:8px; height:8px; background:#10b981; display:inline-block; border-radius:50%; box-shadow:0 0 0 3px rgba(16,185,129,.2); }
.online{ }

.chat-box{ height:322px; overflow-y:auto; padding:12px; font-size:14px; background:linear-gradient(180deg, rgba(16,185,129,.03), transparent 30%); }
.msg-you, .msg-bot{ margin:0 0 8px; }
.msg-bot{ color:#166534; }
.typing{ opacity:.8; }
.dots span{ animation: blink 1.2s infinite; display:inline-block; }
.dots span:nth-child(2){ animation-delay: .2s }
.dots span:nth-child(3){ animation-delay: .4s }
@keyframes blink{ 0%,100%{ opacity:.2 } 50%{ opacity:1 } }

.chat-input{ display:flex; border-top:1px solid rgba(0,0,0,.08); }
.chat-input input{ flex:1; border:none; padding:12px; outline:none; font-size:14px; background:transparent; color:var(--text) }
.chat-input input:focus{ box-shadow: inset 0 0 0 2px var(--ring); border-radius:6px; }
.btn-send{ background:var(--brand-600); color:#fff; border:none; padding:0 14px; margin:8px; border-radius:10px; }
.btn-send:disabled{ opacity:.5; cursor:not-allowed; }

/* Reduce motion */
@media (prefers-reduced-motion: reduce){
  .hero-art .blob{ animation:none }
  .chat-toggle .dot{ animation:none; box-shadow:none }
  .pop-enter-active, .pop-leave-active{ transition:none }
}
</style>
