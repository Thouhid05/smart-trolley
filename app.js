let cart = []; // Initialize an empty cart
let products = []; // Declare products array globally

// Function to display products on the page
async function displayProducts() {
    try {
        const response = await fetch('http://192.168.1.15:5000/products'); // Fetch products from the API
        products = await response.json(); // Assign the fetched products to the global products variable

        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear the product list before adding new items

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <span class="product-name">${product.name}</span>
                <span class="product-price">₹${product.price}</span>
                <button onclick="addToCart('${product._id}')">Add to Cart</button>
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products. Please try again later.');
    }
}

// Function to add a product to the cart
function addToCart(productId) {
    const product = products.find(p => p._id === productId); // Find the product by ID

    if (!product) {
        alert("Product not found!"); // Alert if product doesn't exist
        return;
    }

    // Check if the product is already in the cart
    const cartItem = cart.find(item => item._id === productId);
    if (cartItem) {
        cartItem.quantity += 1; // Increase quantity if already in cart
    } else {
        cart.push({ ...product, quantity: 1 }); // Add product to cart
    }

    // Show notification without an OK button
    showNotification(`${product.name} has been added to your cart!`);
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
            <button onclick="removeFromCart('${item._id}')">Remove</button>
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
    cart = cart.filter(item => item._id !== productId); // Remove the item from the cart
    updateCartDisplay(); // Refresh the cart display
}

// Function to delete a product
async function deleteProduct(productId) {
    try {
        await fetch(`http://<YOUR_LOCAL_IP>:5000/products/${productId}`, {
            method: 'DELETE'
        });
        displayProducts(); // Refresh the product list after deletion
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again later.');
    }
}

// Function to show a notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);

    // Automatically remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
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
        const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        alert(`Checkout successful! Your total is ₹${total}.`);
        cart = []; // Clear the cart after checkout
        saveCart(); // Clear saved cart in local storage
        updateCartDisplay(); // Refresh the cart display
    }
}

// Function to add a new product
async function addProduct(name, price) {
    try {
        const response = await fetch('http://<YOUR_LOCAL_IP>:5000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        displayProducts(); // Refresh the product list
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to upload products. Please try again later.');
    }
}

// Event listener for the product form submission
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;

    await addProduct(name, price); // Add new product
    document.getElementById('add-product-form').reset(); // Clear the form
});

// Event listener to load products and cart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(); // Display products when the page loads
    loadCart(); // Load the cart from local storage
});
