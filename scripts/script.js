// Fetch cart from localStorage or initialize as empty
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save updated cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart items
function renderCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('total-amount').textContent = '₱0';
    return;
  }

  let totalAmount = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    const itemHTML = `
      <div class="cart-item">
        <input type="checkbox" class="item-checkbox">
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <span class="item-name">${item.name}</span>
        <span class="item-price" data-price="${item.price}">₱${item.price}</span>
        <div class="quantity-controls">
          <button class="decrease-btn" onclick="updateQuantity(${index}, -1)">-</button>
          <input type="number" class="quantity" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value - cart[${index}].quantity)">
          <button class="increase-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <button class="delete-btn" onclick="removeItem(${index})">Delete</button>
      </div>
    `;
    cartItemsContainer.innerHTML += itemHTML;
  });

  document.getElementById('total-amount').textContent = `₱${totalAmount.toFixed(2)}`;
}

// Update item quantity
function updateQuantity(index, change) {
  const cart = getCart();
  cart[index].quantity += change;

  // Prevent negative or zero quantity
  if (cart[index].quantity < 1) {
    cart[index].quantity = 1;
