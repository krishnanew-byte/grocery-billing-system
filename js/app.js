const products = [
  { id: 1, name: 'Rice 1kg', price: 120, category: 'Grains' },
  { id: 2, name: 'Wheat Flour 1kg', price: 90, category: 'Grains' },
  { id: 3, name: 'Dal Toor 1kg', price: 150, category: 'Groceries' },
  { id: 4, name: 'Dal Moong 1kg', price: 180, category: 'Groceries' },
  { id: 5, name: 'Oil 1L', price: 200, category: 'Cooking' },
  { id: 6, name: 'Sugar 1kg', price: 85, category: 'Groceries' },
  { id: 7, name: 'Salt 500g', price: 20, category: 'Essentials' },
  { id: 8, name: 'Tea 100g', price: 120, category: 'Essentials' },
  { id: 9, name: 'Coffee 100g', price: 250, category: 'Essentials' },
  { id: 10, name: 'Biscuits 200g', price: 45, category: 'Snacks' },
  { id: 11, name: 'Chips 50g', price: 30, category: 'Snacks' },
  { id: 12, name: 'Soap 100g', price: 40, category: 'Toiletries' },
  { id: 13, name: 'Toothpaste 100g', price: 85, category: 'Toiletries' },
  { id: 14, name: 'Shampoo 200ml', price: 150, category: 'Toiletries' },
  { id: 15, name: 'Bread 400g', price: 45, category: 'Bakery' },
];

let cart = [];
let billCounter = 1000;

const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const totalAmount = document.querySelector('.total-amount');
const billingArea = document.getElementById('billingArea');
const dashboard = document.querySelector('.dashboard');

function renderProducts(filter = '') {
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.category.toLowerCase().includes(filter.toLowerCase())
  );
  
  productsGrid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add</button>
    </div>
  `).join('');
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
  updateStats();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-item"><span>Cart is empty</span><span>₹0.00</span></div>';
    totalAmount.textContent = '₹0.00';
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="item-name">${item.name} (x${item.quantity})</span>
      <span class="item-qty">₹${item.price}</span>
      <span class="item-price">₹${item.price * item.quantity}</span>
    </div>
  `).join('');
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalAmount.textContent = `₹${total.toFixed(2)}`;
}

function updateStats() {
  document.getElementById('totalSales').textContent = `₹${cart.reduce((s, i) => i.price * i.quantity + s, 0).toFixed(2)}`;
  document.getElementById('itemsSold').textContent = cart.reduce((s, i) => s + i.quantity, 0);
  document.getElementById('orders').textContent = cart.length;
}

function hideBillingArea() {
  billingArea.style.display = 'none';
  dashboard.style.display = 'block';
  cart = [];
  renderCart();
  updateStats();
}

function generateInvoice() {
  if (cart.length === 0) {
    alert('Please add items to the cart first!');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const date = new Date();
  const billNumber = `BG-${billCounter++}`;
  
  const itemsHtml = cart.map(item => `
    <div>
      ${item.name} × ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}
    </div>
  `).join('');
  
  const invoiceContent = `
    <h2>Invoice</h2>
    <div>
      <strong>Bill #:</strong> ${billNumber}<br>
      <strong>Date:</strong> ${date.toLocaleDateString()}<br>
      <strong>Customer:</strong> -
    </div>
    <div style="margin: 2rem 0;">
      ${itemsHtml}
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
        <strong>Total: ₹${total.toFixed(2)}</strong>
      </div>
    </div>
    <p style="margin-top: 2rem; text-align: center;">Thank you for shopping with us!</p>
  `;
  
  const billWindow = window.open('', '_blank');
  billWindow.document.write(`
    <html><head><title>Invoice - ${billNumber}</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
      .invoice { border: 1px solid #ddd; padding: 2rem; border-radius: 8px; }
      .invoice h2 { color: var(--primary); margin-bottom: 1.5rem; }
      .invoice div { margin-bottom: 0.5rem; }
      .invoice strong { color: var(--secondary); }
      .invoice p { text-align: center; margin-top: 2rem; font-size: 0.875rem; color: var(--text); }
    </style></head><body class="invoice">${invoiceContent}</body></html>
  `);
  billWindow.document.close();
  
  hideBillingArea();
  alert('Invoice generated successfully!');
}

document.getElementById('productSearch').addEventListener('input', (e) => {
  renderProducts(e.target.value);
});

// Initial render
renderProducts();
renderCart();
updateStats();

// Tab switching
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('nav a.active')?.classList.remove('active');
    link.classList.add('active');
    
    if (link.textContent === 'Billing') {
      dashboard.style.display = 'none';
      billingArea.style.display = 'block';
    } else {
      dashboard.style.display = 'block';
      billingArea.style.display = 'none';
    }
  });
});