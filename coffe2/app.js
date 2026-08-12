/* ==========================================================================
   JOY COFFEE & EATERY - CORE APPLICATION ENGINE
   ========================================================================== */

const DEFAULT_MENU_DATA = [
  {
    id: 'latte',
    name: 'Latte',
    category: 'coffee',
    catGroup: ['coffee', 'iced', 'milk'],
    desc: 'Espresso murni 100% Arabika dengan susu steamed creamy dan latte art lembut.',
    price: 25000,
    dollarPrice: 'Rp 25.000',
    image: 'images/latte.png'
  },
  {
    id: 'matcha',
    name: 'Matcha Latte',
    category: 'non-coffee',
    catGroup: ['non-coffee', 'milk'],
    desc: 'Matcha khas Uji Jepang kualitas premium dipadu dengan fresh milk gurih.',
    price: 28000,
    dollarPrice: 'Rp 28.000',
    image: 'images/matcha.png'
  },
  {
    id: 'filter',
    name: 'Ice Filter Coffee',
    category: 'coffee',
    catGroup: ['coffee', 'iced'],
    desc: 'Seduhan manual V60 biji kopi single origin lokal dengan nota rasa fruity segar.',
    price: 26000,
    dollarPrice: 'Rp 26.000',
    image: 'images/iced_filter.png'
  },
  {
    id: 'croissant',
    name: 'Croissant Almond',
    category: 'pastry',
    catGroup: ['pastry'],
    desc: 'Croissant renyah berlapis dengan isian krim almond manis.',
    price: 22000,
    dollarPrice: 'Rp 22.000',
    image: 'images/croissant.png'
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake Beri',
    category: 'pastry',
    catGroup: ['pastry'],
    desc: 'Dessert lembut dengan saus beri segar buatan sendiri.',
    price: 26000,
    dollarPrice: 'Rp 26.000',
    image: 'images/cheesecake.png'
  },
  {
    id: 'cookie',
    name: 'Kue Kering Cokelat',
    category: 'pastry',
    catGroup: ['pastry'],
    desc: 'Kue kering hangat dengan rasa cokelat melimpah.',
    price: 16000,
    dollarPrice: 'Rp 16.000',
    image: 'images/cookie.png'
  },
  {
    id: 'beans-250g',
    name: 'et al House Blend Beans (250g)',
    category: 'beans',
    catGroup: ['beans'],
    desc: 'Biji kopi pilihan 100% Arabika Java Preanger & Toraja. Notes: Caramel, Cocoa, Red Apple.',
    price: 85000,
    dollarPrice: 'Rp 85.000',
    image: 'images/beans_bag.png'
  },
  {
    id: 'espresso',
    name: 'Espresso Single',
    category: 'coffee',
    catGroup: ['coffee', 'classic'],
    desc: 'Ekstraksi murni 100% Arabika pilihan dengan crema tebal aroma kaya.',
    price: 20000,
    dollarPrice: 'Rp 20.000',
    image: 'images/latte.png'
  },
  {
    id: 'americano',
    name: 'Iced Americano',
    category: 'coffee',
    catGroup: ['coffee', 'iced'],
    desc: 'Double shot espresso disajikan dingin dengan es batu menyegarkan.',
    price: 22000,
    dollarPrice: 'Rp 22.000',
    image: 'images/iced_filter.png'
  }
];

const GALLERY_DATA = [
  {
    title: 'Spot Typewriter & WFC Zone',
    category: 'ambient',
    categoryLabel: 'Suasana & WFC',
    image: 'images/hero.png'
  },
  {
    title: 'Hot Café Latte Heart Foam',
    category: 'coffee',
    categoryLabel: 'Racikan Kopi',
    image: 'images/latte.png'
  },
  {
    title: 'Japanese Matcha Latte',
    category: 'coffee',
    categoryLabel: 'Racikan Non-Kopi',
    image: 'images/matcha.png'
  },
  {
    title: 'Ice Filter V60 Pour Over',
    category: 'coffee',
    categoryLabel: 'Manual Brew',
    image: 'images/iced_filter.png'
  },
  {
    title: 'Fresh Almond Croissant',
    category: 'pastry',
    categoryLabel: 'Pastry',
    image: 'images/croissant.png'
  },
  {
    title: 'Berry Cheesecake Slice',
    category: 'pastry',
    categoryLabel: 'Dessert',
    image: 'images/cheesecake.png'
  }
];

