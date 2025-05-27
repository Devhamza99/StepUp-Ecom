document.addEventListener('DOMContentLoaded', function() {
    // Products data
    const products = [
        {
            id: 1,
            name: "Urban Runner",
            description: "Lightweight running shoes with cushioned soles for maximum comfort.",
            price: 89.99,
            originalPrice: 120.00,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 2,
            name: "Classic Sneakers",
            description: "Timeless design meets modern comfort in these versatile sneakers.",
            price: 65.99,
            originalPrice: 85.00,
            image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 3,
            name: "Leather Oxford",
            description: "Elegant formal shoes crafted from premium leather for business occasions.",
            price: 129.99,
            originalPrice: 150.00,
            image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 4,
            name: "Trail Blazer",
            description: "Durable hiking shoes with superior grip for outdoor adventures.",
            price: 109.99,
            originalPrice: 140.00,
            image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 5,
            name: "Air Comfort",
            description: "Breathable mesh shoes with air-cushioned soles for all-day wear.",
            price: 79.99,
            originalPrice: 99.00,
            image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 6,
            name: "Basketball Pro",
            description: "High-performance basketball shoes with ankle support and cushioning.",
            price: 119.99,
            originalPrice: 145.00,
            image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
    ];

    // Cart functionality
    let cart = [];
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const continueShopping = document.querySelector('.continue-shopping');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const productGrid = document.getElementById('product-grid');

    // Display products
    function displayProducts() {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">
                        <div>
                            <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                            <span class="price">$${product.price.toFixed(2)}</span>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });

        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Add to cart function
    function addToCart(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        showCartNotification();
    }

    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <p class="cart-item-remove" data-id="${item.id}">Remove</p>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            
            totalPrice += item.price * item.quantity;
        });
        
        // Update total price
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Show cart notification
    function showCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = 'Item added to cart!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Increase quantity
    function increaseQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        item.quantity += 1;
        updateCart();
    }

    // Decrease quantity
    function decreaseQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCart();
    }

    // Remove item
    function removeItem(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // Toggle cart modal
    function toggleCart() {
        cartModal.classList.toggle('active');
    }

    // Event listeners
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    continueShopping.addEventListener('click', toggleCart);

    // Initialize
    displayProducts();

    // Add cart notification styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 3000;
        }
        
        .cart-notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});