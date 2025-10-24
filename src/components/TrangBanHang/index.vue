<template>
    <div class="shop-container">
      <h1 class="shop-title">🛍 CHODOCU SHOP</h1>
  
      <!-- Bộ lọc -->
      <div class="filter-bar">
        <div class="filter-group">
          <label>🔍 Loại sản phẩm:</label>
          <select v-model="selectedCategory">
            <option value="all">Tất cả</option>
            <option v-for="(cat, index) in categories" :key="index" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
  
        <div class="filter-group">
          <label>💰 Sắp xếp theo giá:</label>
          <select v-model="selectedPriceSort">
            <option value="none">Không sắp xếp</option>
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
  
        <div class="filter-group">
          <label>🔥 Giảm giá:</label>
          <select v-model="selectedDiscount">
            <option value="all">Tất cả</option>
            <option value="sale">Sản phẩm đang giảm giá</option>
          </select>
        </div>
      </div>
  
      <!-- Danh sách sản phẩm -->
      <main class="product-list">
        <div
          class="product-card"
          v-for="(product, index) in filteredProducts"
          :key="index"
          @click="showDetail(product)"
        >
          <div v-if="product.discount > 0" class="discount-badge">
            -{{ product.discount }}%
          </div>
          <img :src="product.image" :alt="product.name" class="product-img" />
          <h3>{{ product.name }}</h3>
          <p class="sold">Đã bán: {{ product.sold }} sản phẩm</p>
  
          <div class="price-section">
            <p class="price">{{ formatPrice(finalPrice(product)) }}</p>
            <p v-if="product.discount > 0" class="old-price">
              {{ formatPrice(product.price) }}
            </p>
          </div>
  
          <div class="btn-container">
            <button class="buy-btn">🛒 Thêm vào giỏ</button>
            <button class="buy-btn highlight">💰 Mua ngay</button>
          </div>
        </div>
      </main>
  
      <!-- Popup chi tiết sản phẩm -->
      <div v-if="selectedProduct" class="detail-overlay" @click.self="closeDetail">
        <div class="detail-box">
          <button class="close-btn" @click="closeDetail">✖</button>
  
          <div class="detail-top">
            <img :src="selectedProduct.image" class="detail-img" />
            <div class="detail-info">
              <h2>{{ selectedProduct.name }}</h2>
  
              <div class="rating">
                <span v-for="n in 5" :key="n" class="star">
                  {{ n <= selectedProduct.rating ? "★" : "☆" }}
                </span>
                <span class="rating-text">
                  {{ selectedProduct.rating }}/5 ({{ selectedProduct.reviews.length }} đánh giá)
                </span>
              </div>
  
              <div class="price-box">
                <p class="price">{{ formatPrice(finalPrice(selectedProduct)) }}</p>
                <p v-if="selectedProduct.discount > 0" class="old-price">
                  {{ formatPrice(selectedProduct.price) }}
                </p>
              </div>
  
              <p class="desc">{{ selectedProduct.description }}</p>
  
              <div class="actions">
                <button class="buy-btn big">🛒 Thêm vào giỏ</button>
                <button class="buy-btn highlight big">💰 Mua ngay</button>
              </div>
            </div>
          </div>
  
          <div class="detail-bottom">
            <h3>📄 Mô Tả Chi Tiết</h3>
            <p>{{ selectedProduct.detail }}</p>
  
            <h3 style="margin-top: 20px">⭐ Đánh Giá Sản Phẩm</h3>
            <div class="review" v-for="(r, i) in selectedProduct.reviews" :key="i">
              <div class="review-header">
                <strong>{{ r.user }}</strong>
                <span class="stars">
                  <span v-for="n in 5" :key="n">{{ n <= r.stars ? "★" : "☆" }}</span>
                </span>
              </div>
              <p>{{ r.comment }}</p>
            </div>
  
            <!-- 🆕 SẢN PHẨM TƯƠNG TỰ -->
            <h3 style="margin-top: 25px">🛍 Sản Phẩm Tương Tự</h3>
            <div class="similar-list">
              <div
                class="similar-card"
                v-for="(item, idx) in similarProducts"
                :key="idx"
                @click="showDetail(item)"
              >
                <img :src="item.image" :alt="item.name" />
                <p class="name">{{ item.name }}</p>
                <p class="price">{{ formatPrice(finalPrice(item)) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "OnlineShop",
    data() {
      return {
        selectedCategory: "all",
        selectedPriceSort: "none",
        selectedDiscount: "all",
        selectedProduct: null,
  
        categories: [
          "Đồ điện tử",
          "Gia dụng",
          "Phụ kiện",
          "Thời trang",
          "Thiết bị thông minh",
          "Khác",
        ],
  
        products: [
          {
            name: "Tai nghe Bluetooth",
            price: 459000,
            discount: 10,
            sold: 530,
            category: "Đồ điện tử",
            rating: 5,
            description: "Tai nghe không dây chất lượng cao, pin 24 giờ.",
            detail:
              "Tai nghe Bluetooth 5.3, chống ồn chủ động, micro kép, sạc nhanh 30 phút.",
            image:
              "https://cdn.pixabay.com/photo/2016/11/19/14/00/headphones-1839098_640.jpg",
            reviews: [
              { user: "An Nguyễn", stars: 5, comment: "Nghe cực hay, pin trâu." },
              { user: "Minh Lê", stars: 4, comment: "Âm thanh tốt, đáng tiền." },
            ],
          },
          {
            name: "Chuột Gaming RGB",
            price: 299000,
            discount: 20,
            sold: 820,
            category: "Đồ điện tử",
            rating: 4,
            description: "Chuột chơi game có đèn RGB, DPI lên đến 16000.",
            detail:
              "Cảm biến quang học chính xác, dây chống rối, thiết kế công thái học.",
            image:
              "https://cdn.pixabay.com/photo/2017/08/10/08/02/mouse-2629623_640.jpg",
            reviews: [
              { user: "Tấn Phát", stars: 5, comment: "Click êm, RGB đẹp lắm." },
              { user: "Quốc Bảo", stars: 4, comment: "Ổn, hơi nhẹ nhưng giá rẻ." },
            ],
          },
          {
            name: "Màn hình 24 inch",
            price: 3190000,
            discount: 5,
            sold: 410,
            category: "Đồ điện tử",
            rating: 4,
            description: "Màn hình Full HD 24 inch, hiển thị sắc nét.",
            detail:
              "Độ phân giải 1080p, tần số quét 75Hz, góc nhìn rộng 178 độ.",
            image:
              "https://cdn.pixabay.com/photo/2014/09/23/21/25/monitor-458526_640.jpg",
            reviews: [
              { user: "Hữu Đạt", stars: 4, comment: "Màu đẹp, giá tốt." },
            ],
          },
          {
            name: "Giày thể thao nam",
            price: 590000,
            discount: 15,
            sold: 1500,
            category: "Thời trang",
            rating: 5,
            description: "Giày thể thao nam siêu nhẹ, kiểu dáng hiện đại.",
            detail:
              "Chất liệu thoáng khí, đế cao su siêu bền, phù hợp đi học, đi chơi.",
            image:
              "https://cdn.pixabay.com/photo/2016/11/29/09/32/shoes-1868412_640.jpg",
            reviews: [
              { user: "Thảo Nhi", stars: 5, comment: "Đẹp hơn trong hình ❤️" },
              { user: "Văn Duy", stars: 5, comment: "Rất êm, đúng size." },
            ],
          },
        ],
      };
    },
    computed: {
      filteredProducts() {
        let list = [...this.products];
        if (this.selectedCategory !== "all") {
          list = list.filter((p) => p.category === this.selectedCategory);
        }
        if (this.selectedDiscount === "sale") {
          list = list.filter((p) => p.discount > 0);
        }
        if (this.selectedPriceSort === "asc") {
          list.sort((a, b) => this.finalPrice(a) - this.finalPrice(b));
        } else if (this.selectedPriceSort === "desc") {
          list.sort((a, b) => this.finalPrice(b) - this.finalPrice(a));
        }
        return list;
      },
      similarProducts() {
        if (!this.selectedProduct) return [];
        return this.products.filter(
          (p) =>
            p.category === this.selectedProduct.category &&
            p.name !== this.selectedProduct.name
        );
      },
    },
    methods: {
      showDetail(p) {
        this.selectedProduct = p;
      },
      closeDetail() {
        this.selectedProduct = null;
      },
      finalPrice(p) {
        return p.price * (1 - p.discount / 100);
      },
      formatPrice(v) {
        return v.toLocaleString("vi-VN") + " ₫";
      },
    },
  };
  </script>
  
  <style scoped>
  .shop-container {
    font-family: "Poppins", "Segoe UI", sans-serif;
    background-color: #f9f9f9;
    min-height: 100vh;
    padding-bottom: 40px;
  }
  
  .shop-title {
    text-align: center;
    color: #ff5722;
    padding: 20px;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 1px;
  }
  
  .filter-bar {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 25px;
  }
  
  .filter-group label {
    font-weight: bold;
    margin-right: 6px;
    color: #444;
  }
  
  .filter-group select {
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 15px;
    background-color: #fff;
  }
  
  .product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 25px;
    padding: 20px 40px;
  }
  
  .product-card {
    position: relative;
    background: #fff;
    border-radius: 12px;
    text-align: center;
    padding: 15px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer;
  }
  
  .product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  }
  
  .discount-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #e53935;
    color: white;
    font-weight: bold;
    padding: 5px 8px;
    border-radius: 6px;
    font-size: 13px;
  }
  
  .product-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  
  .price-section {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 8px;
  }
  
  .price {
    color: #e53935;
    font-weight: bold;
    font-size: 16px;
  }
  
  .old-price {
    color: #999;
    font-size: 13px;
    text-decoration: line-through;
  }
  
  .sold {
    font-size: 14px;
    color: #555;
  }
  
  .btn-container {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 10px;
  }
  
  .buy-btn {
    flex: 1;
    background-color: #ff5722;
    color: #fff;
    border: none;
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.25s;
  }
  
  .buy-btn:hover {
    background-color: #e64a19;
    transform: scale(1.05);
  }
  
  .highlight {
    background: #ff9800;
  }
  
  .big {
    padding: 12px 18px;
    font-size: 15px;
  }
  
  /* Popup */
  .detail-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    backdrop-filter: blur(2px);
  }
  
  .detail-box {
    width: 880px;
    background: #fff;
    border-radius: 14px;
    padding: 30px;
    position: relative;
    animation: zoomIn 0.3s ease;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  }
  
  .close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    border: none;
    background: none;
    font-size: 22px;
    color: #777;
    cursor: pointer;
  }
  
  .close-btn:hover {
    color: #000;
  }
  
  .detail-top {
    display: flex;
    gap: 25px;
  }
  
  .detail-img {
    width: 340px;
    border-radius: 10px;
    object-fit: cover;
  }
  
  .detail-info {
    flex: 1;
  }
  
  .rating {
    color: #ffb400;
    margin: 8px 0;
  }
  
  .rating-text {
    font-size: 13px;
    color: #666;
    margin-left: 8px;
  }
  
  .price-box {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .desc {
    font-size: 14px;
    color: #555;
    margin: 15px 0;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
  
  .detail-bottom {
    margin-top: 25px;
  }
  
  .review {
    border-top: 1px solid #eee;
    padding: 10px 0;
  }
  
  .review-header {
    display: flex;
    justify-content: space-between;
  }
  
  .stars {
    color: #ffb400;
  }
  
  /* Sản phẩm tương tự */
  .similar-list {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  
  .similar-card {
    width: 150px;
    background: #fffdf8;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: 0.25s;
  }
  
  .similar-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  }
  
  .similar-card img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .similar-card .name {
    font-size: 14px;
    color: #333;
    margin: 6px 0 2px;
    font-weight: 500;
  }
  
  .similar-card .price {
    color: #e53935;
    font-weight: bold;
    font-size: 14px;
  }
  
  @keyframes zoomIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  </style>
  