// App State
let cart = [];
let currentCategory = 'all';
let currentGalleryCat = 'all';
let menuPage = 1;
let foodPage = 1;
const ITEMS_PER_PAGE = 4;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initCart();
  renderMenu();
  renderFoodMenu();
  renderGallery();
  setupScrollHeader();
  setupFilterPills();
  setupGalleryPills();
  setupSearchAndSort();
});

// Menu Data LocalStorage Management
function getMenuData() {
  const saved = localStorage.getItem('joy_menu_data');
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  return DEFAULT_MENU_DATA;
}

function saveMenuData(data) {
  localStorage.setItem('joy_menu_data', JSON.stringify(data));
  renderMenu();
  renderFoodMenu();
}

// Render Main Menu Cards (Max 4 items per page with numbered pagination)
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const paginationContainer = document.getElementById('menuPagination');
  if (!grid) return;

  const items = getMenuData();
  const searchVal = document.getElementById('menuSearchInput') ? document.getElementById('menuSearchInput').value.toLowerCase().trim() : '';
  const sortVal = document.getElementById('menuSortSelect') ? document.getElementById('menuSortSelect').value : 'default';

  // Filter items
  let filtered = items.filter(item => {
    const matchesCat = (currentCategory === 'all') || 
                       (item.category === currentCategory) || 
                       (item.catGroup && item.catGroup.includes(currentCategory));
    const matchesSearch = !searchVal || 
                          item.name.toLowerCase().includes(searchVal) || 
                          item.desc.toLowerCase().includes(searchVal);
    return matchesCat && matchesSearch;
  });

  // Sort items
  if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sortVal === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  if (menuPage > totalPages) menuPage = 1;

  const startIndex = (menuPage - 1) * ITEMS_PER_PAGE;
  const displayItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (displayItems.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:50px 0; color:var(--text-dark-muted);">
        Tidak ada menu yang sesuai dengan pencarian Anda.
      </div>`;
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  grid.innerHTML = displayItems.map(item => `
    <div class="product-card">
      <div class="product-img-box">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="product-card-body">
        <h3 class="product-name">${item.name}</h3>
        <p class="product-desc">${item.desc}</p>
        <div class="product-price">Rp ${formatPrice(item.price)}</div>
        <div class="product-footer">
          <button class="btn-to-cart" onclick="addToCart('${item.id}')">ADD TO CART</button>
        </div>
      </div>
    </div>
  `).join('');

  // Render Numbered Pagination Controls (Page 1, Page 2, Page 3...)
  renderPagination(paginationContainer, menuPage, totalPages, 'changeMenuPage');
}

// Render Food Recommendation Cards (Max 4 items per page with numbered pagination)
function renderFoodMenu() {
  const grid = document.getElementById('foodGrid');
  const paginationContainer = document.getElementById('foodPagination');
  if (!grid) return;

  const items = getMenuData();
  const pastries = items.filter(i => i.category === 'pastry');

  const totalPages = Math.ceil(pastries.length / ITEMS_PER_PAGE) || 1;
  if (foodPage > totalPages) foodPage = 1;

  const startIndex = (foodPage - 1) * ITEMS_PER_PAGE;
  const displayItems = pastries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  grid.innerHTML = displayItems.map(item => `
    <div class="product-card">
      <div class="product-img-box">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="product-card-body">
        <h3 class="product-name">${item.name}</h3>
        <p class="product-desc">${item.desc}</p>
        <div class="product-price">Rp ${formatPrice(item.price)}</div>
        <div class="product-footer">
          <button class="btn-to-cart" onclick="addToCart('${item.id}')">ADD TO CART</button>
        </div>
      </div>
    </div>
  `).join('');

  // Render Numbered Pagination Controls (Page 1, Page 2...)
  renderPagination(paginationContainer, foodPage, totalPages, 'changeFoodPage');
}

// Helper to Render Numbered Pagination Buttons (Prev, 1, 2, 3..., Next)
function renderPagination(container, currentPage, totalPages, callbackFnName) {
  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="${callbackFnName}(${currentPage - 1})">‹ Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="${callbackFnName}(${i})">${i}</button>`;
  }

  html += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="${callbackFnName}(${currentPage + 1})">Next ›</button>`;

  container.innerHTML = html;
}

function changeMenuPage(page) {
  menuPage = page;
  renderMenu();
}

function changeFoodPage(page) {
  foodPage = page;
  renderFoodMenu();
}

// Render Gallery Grid
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const filtered = GALLERY_DATA.filter(item => {
    return (currentGalleryCat === 'all') || (item.category === currentGalleryCat);
  });

  grid.innerHTML = filtered.map(item => `
    <div class="product-card gallery-card" onclick="openLightbox('${item.image}', '${item.title}', '${item.categoryLabel}')">
      <div class="product-img-box" style="height:220px;">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="product-card-body">
        <h3 class="gallery-card-title">${item.title}</h3>
        <span class="gallery-card-badge">${item.categoryLabel}</span>
      </div>
    </div>
  `).join('');
}

// Category Pills Handler
function setupFilterPills() {
  const pills = document.querySelectorAll('.category-filter-bar .cat-pill:not(.gallery-tab-btn)');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.cat;
      menuPage = 1;
      renderMenu();
    });
  });
}

function setupGalleryPills() {
  const pills = document.querySelectorAll('.gallery-tab-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentGalleryCat = pill.dataset.gcat;
      renderGallery();
    });
  });
}

// Search & Sort Setup
function setupSearchAndSort() {
  const searchInput = document.getElementById('menuSearchInput');
  const sortSelect = document.getElementById('menuSortSelect');

  if (searchInput) searchInput.addEventListener('input', () => {
    menuPage = 1;
    renderMenu();
  });
  if (sortSelect) sortSelect.addEventListener('change', () => {
    menuPage = 1;
    renderMenu();
  });
}

// Slider Navigation
function scrollMenuSlider(direction) {
  const wrapper = document.querySelector('.slider-wrapper');
  if (wrapper) {
    const scrollAmount = 300 * direction;
    wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

// Toggle Show All
function toggleShowAllMenu() {
  showAllMenu = !showAllMenu;
  const btn = document.querySelector('.menu-more-wrapper .btn-more');
  if (btn) btn.innerText = showAllMenu ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua Menu';
  renderMenu();
}

// Cart Management
function initCart() {
  const savedCart = localStorage.getItem('joy_cart_items');
  if (savedCart) {
    try { cart = JSON.parse(savedCart); } catch (e) {}
  }
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('joy_cart_items', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const items = getMenuData();
  const product = items.find(i => i.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  toggleCartDrawer(true);
}

function addPromoItemToCart() {
  addToCart('latte');
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart();
}

function updateCartUI() {
  const cartBadge = document.getElementById('cartBadge');
  const basketCount = document.getElementById('basketCount');
  const drawerCount = document.getElementById('cartDrawerCount');
  const container = document.getElementById('cartItemsContainer');
  const subtotalText = document.getElementById('cartSubtotalText');

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (cartBadge) cartBadge.innerText = totalCount;
  if (basketCount) basketCount.innerText = totalCount;
  if (drawerCount) drawerCount.innerText = totalCount;

  if (subtotalText) {
    const usdApprox = (totalPrice / 15500).toFixed(2);
    subtotalText.innerText = `Rp ${formatPrice(totalPrice)} ($${usdApprox})`;
  }

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-msg">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" style="margin:0 auto 12px; display:block;">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
        </svg>
        Keranjang belanja Anda masih kosong.
      </div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">Rp ${formatPrice(item.price * item.qty)}</div>
      </div>
      <div class="cart-qty-ctrl">
        <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
        <span style="font-weight:700; font-size:0.85rem;">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

function toggleCartDrawer(openState) {
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (!overlay || !drawer) return;

  if (typeof openState === 'boolean') {
    if (openState) {
      overlay.classList.add('active');
      drawer.classList.add('active');
    } else {
      overlay.classList.remove('active');
      drawer.classList.remove('active');
    }
  } else {
    overlay.classList.toggle('active');
    drawer.classList.toggle('active');
  }
}

function checkoutCartWhatsApp() {
  if (cart.length === 0) {
    alert('Keranjang belanja Anda masih kosong!');
    return;
  }

  let text = 'Halo et al Coffee Purwokerto! Saya ingin memesan pesanan berikut:\n\n';
  let total = 0;
  cart.forEach((item, i) => {
    const sub = item.price * item.qty;
    total += sub;
    text += `${i+1}. ${item.name} (${item.qty}x) = Rp ${formatPrice(sub)}\n`;
  });
  text += `\n*Total Pesanan:* Rp ${formatPrice(total)}\nMohon konfirmasi pesanan saya. Terima kasih!`;

  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/6281319972226?text=${encoded}`, '_blank');
}

