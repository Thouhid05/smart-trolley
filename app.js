let cart = []; // Initialize an empty cart

// Sample products for demonstration purposes
const products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 150 },
  { id: 3, name: 'Product 3', price: 200 }
];

// Function to display products on the page
function displayProducts() {
  const productList = document.getElementById('product-list');
  productList.innerHTML = ''; // Clear the product list before adding new items

  products.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.innerHTML = `
      <p>${product.name}</p>
      <p>Price: ₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(productItem);
  });
}

// Function to add a product to the cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);

  // Check if the product is already in the cart
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1; // Increase quantity if already in cart
  } else {
    cart.push({ ...product, quantity: 1 }); // Add product to cart
  }

  saveCart(); // Save the updated cart to local storage
  alert(`${product.name} has been added to your cart!`);
  updateCartDisplay(); // Update the cart display
}

// Function to display cart items and total price
function updateCartDisplay() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = ''; // Clear previous cart items

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <p>${item.name} - ₹${item.price} (x${item.quantity})</p>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartList.appendChild(cartItem);
  });

  updateCartTotal(); // Update the total amount
}

// Function to calculate and display the total amount
function updateCartTotal() {
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalElement = document.getElementById('total-amount');
  totalElement.textContent = `Total: ₹${totalAmount}`;
}

// Function to remove an item from the cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId); // Remove the item from the cart
  saveCart(); // Update local storage
  updateCartDisplay(); // Refresh the cart display
}

// Function to save the cart in local storage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load the cart from local storage when the page loads
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart); // Load the saved cart
    updateCartDisplay(); // Refresh the cart display
  }
}

// Function to handle the checkout process
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert(`Checkout successful! Your total is ₹${cart.reduce((total, item) => total + item.price * item.quantity, 0)}.`);
    cart = []; // Clear the cart after checkout
    saveCart(); // Clear saved cart in local storage
    updateCartDisplay(); // Refresh the cart display
  }
}

// Event listener to load products and cart when the page loads
document.addEventListener('DOMContentLoaded', () => {
  displayProducts(); // Display the products
  loadCart(); // Load the cart from local storage
});
