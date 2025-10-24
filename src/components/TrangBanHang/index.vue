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
            <button class="buy-btn">💰 Mua ngay</button>
          </div>
        </div>
      </main>
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
  
        categories: [
          "Đồ điện tử",
          "Gia dụng",
          "Phụ kiện",
          "Thời trang",
          "Thiết bị thông minh",
          "Khác",
        ],
  
        products: [
          { name: "Tai nghe Bluetooth", price: 459000, discount: 10, sold: 530, category: "Đồ điện tử", image: "https://cdn.pixabay.com/photo/2016/11/19/14/00/headphones-1839098_640.jpg" },
          { name: "Loa Bluetooth", price: 349000, discount: 5, sold: 700, category: "Đồ điện tử", image: "https://cdn.pixabay.com/photo/2017/08/06/00/49/speaker-2585077_640.jpg" },
          { name: "Chuột Gaming RGB", price: 299000, discount: 20, sold: 820, category: "Đồ điện tử", image: "https://cdn.pixabay.com/photo/2017/08/10/08/02/mouse-2629623_640.jpg" },
          { name: "Bàn phím cơ", price: 890000, discount: 15, sold: 610, category: "Đồ điện tử", image: "https://cdn.pixabay.com/photo/2016/12/14/19/49/keyboard-1903302_640.jpg" },
          { name: "Màn hình 24 inch", price: 3190000, discount: 5, sold: 410, category: "Đồ điện tử", image: "https://cdn.pixabay.com/photo/2014/09/23/21/25/monitor-458526_640.jpg" },
          { name: "Máy hút bụi", price: 1399000, discount: 25, sold: 650, category: "Gia dụng", image: "https://cdn.pixabay.com/photo/2016/10/19/16/01/vacuum-cleaner-1756863_640.jpg" },
          { name: "Nồi chiên không dầu", price: 1499000, discount: 30, sold: 710, category: "Gia dụng", image: "https://cdn.pixabay.com/photo/2021/03/05/19/57/fryer-6073568_640.jpg" },
          { name: "Đèn bàn học LED", price: 189000, discount: 0, sold: 830, category: "Gia dụng", image: "https://cdn.pixabay.com/photo/2017/02/12/20/29/desk-lamp-2063603_640.jpg" },
          { name: "Sạc dự phòng", price: 359000, discount: 15, sold: 720, category: "Phụ kiện", image: "https://cdn.pixabay.com/photo/2016/11/19/14/12/powerbank-1839115_640.jpg" },
          { name: "Ốp điện thoại silicon", price: 69000, discount: 0, sold: 1300, category: "Phụ kiện", image: "https://cdn.pixabay.com/photo/2020/06/02/20/47/mobile-phone-5254822_640.jpg" },
          { name: "Ba lô laptop", price: 395000, discount: 20, sold: 980, category: "Thời trang", image: "https://cdn.pixabay.com/photo/2017/01/31/14/52/backpack-2023910_640.jpg" },
          { name: "Giày thể thao nam", price: 590000, discount: 15, sold: 1500, category: "Thời trang", image: "https://cdn.pixabay.com/photo/2016/11/29/09/32/shoes-1868412_640.jpg" },
          { name: "Áo thun nam basic", price: 159000, discount: 10, sold: 1240, category: "Thời trang", image: "https://cdn.pixabay.com/photo/2016/10/02/22/17/t-shirt-1714660_640.jpg" },
          { name: "Đồng hồ thông minh", price: 899000, discount: 0, sold: 1200, category: "Thiết bị thông minh", image: "https://cdn.pixabay.com/photo/2015/02/02/11/08/apple-watch-620292_640.jpg" },
          { name: "Camera an ninh", price: 890000, discount: 5, sold: 420, category: "Thiết bị thông minh", image: "https://cdn.pixabay.com/photo/2019/05/22/17/09/camera-4225038_640.jpg" },
          { name: "Xe điện mini", price: 6990000, discount: 30, sold: 95, category: "Khác", image: "https://cdn.pixabay.com/photo/2016/03/27/20/51/electric-scooter-1284126_640.jpg" },
          { name: "Vali du lịch", price: 790000, discount: 10, sold: 280, category: "Khác", image: "https://cdn.pixabay.com/photo/2015/11/19/21/11/suitcase-1051652_640.jpg" },
          { name: "Kính mát thời trang", price: 159000, discount: 0, sold: 560, category: "Khác", image: "https://cdn.pixabay.com/photo/2015/08/24/11/34/sunglasses-905780_640.jpg" },
        ],
      };
    },
  
    computed: {
      filteredProducts() {
        let list = [...this.products];
  
        // Lọc theo danh mục
        if (this.selectedCategory !== "all") {
          list = list.filter((p) => p.category === this.selectedCategory);
        }
  
        // Lọc theo giảm giá
        if (this.selectedDiscount === "sale") {
          list = list.filter((p) => p.discount > 0);
        }
  
        // Sắp xếp theo giá
        if (this.selectedPriceSort === "asc") {
          list.sort((a, b) => this.finalPrice(a) - this.finalPrice(b));
        } else if (this.selectedPriceSort === "desc") {
          list.sort((a, b) => this.finalPrice(b) - this.finalPrice(a));
        } else {
          // ✅ Mặc định sắp xếp theo tên A → Z
          list.sort((a, b) => a.name.localeCompare(b.name));
        }
  
        return list;
      },
    },
  
    methods: {
      finalPrice(product) {
        return product.price * (1 - product.discount / 100);
      },
      formatPrice(value) {
        return value.toLocaleString("vi-VN") + " ₫";
      },
    },
  };
  </script>
  
  <style scoped>
  .shop-container {
    font-family: "Segoe UI", sans-serif;
    background-color: #f6f6f6;
    min-height: 100vh;
    padding-bottom: 40px;
  }
  .shop-title {
    text-align: center;
    color: #ff5722;
    padding: 20px;
    font-size: 30px;
    font-weight: bold;
  }
  .filter-bar {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .filter-group label {
    font-weight: bold;
    margin-right: 5px;
    color: #444;
  }
  .filter-group select {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 15px;
  }
  .product-list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 25px;
    padding: 20px 40px;
  }
  .product-card {
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
    padding: 15px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
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
    border-radius: 5px;
    font-size: 13px;
  }
  .product-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 8px;
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
    gap: 6px;
    margin-top: 10px;
  }
  .buy-btn {
    flex: 1;
    background-color: #ff5722;
    color: #fff;
    border: none;
    padding: 6px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
  }
  .buy-btn:hover {
    background-color: #e64a19;
  }
  </style>
  