// Modals Handlers
function openReservationModal() {
  closeModals();
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('reservationModal');
  if (backdrop && modal) {
    backdrop.classList.add('active');
    modal.classList.add('active');
  }
}

function openAdminModal() {
  closeModals();
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('adminModal');
  if (backdrop && modal) {
    backdrop.classList.add('active');
    modal.classList.add('active');
    renderAdminMenuList();
  }
}

function openLightbox(imgUrl, title, catLabel) {
  closeModals();
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const catEl = document.getElementById('lightboxCat');

  if (backdrop && modal && img) {
    img.src = imgUrl;
    if (titleEl) titleEl.innerText = title;
    if (catEl) catEl.innerText = catLabel;
    backdrop.classList.add('active');
    modal.classList.add('active');
  }
}

function closeModals() {
  const backdrop = document.getElementById('modalBackdrop');
  const modals = document.querySelectorAll('.modal-card');
  if (backdrop) backdrop.classList.remove('active');
  modals.forEach(m => m.classList.remove('active'));
}

function handleReservationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('resName').value;
  const date = document.getElementById('resDate').value;
  const time = document.getElementById('resTime').value;
  const guests = document.getElementById('resGuests').value;

  closeModals();
  alert(`Terima kasih ${name}! Reservasi meja untuk ${guests} pada ${date} pukul ${time} WIB telah berhasil dicatat.`);
}

