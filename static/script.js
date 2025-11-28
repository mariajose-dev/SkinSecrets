document.addEventListener('DOMContentLoaded', function () {
    // --- Utilities ---
    function showSnackbar(message) {
        const x = document.getElementById("snackbar");
        if (x) {
            x.innerText = message;
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }
    }

    function getCurrentUser() {
        return localStorage.getItem('loggedInUser');
    }

    function logout() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    }

    // --- Auth State Management ---
    const userEmail = getCurrentUser();
    const authLinks = document.getElementById('auth-links');
    const adminLinks = document.querySelectorAll('.admin-only');

    if (authLinks) {
        if (userEmail) {
            // User is logged in
            authLinks.innerHTML = `
                <span class="navbar-text me-3">Hello, ${userEmail}</span>
                <button class="btn btn-outline-danger btn-sm" id="logoutBtn">Logout</button>
            `;
            document.getElementById('logoutBtn').addEventListener('click', logout);

            // Check if admin
            if (userEmail === 'admin@gmail.com') {
                adminLinks.forEach(el => el.classList.remove('d-none'));
            }
        } else {
            // User is not logged in
            authLinks.innerHTML = `
                <a href="login.html" class="btn btn-outline-primary btn-sm me-2">Login</a>
                <a href="register.html" class="btn btn-primary btn-sm">Register</a>
            `;

            // Redirect to login if on protected pages
            const path = window.location.pathname;
            const filename = path.split('/').pop();
            if (filename !== 'login.html' && filename !== 'register.html' && filename !== 'index.html' && filename !== '') {
                // Protected pages - redirect to login if not authenticated
            }
        }
    }

    // --- Registration Logic ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password.length < 6) {
                showSnackbar("Password must be at least 6 characters");
                return;
            }

            if (password !== confirmPassword) {
                showSnackbar("Passwords do not match");
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(u => u.email === email)) {
                showSnackbar("Email already exists");
                return;
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            showSnackbar("Registration Successful! Redirecting...");
            setTimeout(() => window.location.href = 'login.html', 1500);
        });
    }

    // --- Login Logic ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user || (email === 'admin@gmail.com' && password === 'admin123')) {
                localStorage.setItem('loggedInUser', email);
                showSnackbar("Login Successful!");
                setTimeout(() => window.location.href = 'index.html', 1000);
            } else {
                showSnackbar("Invalid credentials");
            }
        });
    }

    // --- Cart Logic ---
    updateCartCount();

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        const badge = document.getElementById('cart-count');
        if (badge) badge.innerText = count;
    }

    // --- Product Rendering Logic (Shop Page) ---
    const productList = document.getElementById('product-list');
    if (productList) {
        loadProducts();
    }

    function loadProducts() {
        let products = JSON.parse(localStorage.getItem('products')) || [];

        if (products.length === 0) {
            products = [
                { id: 1, name: "Glow Serum", price: 250, description: "Radiant skin in a bottle.", imagename: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/newscms/2019_11/1417980/skin-serum-today-inline2-190315.jpg" },
                { id: 2, name: "Hydrating Cream", price: 185, description: "Deep moisture for dry skin.", imagename: "https://img.freepik.com/free-photo/moisturizer-product-beauty-care-with-pink-tones_23-2151005538.jpg?semt=ais_hybrid&w=740&q=80" },
                { id: 3, name: "Sunscreen SPF 50", price: 350, description: "Protect your skin from UV rays.", imagename: "https://cdn.thewirecutter.com/wp-content/media/2025/03/BEST-FACE-SUNSCREENS-2048px-7351.jpg?auto=webp&quality=75&width=1024" }
            ];
            localStorage.setItem('products', JSON.stringify(products));
        }

        productList.innerHTML = '';
        products.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col';

            let adminButtons = '';
            if (userEmail === 'admin@gmail.com') {
                adminButtons = `
                    <div class="mt-2">
                        <a href="edit_product.html?id=${product.id}" class="btn btn-warning btn-sm btn-material">Edit</a>
                        <button class="btn btn-danger btn-sm btn-material" onclick="deleteProduct(${product.id})">Delete</button>
                    </div>
                `;
            }

            col.innerHTML = `
                <div class="card h-100">
                    <img src="${product.imagename}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text flex-grow-1">${product.description}</p>
                        <h6 class="card-subtitle mb-2 text-muted">Rs. ${product.price}</h6>
                        <button class="btn btn-primary btn-material mt-auto" onclick="addToCart(${product.id})">Add to Cart</button>
                        ${adminButtons}
                    </div>
                </div>
            `;
            productList.appendChild(col);
        });
    }

    // --- Admin Logic (Add Product) ---
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        if (userEmail !== 'admin@gmail.com') {
            window.location.href = 'index.html';
        }

        addProductForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('productName').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const desc = document.getElementById('productDesc').value;
            const image = document.getElementById('productImage').value;

            let products = JSON.parse(localStorage.getItem('products')) || [];
            const newProduct = {
                id: Date.now(),
                name: name,
                price: price,
                description: desc,
                imagename: image
            };

            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));

            showSnackbar("Product Added Successfully!");
            setTimeout(() => window.location.href = 'shop.html', 1000);
        });
    }

    // --- Admin Logic (Edit Product) ---
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        if (userEmail !== 'admin@gmail.com') {
            window.location.href = 'index.html';
        }

        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);

        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('editName').value = product.name;
            document.getElementById('editPrice').value = product.price;
            document.getElementById('editDesc').value = product.description;
            document.getElementById('editImage').value = product.imagename;
        } else {
            showSnackbar("Product not found");
            setTimeout(() => window.location.href = 'shop.html', 1000);
        }

        editProductForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const id = parseInt(document.getElementById('productId').value);
            const name = document.getElementById('editName').value;
            const price = parseFloat(document.getElementById('editPrice').value);
            const desc = document.getElementById('editDesc').value;
            const image = document.getElementById('editImage').value;

            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { id, name, price, description: desc, imagename: image };
                localStorage.setItem('products', JSON.stringify(products));
                showSnackbar("Product Updated Successfully!");
                setTimeout(() => window.location.href = 'shop.html', 1000);
            }
        });
    }

    // --- Cart Page Logic ---
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        loadCart();
    }

    function loadCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartTotalElement = document.getElementById('cart-total');

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.imagename}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                            ${item.name}
                        </div>
                    </td>
                    <td>Rs. ${item.price}</td>
                    <td>
                        <input type="number" class="form-control" value="${item.quantity}" min="1" style="width: 80px;" onchange="updateQuantity(${item.id}, this.value)">
                    </td>
                    <td>Rs. ${itemTotal.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm btn-material" onclick="removeFromCart(${item.id})">Remove</button>
                    </td>
                `;
                cartItemsContainer.appendChild(tr);
            });
        }

        if (cartTotalElement) cartTotalElement.innerText = total.toFixed(2);
    }

    // Global functions
    window.deleteProduct = function (id) {
        if (confirm("Are you sure you want to delete this product?")) {
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products = products.filter(p => p.id !== id);
            localStorage.setItem('products', JSON.stringify(products));
            loadProducts();
            showSnackbar("Product deleted");
        }
    };

    window.addToCart = function (id) {
        if (!userEmail) {
            showSnackbar("Please login to add items to cart");
            setTimeout(() => window.location.href = 'login.html', 1000);
            return;
        }

        let products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === id);

        if (product) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showSnackbar("Added to cart");
        }
    };

    window.updateQuantity = function (id, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity < 1) item.quantity = 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
            updateCartCount();
        }
    };

    window.removeFromCart = function (id) {
        if (confirm("Remove this item from cart?")) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
            updateCartCount();
            showSnackbar("Item removed");
        }
    };
});
