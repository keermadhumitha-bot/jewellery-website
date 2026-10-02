/* =========================================================
   DETERMINE CURRENT CATEGORY PAGE
   ========================================================= */

const currentPage =
    window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

let pageCategory = null;

if (currentPage === "rings.html") {

    pageCategory = "Ring";

}

else if (currentPage === "necklaces.html") {

    pageCategory = "Necklace";

}

else if (currentPage === "bracelets.html") {

    pageCategory = "Bracelet";

}

else if (currentPage === "earrings.html") {

    pageCategory = "Earring";

}

else if (currentPage === "bangles.html") {

    pageCategory = "Bangle";

}


/* =========================================================
   COLLECTIONS PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       PRODUCT DATA
       ===================================================== */

    const products = [

        {
            id: 1,
            name: "Diamond Crystal Necklace",
            description: "Elegant Diamond Necklace",
            category: "Necklace",
            price: 3450,
            oldPrice: 4200,
            purity: "18KT",
            style: "Classic",
            occasion: "Wedding",
            design: "Floral",
            size: "Medium",
            gem: "Diamond",
            gender: "Women",
            image: "assets/images/necklace1.jpg"
        },

        {
            id: 2,
            name: "Royal Diamond Ring",
            description: "Elegant Statement Ring",
            category: "Ring",
            price: 5200,
            oldPrice: 6500,
            purity: "18KT",
            style: "Statement",
            occasion: "Engagement",
            design: "Geometric",
            size: "Medium",
            gem: "Diamond",
            gender: "Women",
            image: "assets/images/ring2.jpeg"
        },

        {
            id: 3,
            name: "Diamond Crystal Bracelet",
            description: "Delicate Diamond Bracelet",
            category: "Bracelet",
            price: 2800,
            oldPrice: 3500,
            purity: "14KT",
            style: "Minimal",
            occasion: "Daily Wear",
            design: "Geometric",
            size: "Medium",
            gem: "Diamond",
            gender: "Women",
            image: "assets/images/bracelet1.png"
        },

        {
            id: 4,
            name: "Classic Gold Ring",
            description: "Timeless Gold Ring",
            category: "Ring",
            price: 12500,
            oldPrice: 15000,
            purity: "18KT",
            style: "Classic",
            occasion: "Wedding",
            design: "Traditional",
            size: "Medium",
            gem: "Diamond",
            gender: "Women",
            image: "assets/images/ring1.jpeg"
        },

        {
            id: 5,
            name: "Elegant Gold Necklace",
            description: "Traditional Gold Necklace",
            category: "Necklace",
            price: 18900,
            oldPrice: 22000,
            purity: "22KT",
            style: "Traditional",
            occasion: "Festive",
            design: "Floral",
            size: "Large",
            gem: "Ruby",
            gender: "Women",
            image: "assets/images/necklace2.png"
        },

        {
            id: 6,
            name: "Diamond Bangle",
            description: "Modern Diamond Bangle",
            category: "Bangle",
            price: 15700,
            oldPrice: 18500,
            purity: "18KT",
            style: "Modern",
            occasion: "Party",
            design: "Geometric",
            size: "Large",
            gem: "Diamond",
            gender: "Women",
            image: "assets/images/bangle1.jpeg"
        },

        {
            id: 7,
            name: "Elegant Earrings",
            description: "Beautiful Diamond Earrings",
            category: "Earring",
            price: 9800,
            oldPrice: 11500,
            purity: "14KT",
            style: "Minimal",
            occasion: "Daily Wear",
            design: "Contemporary",
            size: "Small",
            gem: "Diamond",
            gender: "Women",
            image: "assets/images/earrings1.png"
        },

        {
            id: 8,
            name: "Bridal Ruby Ring",
            description: "Ruby Floral Ring",
            category: "Ring",
            price: 16500,
            oldPrice: 19000,
            purity: "18KT",
            style: "Bridal",
            occasion: "Wedding",
            design: "Floral",
            size: "Medium",
            gem: "Ruby",
            gender: "Women",
            image: "assets/images/ring3.png"
        },

        {
            id: 9,
            name: "Platinum Classic Ring",
            description: "Premium Platinum Ring",
            category: "Ring",
            price: 19500,
            oldPrice: 22000,
            purity: "Platinum",
            style: "Classic",
            occasion: "Engagement",
            design: "Geometric",
            size: "Medium",
            gem: "Diamond",
            gender: "Women",
            image: "assets/images/ring4.png"
        },

        {
            id: 10,
            name: "Pearl Diamond Earrings",
            description: "Elegant Pearl Earrings",
            category: "Earring",
            price: 7200,
            oldPrice: 8500,
            purity: "14KT",
            style: "Classic",
            occasion: "Party",
            design: "Floral",
            size: "Small",
            gem: "Pearl",
            gender: "Women",
            image: "assets/images/earrings2.png"
        },

        {
            id: 11,
            name: "Modern Diamond Bracelet",
            description: "Contemporary Bracelet",
            category: "Bracelet",
            price: 14300,
            oldPrice: 16500,
            purity: "18KT",
            style: "Modern",
            occasion: "Party",
            design: "Contemporary",
            size: "Medium",
            gem: "Diamond",
            gender: "Unisex",
            image: "assets/images/bracelet2.jpeg"
        },

        {
            id: 12,
            name: "Traditional Gold Bangle",
            description: "Classic Traditional Bangle",
            category: "Bangle",
            price: 19800,
            oldPrice: 23000,
            purity: "22KT",
            style: "Traditional",
            occasion: "Festive",
            design: "Traditional",
            size: "Large",
            gem: "Ruby",
            gender: "Women",
            image: "assets/images/bangle2.png"
        },

        {
            id: 13,
            name: "Diamond Mangalsutra",
            description: "Elegant Mangalsutra Design",
            category: "Mangalsutra",
            price: 17200,
            oldPrice: 20000,
            purity: "18KT",
            style: "Modern",
            occasion: "Wedding",
            design: "Contemporary",
            size: "Medium",
            gem: "Diamond",
            gender: "Women",
            image: "assets/images/necklace4.png"
        },

        {
            id: 14,
            name: "Minimal Gold Ring",
            description: "Simple Everyday Ring",
            category: "Ring",
            price: 10500,
            oldPrice: 12500,
            purity: "9KT",
            style: "Minimal",
            occasion: "Daily Wear",
            design: "Contemporary",
            size: "Small",
            gem: "Diamond",
            gender: "Unisex",
            image: "assets/images/ring5.png"
        },

        {
            id: 15,
            name: "Sapphire Gold Necklace",
            description: "Blue Sapphire Necklace",
            category: "Necklace",
            price: 20500,
            oldPrice: 24000,
            purity: "18KT",
            style: "Statement",
            occasion: "Party",
            design: "Contemporary",
            size: "Large",
            gem: "Sapphire",
            gender: "Women",
            image: "assets/images/necklace5.png"
        },

        {
            id: 16,
            name: "Classic Gold Bracelet",
            description: "Everyday Gold Bracelet",
            category: "Bracelet",
            price: 11200,
            oldPrice: 13500,
            purity: "14KT",
            style: "Classic",
            occasion: "Daily Wear",
            design: "Traditional",
            size: "Medium",
            gem: "Diamond",
            gender: "Unisex",
            image: "assets/images/bracelet4.png"
        }

    ];


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const productGrid =
        document.getElementById("productGrid");

    const productCount =
        document.getElementById("productCount");

    const noProducts =
        document.getElementById("noProducts");

    const filterSidebar =
        document.getElementById("filterSidebar");

    const filterOverlay =
        document.getElementById("filterOverlay");

    const openFilterButton =
        document.getElementById("openFilterButton");

    const closeFilterButton =
        document.getElementById("closeFilterButton");

    const applyFilters =
        document.getElementById("applyFilters");

    const resetFilters =
        document.getElementById("resetFilters");

    const sortProducts =
        document.getElementById("sortProducts");

    const searchInput =
        document.getElementById("searchInput");


    /* =====================================================
       DISPLAY PRODUCTS
       ===================================================== */

    function displayProducts(productList) {

        /*
         * IMPORTANT:
         * Clear the old products before displaying
         * the filtered/sorted products.
         */

        productGrid.innerHTML = "";


        if (productCount) {

            productCount.textContent =
                productList.length + " Products";

        }


        if (productList.length === 0) {

            noProducts.style.display = "block";

            return;

        }


        noProducts.style.display = "none";


        productList.forEach(function (product) {

            const card =
                document.createElement("article");

            card.className = "product-card";

            /*
             * Make the entire product card clickable.
             */

            card.dataset.productId = product.id;


            card.innerHTML = `

                <div class="product-image-box">

                    <button
                        class="product-wishlist"
                        type="button"
                        data-id="${product.id}"
                    >
                        ♡
                    </button>

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-info">

                    <h2 class="product-name">
                        ${product.name}
                    </h2>

                    <p class="product-description">
                        ${product.description}
                    </p>

                    <div class="product-price">

                        <span class="current-price">
                            ₹${product.price.toLocaleString("en-IN")}
                        </span>

                        <span class="old-price">
                            ₹${product.oldPrice.toLocaleString("en-IN")}
                        </span>

                    </div>

                    <p class="product-offer">
                        Special Offer Available
                    </p>


                    <button
                        type="button"
                        class="add-to-cart-button"
                        data-id="${product.id}"
                    >
                        ADD TO CART
                    </button>

                </div>

            `;


            /* =================================================
               CLICK PRODUCT CARD
               ================================================= */

            card.addEventListener(
                "click",
                function (event) {

                    /*
                     * Do not open the product details page
                     * when clicking Wishlist or Add to Cart.
                     */

                    if (
                        event.target.closest(".product-wishlist") ||
                        event.target.closest(".add-to-cart-button")
                    ) {

                        return;

                    }


                    /*
                     * Open product details page.
                     */

                    window.location.href =
                        "product-details.html?id=" +
                        product.id;

                }
            );


            productGrid.appendChild(card);

        });


        addWishlistEvents();

        addCartEvents();

    }


    /* =====================================================
       WISHLIST
       ===================================================== */

    function getFavorites() {

        const savedFavorites =
            localStorage.getItem("luxeoFavorites");


        if (!savedFavorites) {

            return [];

        }


        try {

            return JSON.parse(savedFavorites);

        } catch (error) {

            return [];

        }

    }


    function saveFavorites(favorites) {

        localStorage.setItem(
            "luxeoFavorites",
            JSON.stringify(favorites)
        );

    }


    function toggleWishlist(productId) {

        let favorites =
            getFavorites();


        const product =
            products.find(function (item) {

                return item.id === productId;

            });


        if (!product) {

            return;

        }


        const existingIndex =
            favorites.findIndex(function (item) {

                return item.id === productId;

            });


        if (existingIndex !== -1) {

            /*
             * Remove from wishlist
             */

            favorites.splice(
                existingIndex,
                1
            );

        } else {

            /*
             * Add to wishlist
             */

            favorites.push(product);

        }


        saveFavorites(favorites);

    }


    function addWishlistEvents() {

        const wishlistButtons =
            document.querySelectorAll(
                ".product-wishlist"
            );


        const favorites =
            getFavorites();


        wishlistButtons.forEach(function (button) {

            const productId =
                Number(button.dataset.id);


            /*
             * Show saved wishlist state
             */

            const alreadyFavorite =
                favorites.some(function (item) {

                    return item.id === productId;

                });


            if (alreadyFavorite) {

                button.textContent = "♥";

            }


            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    toggleWishlist(productId);


                    /*
                     * Change heart appearance
                     */

                    if (
                        button.textContent.trim() === "♡"
                    ) {

                        button.textContent = "♥";

                    } else {

                        button.textContent = "♡";

                    }

                }
            );

        });

    }


    /* =====================================================
       CART
       ===================================================== */

    function getCart() {

        const savedCart =
            localStorage.getItem("luxeoCart");


        if (!savedCart) {

            return [];

        }


        try {

            return JSON.parse(savedCart);

        } catch (error) {

            return [];

        }

    }


    function saveCart(cart) {

        localStorage.setItem(
            "luxeoCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       ADD PRODUCT TO CART
       ===================================================== */

    function addToCart(productId) {

        const product =
            products.find(function (item) {

                return item.id === productId;

            });


        if (!product) {

            return;

        }


        const cart =
            getCart();


        const existingProduct =
            cart.find(function (item) {

                return item.id === productId;

            });


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

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


        alert(
            product.name +
            " has been added to your cart."
        );

    }


    /* =====================================================
       ADD CART EVENTS
       ===================================================== */

    function addCartEvents() {

        const cartButtons =
            document.querySelectorAll(
                ".add-to-cart-button"
            );


        cartButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    /*
                     * Stop the click from reaching
                     * the product card.
                     */

                    event.stopPropagation();


                    const productId =
                        Number(button.dataset.id);


                    addToCart(productId);

                }
            );

        });

    }


    /* =====================================================
       GET CHECKED VALUES
       ===================================================== */

    function getCheckedValues(name) {

        const checked =
            document.querySelectorAll(
                `input[name="${name}"]:checked`
            );


        return Array.from(checked).map(
            function (checkbox) {

                return checkbox.value;

            }
        );

    }


    /* =====================================================
       FILTER PRODUCTS
       ===================================================== */

    function filterProducts() {

        const categories =
            getCheckedValues("category");

        const purities =
            getCheckedValues("purity");

        const styles =
            getCheckedValues("style");

        const occasions =
            getCheckedValues("occasion");

        const designs =
            getCheckedValues("design");

        const sizes =
            getCheckedValues("size");

        const gems =
            getCheckedValues("gem");

        const genders =
            getCheckedValues("gender");


        const minPriceElement =
            document.getElementById("minPrice");

        const maxPriceElement =
            document.getElementById("maxPrice");


        const minimumPrice =
            minPriceElement
                ? Number(minPriceElement.value) || 0
                : 0;


        const maximumPrice =
            maxPriceElement
                ? Number(maxPriceElement.value) || Infinity
                : Infinity;


        const searchValue =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";


        const filteredProducts =
            products.filter(function (product) {


                /* =========================================
                   CURRENT PAGE CATEGORY
                   ========================================= */

                if (
                    pageCategory &&
                    product.category !== pageCategory
                ) {

                    return false;

                }


                /* =========================================
                   CATEGORY FILTER
                   ========================================= */

                if (
                    categories.length > 0 &&
                    !categories.includes(product.category)
                ) {

                    return false;

                }


                /* =========================================
                   PURITY
                   ========================================= */

                if (
                    purities.length > 0 &&
                    !purities.includes(product.purity)
                ) {

                    return false;

                }


                /* =========================================
                   STYLE
                   ========================================= */

                if (
                    styles.length > 0 &&
                    !styles.includes(product.style)
                ) {

                    return false;

                }


                /* =========================================
                   OCCASION
                   ========================================= */

                if (
                    occasions.length > 0 &&
                    !occasions.includes(product.occasion)
                ) {

                    return false;

                }


                /* =========================================
                   DESIGN
                   ========================================= */

                if (
                    designs.length > 0 &&
                    !designs.includes(product.design)
                ) {

                    return false;

                }


                /* =========================================
                   SIZE
                   ========================================= */

                if (
                    sizes.length > 0 &&
                    !sizes.includes(product.size)
                ) {

                    return false;

                }


                /* =========================================
                   GEM
                   ========================================= */

                if (
                    gems.length > 0 &&
                    !gems.includes(product.gem)
                ) {

                    return false;

                }


                /* =========================================
                   GENDER
                   ========================================= */

                if (
                    genders.length > 0 &&
                    !genders.includes(product.gender)
                ) {

                    return false;

                }


                /* =========================================
                   PRICE
                   ========================================= */

                if (
                    product.price < minimumPrice ||
                    product.price > maximumPrice
                ) {

                    return false;

                }


                /* =========================================
                   SEARCH
                   ========================================= */

                if (searchValue !== "") {

                    const searchableText =
                        (
                            product.name +
                            " " +
                            product.description +
                            " " +
                            product.category +
                            " " +
                            product.gem
                        ).toLowerCase();


                    if (
                        !searchableText.includes(
                            searchValue
                        )
                    ) {

                        return false;

                    }

                }


                return true;

            });


        displayProducts(filteredProducts);

    }


    /* =====================================================
       FILTER SIDEBAR OPEN
       ===================================================== */

    if (openFilterButton) {

        openFilterButton.addEventListener(
            "click",
            function () {

                filterSidebar.classList.add("active");

                filterOverlay.classList.add("active");

                document.body.style.overflow =
                    "hidden";

            }
        );

    }


    /* =====================================================
       FILTER SIDEBAR CLOSE
       ===================================================== */

    function closeFilter() {

        if (filterSidebar) {

            filterSidebar.classList.remove(
                "active"
            );

        }


        if (filterOverlay) {

            filterOverlay.classList.remove(
                "active"
            );

        }


        document.body.style.overflow = "";

    }


    if (closeFilterButton) {

        closeFilterButton.addEventListener(
            "click",
            closeFilter
        );

    }


    if (filterOverlay) {

        filterOverlay.addEventListener(
            "click",
            closeFilter
        );

    }


    /* =====================================================
       APPLY FILTERS
       ===================================================== */

    if (applyFilters) {

        applyFilters.addEventListener(
            "click",
            function () {

                filterProducts();

                closeFilter();

            }
        );

    }


    /* =====================================================
       RESET FILTERS
       ===================================================== */

    if (resetFilters) {

        resetFilters.addEventListener(
            "click",
            function () {


                document
                    .querySelectorAll(
                        '.filter-sidebar input[type="checkbox"]'
                    )
                    .forEach(function (checkbox) {

                        checkbox.checked = false;

                    });


                const minPrice =
                    document.getElementById(
                        "minPrice"
                    );


                const maxPrice =
                    document.getElementById(
                        "maxPrice"
                    );


                if (minPrice) {

                    minPrice.value = "";

                }


                if (maxPrice) {

                    maxPrice.value = "";

                }


                if (searchInput) {

                    searchInput.value = "";

                }


                filterProducts();

            }
        );

    }


    /* =====================================================
       SORT PRODUCTS
       ===================================================== */

    if (sortProducts) {

        sortProducts.addEventListener(
            "change",
            function () {

                const selectedSort =
                    sortProducts.value;


                let sortedProducts =
                    [...products];


                if (selectedSort === "low") {

                    sortedProducts.sort(
                        function (a, b) {

                            return a.price - b.price;

                        }
                    );

                }


                if (selectedSort === "high") {

                    sortedProducts.sort(
                        function (a, b) {

                            return b.price - a.price;

                        }
                    );

                }


                if (selectedSort === "name") {

                    sortedProducts.sort(
                        function (a, b) {

                            return a.name.localeCompare(
                                b.name
                            );

                        }
                    );

                }


                if (selectedSort === "default") {

                    sortedProducts =
                        [...products];

                }


                /*
                 * Keep current category restriction
                 */

                if (pageCategory) {

                    sortedProducts =
                        sortedProducts.filter(
                            function (product) {

                                return (
                                    product.category ===
                                    pageCategory
                                );

                            }
                        );

                }


                displayProducts(
                    sortedProducts
                );

            }
        );

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                filterProducts();

            }
        );

    }


    /* =====================================================
       CATEGORY FROM URL
       ===================================================== */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const selectedCategory =
        urlParams.get("category");


    if (selectedCategory) {

        const categoryCheckbox =
            document.querySelector(
                `input[name="category"][value="${selectedCategory}"]`
            );


        if (categoryCheckbox) {

            categoryCheckbox.checked = true;

        }


        const collectionTitle =
            document.getElementById(
                "collectionTitle"
            );


        if (collectionTitle) {

            collectionTitle.textContent =
                selectedCategory +
                " Collection";

        }

    }


    /* =====================================================
       FILTER ACCORDIONS
       ===================================================== */

    const filterTitles =
        document.querySelectorAll(
            ".filter-title"
        );


    filterTitles.forEach(function (title) {

        title.addEventListener(
            "click",
            function () {

                const options =
                    title.nextElementSibling;


                const arrow =
                    title.querySelector(
                        "span:last-child"
                    );


                if (
                    options.style.display === "none"
                ) {

                    options.style.display =
                        "flex";

                    if (arrow) {

                        arrow.textContent = "⌃";

                    }

                } else {

                    options.style.display =
                        "none";

                    if (arrow) {

                        arrow.textContent = "⌄";

                    }

                }

            }
        );

    });


    /* =====================================================
       INITIAL DISPLAY
       ===================================================== */

    if (pageCategory) {

        const categoryProducts =
            products.filter(
                function (product) {

                    return (
                        product.category ===
                        pageCategory
                    );

                }
            );


        displayProducts(
            categoryProducts
        );

    } else {

        displayProducts(products);

    }

});