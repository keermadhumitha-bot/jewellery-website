document.addEventListener("DOMContentLoaded", function () {

    console.log("Luxéora Favorites Page Loaded");


    /* =========================================
       GET FAVORITES
       ========================================= */

    function getFavorites() {

        const savedFavorites =
            localStorage.getItem("luxeoFavorites");

        if (!savedFavorites) {
            return [];
        }

        try {

            return JSON.parse(savedFavorites);

        } catch (error) {

            console.error(
                "Error reading favorites:",
                error
            );

            return [];
        }
    }


    /* =========================================
       SAVE FAVORITES
       ========================================= */

    function saveFavorites(favorites) {

        localStorage.setItem(
            "luxeoFavorites",
            JSON.stringify(favorites)
        );

    }


    /* =========================================
       GET CART
       ========================================= */

    function getCart() {

        const savedCart =
            localStorage.getItem("luxeoCart");

        if (!savedCart) {
            return [];
        }

        try {

            return JSON.parse(savedCart);

        } catch (error) {

            console.error(
                "Error reading cart:",
                error
            );

            return [];
        }
    }


    /* =========================================
       SAVE CART
       ========================================= */

    function saveCart(cart) {

        localStorage.setItem(
            "luxeoCart",
            JSON.stringify(cart)
        );

    }


    /* =========================================
       DISPLAY FAVORITES
       ========================================= */

    function displayFavorites() {

        const wishlistItems =
            document.getElementById("wishlistItems");

        const emptyWishlist =
            document.getElementById("emptyWishlist");


        if (!wishlistItems || !emptyWishlist) {
            return;
        }


        const favorites = getFavorites();


        wishlistItems.innerHTML = "";


        /* No favorites */

        if (favorites.length === 0) {

            wishlistItems.style.display = "none";

            emptyWishlist.style.display = "block";

            return;
        }


        /* Favorites exist */

        wishlistItems.style.display = "grid";

        emptyWishlist.style.display = "none";


        favorites.forEach(function (product) {

            const card =
                document.createElement("div");

            card.className = "wishlist-card";


            card.innerHTML = `

                <div class="wishlist-image-container">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <button
                        type="button"
                        class="remove-favorite"
                        data-id="${product.id}"
                        title="Remove from favorites"
                    >
                        ♥
                    </button>

                </div>


                <div class="wishlist-product-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p class="wishlist-description">
                        ${product.description || ""}
                    </p>

                    <p class="wishlist-price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </p>


                    <div class="wishlist-buttons">

                        <button
                            type="button"
                            class="add-cart-button"
                            data-id="${product.id}"
                        >
                            ADD TO CART
                        </button>

                        <button
                            type="button"
                            class="remove-button"
                            data-id="${product.id}"
                        >
                            REMOVE
                        </button>

                    </div>

                </div>

            `;


            wishlistItems.appendChild(card);

        });


        addFavoriteEvents();

    }


    /* =========================================
       ADD FAVORITE EVENTS
       ========================================= */

    function addFavoriteEvents() {

        const removeHeartButtons =
            document.querySelectorAll(
                ".remove-favorite"
            );


        const removeButtons =
            document.querySelectorAll(
                ".remove-button"
            );


        const addCartButtons =
            document.querySelectorAll(
                ".add-cart-button"
            );


        /* Remove using heart */

        removeHeartButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        Number(this.dataset.id);

                    removeFavorite(productId);

                }
            );

        });


        /* Remove using REMOVE button */

        removeButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        Number(this.dataset.id);

                    removeFavorite(productId);

                }
            );

        });


        /* Add to cart */

        addCartButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        Number(this.dataset.id);

                    addFavoriteToCart(productId);

                }
            );

        });

    }


    /* =========================================
       REMOVE FAVORITE
       ========================================= */

    function removeFavorite(productId) {

        let favorites =
            getFavorites();


        favorites =
            favorites.filter(function (product) {

                return Number(product.id) !== productId;

            });


        saveFavorites(favorites);


        displayFavorites();

    }


    /* =========================================
       ADD FAVORITE PRODUCT TO CART
       ========================================= */

    function addFavoriteToCart(productId) {

        const favorites =
            getFavorites();


        const product =
            favorites.find(function (item) {

                return Number(item.id) === productId;

            });


        if (!product) {
            return;
        }


        let cart =
            getCart();


        const existingProduct =
            cart.find(function (item) {

                return Number(item.id) === productId;

            });


        /* Product already exists in cart */

        if (existingProduct) {

            existingProduct.quantity =
                Number(existingProduct.quantity || 1) + 1;

        }

        /* Product is not in cart */

        else {

            cart.push({

                id: product.id,

                name: product.name,

                description: product.description,

                category: product.category,

                price: product.price,

                oldPrice: product.oldPrice,

                image: product.image,

                quantity: 1

            });

        }


        saveCart(cart);


        /*
         * Go directly to cart page
         */

        window.location.href =
            "cart.html";

    }


    /* =========================================
       SEARCH
       ========================================= */

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");


    if (searchButton && searchInput) {

        searchButton.addEventListener(
            "click",
            function () {

                const searchText =
                    searchInput.value.trim();

                if (searchText === "") {
                    return;
                }


                window.location.href =
                    "collections.html?search=" +
                    encodeURIComponent(searchText);

            }
        );


        searchInput.addEventListener(
            "keypress",
            function (event) {

                if (event.key === "Enter") {

                    searchButton.click();

                }

            }
        );

    }


    /* =========================================
       INITIAL DISPLAY
       ========================================= */

    displayFavorites();

});