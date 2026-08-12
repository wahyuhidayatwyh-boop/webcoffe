/* ==========================================================================
   JOY COFFEE & EATERY - PHOTOREALISTIC & CMS ENGINE
   ========================================================================== */

const DEFAULT_MENU_ITEMS = [
  {
    id: 'latte',
    name: 'Latte',
    category: 'coffee',
    price: 25000,
    desc: 'Espresso murni 100% Arabika dengan susu steamed creamy dan latte art lembut.',
    image: 'images/latte.png',
    popular: true
  },
  {
    id: 'matcha',
    name: 'Matcha Latte',
    category: 'non-coffee',
    price: 28000,
    desc: 'Matcha khas Uji Jepang kualitas premium dipadu dengan fresh milk gurih.',
    image: 'images/matcha.png',
    popular: true
  },
  {
    id: 'filter',
    name: 'Ice Filter Coffee',
    category: 'coffee',
    price: 26000,
    desc: 'Seduhan manual V60 biji kopi single origin lokal dengan nota rasa fruity segar.',
    image: 'images/iced_filter.png',
    popular: true
  },
  {
    id: 'croissant',
    name: 'Croissant Almond',
    category: 'pastry',
    price: 22000,
    desc: 'Croissant renyah berlapis dengan isian krim almond manis.',
    image: 'images/croissant.png',
    popular: false
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake Beri',
    category: 'pastry',
    price: 26000,
    desc: 'Dessert lembut dengan saus beri segar buatan sendiri.',
    image: 'images/cheesecake.png',
    popular: false
  },
  {
    id: 'cookie',
    name: 'Kue Kering Cokelat',
    category: 'pastry',
    price: 16000,
    desc: 'Kue kering hangat dengan rasa cokelat melimpah.',
    image: 'images/cookie.png',
    popular: false
  },
  {
    id: 'beans-250g',
    name: 'Joy House Blend Beans (250g)',
    category: 'beans',
    price: 85000,
    desc: 'Biji kopi pilihan 100% Arabika Java Preanger & Toraja. Notes: Caramel, Cocoa, Red Apple.',
    image: 'images/beans_bag.png',
    popular: false
  }
];

// LocalStorage Helper for Menu CMS
function getMenuData() {
  const saved = localStorage.getItem('joy_menu_data');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return DEFAULT_MENU_ITEMS;
}

function saveMenuData(data) {
  localStorage.setItem('joy_menu_data', JSON.stringify(data));
  renderPopularDrinks();
  renderFoodMenu();
}

// LocalStorage Helper for Customer Reservations
function getReservationsData() {
  const saved = localStorage.getItem('joy_reservations');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return [
    { name: 'Budi Santoso', phone: '08123456789', guests: '3-4 Orang', date: '2026-08-15', time: '16:00', area: 'Indoor AC (WFC Zone)' },
    { name: 'Siti Rahma', phone: '08198765432', guests: '1-2 Orang', date: '2026-08-16', time: '19:00', area: 'Outdoor Garden' }
  ];
}

function saveReservationsData(data) {
  localStorage.setItem('joy_reservations', JSON.stringify(data));
}

// Mobile Navbar Drawer Toggle
function toggleMobileNav() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// DOM Content Loaded Initializer
document.addEventListener('DOMContentLoaded', () => {
  renderPopularDrinks();
  renderFoodMenu();
  setupEventListeners();

  // Close mobile menu on link click
  const links = document.querySelectorAll('.nav-links a, .nav-links button');
  links.forEach(l => {
    l.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) navLinks.classList.remove('active');
    });
  });
});

// Render Popular Drinks
function renderPopularDrinks() {
  const grid = document.getElementById('popularGrid');
  if (!grid) return;

  const menu = getMenuData();
  const popular = menu.filter(item => item.popular || item.category === 'coffee' || item.category === 'non-coffee').slice(0, 3);

  grid.innerHTML = popular.map(item => `
    <div class="drink-card">
      <div class="drink-img-wrapper">
        <div class="drink-img-bg">
          <img src="${item.image}" alt="${item.name}">
        </div>
      </div>
      <h3 class="drink-title">${item.name}</h3>
      <p class="drink-desc">${item.desc}</p>
      <div class="drink-price">Rp ${formatNumber(item.price)}</div>
    </div>
  `).join('');
}

// Render Recommended Food Menu
function renderFoodMenu() {
  const grid = document.getElementById('foodGrid');
  if (!grid) return;

  const menu = getMenuData();
  const food = menu.filter(item => item.category === 'pastry').slice(0, 3);

  grid.innerHTML = food.map(item => `
    <div class="food-card">
      <div class="food-thumb">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="food-info">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="food-bottom">
          <span class="food-price">Rp ${formatNumber(item.price)}</span>
          <button class="btn-add-circle" onclick="openModal('reservationModal')" title="Pesan Meja">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Modal Handlers
function openModal(modalId) {
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById(modalId);
  if (backdrop && modal) {
    backdrop.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const modals = document.querySelectorAll('.modal-container');
  if (backdrop) backdrop.classList.remove('active');
  modals.forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

// Event Listeners Setup
function setupEventListeners() {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  // Reservation Form Handler
  const resForm = document.getElementById('reservationForm');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('resName').value;
      const phone = document.getElementById('resPhone').value;
      const guests = document.getElementById('resGuests').value;
      const date = document.getElementById('resDate').value;
      const time = document.getElementById('resTime').value;
      const area = document.getElementById('resArea') ? document.getElementById('resArea').value : 'Indoor AC';

      const newRes = { name, phone, guests, date, time, area };
      const currentRes = getReservationsData();
      currentRes.unshift(newRes);
      saveReservationsData(currentRes);

      closeModal();
      alert(`Terima kasih ${name}! Reservasi meja (${guests}) pada ${date} jam ${time} telah tercatat di sistem kami.`);
      resForm.reset();
    });
  }
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