function renderAdminMenuList() {
  const container = document.getElementById('adminMenuList');
  if (!container) return;

  const items = getMenuData();
  container.innerHTML = items.map((item, index) => `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:10px; background:rgba(255, 255, 255, 0.1); margin-bottom:8px; border-radius:10px; border:1px solid rgba(255, 255, 255, 0.15);">
      <div>
        <strong style="font-size:0.9rem; color:var(--text-cream);">${item.name}</strong> <span style="font-size:0.75rem; color:var(--text-cream-muted);">(${item.category})</span>
        <div style="font-size:0.8rem; color:var(--text-cream); font-weight:700;">Rp ${formatPrice(item.price)}</div>
      </div>
      <button onclick="deleteAdminProduct(${index})" style="color:#ef4444; font-size:0.8rem; font-weight:700; background:#fee2e2; padding:4px 10px; border-radius:8px;">Hapus</button>
    </div>
  `).join('');
}

function handleAdminAddProduct(e) {
  e.preventDefault();
  const name = document.getElementById('admName').value;
  const cat = document.getElementById('admCat').value;
  const price = parseInt(document.getElementById('admPrice').value) || 0;
  const desc = document.getElementById('admDesc').value;

  const newItem = {
    id: 'custom-' + Date.now(),
    name,
    category: cat,
    catGroup: [cat],
    desc,
    price,
    dollarPrice: 'Rp ' + formatPrice(price),
    image: 'images/latte.png'
  };

  const items = getMenuData();
  items.unshift(newItem);
  saveMenuData(items);

  document.getElementById('adminAddForm').reset();
  renderAdminMenuList();
  alert(`Menu "${name}" berhasil ditambahkan!`);
}

function deleteAdminProduct(index) {
  const items = getMenuData();
  items.splice(index, 1);
  saveMenuData(items);
  renderAdminMenuList();
}

function setupScrollHeader() {
  const header = id => document.getElementById(id);
  window.addEventListener('scroll', () => {
    const mainHeader = header('mainHeader');
    if (mainHeader) {
      if (window.scrollY > 50) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }
  });
}

function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function toggleMobileMenu() {
  const menu = document.getElementById('navMenu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('navMenu');
  if (menu) {
    menu.classList.remove('active');
  }
}
