/* =========================================================
   LUXÉORA CART PAGE
   Changes from your version:
   1. Checkout button now opens checkout.html (empty cart blocked)
   2. Quantity is capped at 20 to match the server limit
   Cart storage key and item format are unchanged: "luxeoCart"
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const MAX_QUANTITY = 20;

    const cartItems = document.getElementById("cartItems");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");
    const emptyCart = document.getElementById("emptyCart");
    const checkoutButton = document.getElementById("checkoutButton");

    /* GET CART */

    function getCart() {
        const savedCart = localStorage.getItem("luxeoCart");

        if (!savedCart) {
            return [];
        }

        try {
            return JSON.parse(savedCart);
        } catch (error) {
            return [];
        }
    }

    /* SAVE CART */

    function saveCart(cart) {
        localStorage.setItem("luxeoCart", JSON.stringify(cart));
    }

    /* DISPLAY CART */

    function displayCart() {
        const cart = getCart();

        cartItems.innerHTML = "";

        /* EMPTY CART */

        if (cart.length === 0) {
            cartItems.style.display = "none";
            emptyCart.style.display = "block";
            cartSubtotal.textContent = "₹0";
            cartTotal.textContent = "₹0";
            return;
        }

        cartItems.style.display = "flex";
        emptyCart.style.display = "none";

        let subtotal = 0;

        cart.forEach(function (product) {

            subtotal += product.price * product.quantity;

            const item = document.createElement("article");

            item.className = "cart-item";

            item.innerHTML = `

                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div class="cart-item-details">

                    <h2>${product.name}</h2>

                    <p>${product.description}</p>

                    <div class="cart-item-price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </div>

                    <div class="quantity-controls">

                        <button
                            type="button"
                            class="quantity-button decrease-quantity"
                            data-id="${product.id}"
                        >
                            −
                        </button>

                        <span class="quantity-value">
                            ${product.quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-button increase-quantity"
                            data-id="${product.id}"
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        class="remove-cart-item"
                        data-id="${product.id}"
                    >
                        REMOVE
                    </button>

                </div>

            `;

            cartItems.appendChild(item);

        });

        cartSubtotal.textContent = "₹" + subtotal.toLocaleString("en-IN");
        cartTotal.textContent = "₹" + subtotal.toLocaleString("en-IN");

        addCartControls();
    }

    /* CART CONTROLS */

    function addCartControls() {

        const increaseButtons = document.querySelectorAll(".increase-quantity");
        const decreaseButtons = document.querySelectorAll(".decrease-quantity");
        const removeButtons = document.querySelectorAll(".remove-cart-item");

        /* INCREASE */

        increaseButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const productId = Number(button.dataset.id);
                const cart = getCart();

                const product = cart.find(function (item) {
                    return item.id === productId;
                });

                if (product) {
                    if (product.quantity >= MAX_QUANTITY) {
                        alert("You can buy at most " + MAX_QUANTITY + " of one item.");
                        return;
                    }

                    product.quantity += 1;
                }

                saveCart(cart);
                displayCart();

            });

        });

        /* DECREASE */

        decreaseButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const productId = Number(button.dataset.id);
                const cart = getCart();

                const product = cart.find(function (item) {
                    return item.id === productId;
                });

                if (product) {

                    product.quantity -= 1;

                    if (product.quantity <= 0) {
                        const index = cart.indexOf(product);
                        cart.splice(index, 1);
                    }

                }

                saveCart(cart);
                displayCart();

            });

        });

        /* REMOVE */

        removeButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const productId = Number(button.dataset.id);

                let cart = getCart();

                cart = cart.filter(function (item) {
                    return item.id !== productId;
                });

                saveCart(cart);
                displayCart();

            });

        });

    }

    /* CHECKOUT BUTTON */

    if (checkoutButton) {

        checkoutButton.addEventListener("click", function () {

            if (getCart().length === 0) {
                alert("Your cart is empty.");
                return;
            }

            window.location.href = "checkout.html";

        });

    }

    /* INITIAL DISPLAY */

    displayCart();

});