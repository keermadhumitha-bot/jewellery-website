/* =========================================================
   LUXÉORA PRODUCT DETAILS PAGE

   Opened from any product card as:
       product-details.html?id=<number 1-16>

   The product list below is a copy of the one in collections.js
   (same IDs, names, prices, images). If you change a product
   there, change it here and in backend/server.js too.

   Cart and wishlist use the same storage as collections.js:
       luxeoCart       -> [{ id, name, description, category,
                             price, oldPrice, image, quantity }]
       luxeoFavorites  -> [ full product object, ... ]
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const CART_KEY = "luxeoCart";
    const FAVORITES_KEY = "luxeoFavorites";
    const MAX_QUANTITY = 20;

    /* =====================================================
       PRODUCT DATA  (copied from collections.js)
       ===================================================== */

    const products = [
        { id: 1,  name: "Diamond Crystal Necklace", description: "Elegant Diamond Necklace",    category: "Necklace",    price: 3450,  oldPrice: 4200,  purity: "18KT",     style: "Classic",     occasion: "Wedding",    design: "Floral",       size: "Medium", gem: "Diamond",  gender: "Women",  image: "assets/images/necklace1.jpg" },
        { id: 2,  name: "Royal Diamond Ring",       description: "Elegant Statement Ring",      category: "Ring",        price: 5200,  oldPrice: 6500,  purity: "18KT",     style: "Statement",   occasion: "Engagement", design: "Geometric",    size: "Medium", gem: "Diamond",  gender: "Women",  image: "assets/images/ring2.jpeg" },
        { id: 3,  name: "Diamond Crystal Bracelet", description: "Delicate Diamond Bracelet",   category: "Bracelet",    price: 2800,  oldPrice: 3500,  purity: "14KT",     style: "Minimal",     occasion: "Daily Wear", design: "Geometric",    size: "Medium", gem: "Diamond",  gender: "Women",  image: "assets/images/bracelet1.png" },
        { id: 4,  name: "Classic Gold Ring",        description: "Timeless Gold Ring",          category: "Ring",        price: 12500, oldPrice: 15000, purity: "18KT",     style: "Classic",     occasion: "Wedding",    design: "Traditional",  size: "Medium", gem: "Diamond",  gender: "Women",  image: "assets/images/ring1.jpeg" },
        { id: 5,  name: "Elegant Gold Necklace",    description: "Traditional Gold Necklace",   category: "Necklace",    price: 18900, oldPrice: 22000, purity: "22KT",     style: "Traditional", occasion: "Festive",    design: "Floral",       size: "Large",  gem: "Ruby",     gender: "Women",  image: "assets/images/necklace2.png" },
        { id: 6,  name: "Diamond Bangle",           description: "Modern Diamond Bangle",       category: "Bangle",      price: 15700, oldPrice: 18500, purity: "18KT",     style: "Modern",      occasion: "Party",      design: "Geometric",    size: "Large",  gem: "Diamond",  gender: "Women",  image: "assets/images/bangle1.jpeg" },
        { id: 7,  name: "Elegant Earrings",         description: "Beautiful Diamond Earrings",  category: "Earring",     price: 9800,  oldPrice: 11500, purity: "14KT",     style: "Minimal",     occasion: "Daily Wear", design: "Contemporary", size: "Small",  gem: "Diamond",  gender: "Women",  image: "assets/images/earrings1.png" },
        { id: 8,  name: "Bridal Ruby Ring",         description: "Ruby Floral Ring",            category: "Ring",        price: 16500, oldPrice: 19000, purity: "18KT",     style: "Bridal",      occasion: "Wedding",    design: "Floral",       size: "Medium", gem: "Ruby",     gender: "Women",  image: "assets/images/ring3.png" },
        { id: 9,  name: "Platinum Classic Ring",    description: "Premium Platinum Ring",       category: "Ring",        price: 19500, oldPrice: 22000, purity: "Platinum", style: "Classic",     occasion: "Engagement", design: "Geometric",    size: "Medium", gem: "Diamond",  gender: "Women",  image: "assets/images/ring4.png" },
        { id: 10, name: "Pearl Diamond Earrings",   description: "Elegant Pearl Earrings",      category: "Earring",     price: 7200,  oldPrice: 8500,  purity: "14KT",     style: "Classic",     occasion: "Party",      design: "Floral",       size: "Small",  gem: "Pearl",    gender: "Women",  image: "assets/images/earrings2.png" },
        { id: 11, name: "Modern Diamond Bracelet",  description: "Contemporary Bracelet",       category: "Bracelet",    price: 14300, oldPrice: 16500, purity: "18KT",     style: "Modern",      occasion: "Party",      design: "Contemporary", size: "Medium", gem: "Diamond",  gender: "Unisex", image: "assets/images/bracelet2.jpeg" },
        { id: 12, name: "Traditional Gold Bangle",  description: "Classic Traditional Bangle",  category: "Bangle",      price: 19800, oldPrice: 23000, purity: "22KT",     style: "Traditional", occasion: "Festive",    design: "Traditional",  size: "Large",  gem: "Ruby",     gender: "Women",  image: "assets/images/bangle2.png" },
        { id: 13, name: "Diamond Mangalsutra",      description: "Elegant Mangalsutra Design",  category: "Mangalsutra", price: 17200, oldPrice: 20000, purity: "18KT",     style: "Modern",      occasion: "Wedding",    design: "Contemporary", size: "Medium", gem: "Diamond",  gender: "Women",  image: "assets/images/necklace4.png" },
        { id: 14, name: "Minimal Gold Ring",        description: "Simple Everyday Ring",        category: "Ring",        price: 10500, oldPrice: 12500, purity: "9KT",      style: "Minimal",     occasion: "Daily Wear", design: "Contemporary", size: "Small",  gem: "Diamond",  gender: "Unisex", image: "assets/images/ring5.png" },
        { id: 15, name: "Sapphire Gold Necklace",   description: "Blue Sapphire Necklace",      category: "Necklace",    price: 20500, oldPrice: 24000, purity: "18KT",     style: "Statement",   occasion: "Party",      design: "Contemporary", size: "Large",  gem: "Sapphire", gender: "Women",  image: "assets/images/necklace5.png" },
        { id: 16, name: "Classic Gold Bracelet",    description: "Everyday Gold Bracelet",      category: "Bracelet",    price: 11200, oldPrice: 13500, purity: "14KT",     style: "Classic",     occasion: "Daily Wear", design: "Traditional",  size: "Medium", gem: "Diamond",  gender: "Unisex", image: "assets/images/bracelet4.png" }
    ];

    /* =====================================================
       HELPERS
       ===================================================== */

    function byId(id) {
        return document.getElementById(id);
    }

    function formatINR(amount) {
        return "₹" + Number(amount).toLocaleString("en-IN");
    }

    function readArray(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function saveArray(key, array) {
        try {
            localStorage.setItem(key, JSON.stringify(array));
            return true;
        } catch (error) {
            alert("Sorry, this browser could not save your change.");
            return false;
        }
    }

    function setText(id, value) {
        byId(id).textContent = value || "—";
    }

    /* =====================================================
       FIND THE PRODUCT FROM THE URL
       ===================================================== */

    const rawId = new URLSearchParams(window.location.search).get("id");

    if (!rawId) {
        showProductError("No product was selected. Please choose a piece from our collection.");
        return;
    }

    const productId = /^\d+$/.test(rawId) ? Number(rawId) : NaN;
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        showProductError("The selected product could not be found.");
        return;
    }

    /* =====================================================
       DISPLAY THE PRODUCT
       ===================================================== */

    document.title = product.name + " | Luxéora";

    const productImage = byId("productImage");

    productImage.src = product.image;
    productImage.alt = product.name;

    productImage.addEventListener("error", function () {
        const box = byId("productImageBox");
        box.classList.add("image-error");
        box.innerHTML = "";

        const message = document.createElement("div");
        message.className = "image-error-message";

        const title = document.createElement("span");
        title.textContent = product.name;

        const note = document.createElement("small");
        note.textContent = "Image unavailable";

        message.append(title, note);
        box.appendChild(message);
    });

    setText("productType", product.category.toUpperCase());
    setText("productName", product.name);
    setText("productPrice", formatINR(product.price));
    setText("productOldPrice", product.oldPrice > product.price ? formatINR(product.oldPrice) : "");

    // Built only from the product's own fields: nothing is invented.
    byId("productDescription").textContent =
        product.description + ". This " + product.style.toLowerCase() + " " +
        product.category.toLowerCase() + " is crafted in " + product.purity +
        " with " + product.gem.toLowerCase() + ", in a " +
        product.design.toLowerCase() + " design, ideal for " +
        product.occasion.toLowerCase() + ".";

    setText("productCategory", product.category);
    setText("productPurity", product.purity);
    setText("productGem", product.gem);
    setText("productStyle", product.style);
    setText("productDesign", product.design);
    setText("productOccasion", product.occasion);
    setText("productSize", product.size);
    setText("productGender", product.gender);

    /* =====================================================
       QUANTITY
       ===================================================== */

    let quantity = 1;

    const quantityValue = byId("quantityValue");

    byId("increaseQuantity").addEventListener("click", function () {
        if (quantity >= MAX_QUANTITY) {
            alert("You can buy at most " + MAX_QUANTITY + " of one item.");
            return;
        }

        quantity++;
        quantityValue.textContent = quantity;
    });

    byId("decreaseQuantity").addEventListener("click", function () {
        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
        }
    });

    /* =====================================================
       ADD TO CART  (same format as collections.js)
       ===================================================== */

    byId("addToCartButton").addEventListener("click", function () {

        const cart = readArray(CART_KEY);

        const existing = cart.find(function (item) {
            return Number(item.id) === product.id;
        });

        let capped = false;

        if (existing) {
            const total = Number(existing.quantity) + quantity;
            existing.quantity = Math.min(total, MAX_QUANTITY);
            capped = total > MAX_QUANTITY;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                oldPrice: product.oldPrice,
                image: product.image,
                quantity: quantity
            });
        }

        if (!saveArray(CART_KEY, cart)) {
            return;
        }

        alert(
            product.name + " has been added to your cart." +
            (capped ? "\nThe quantity was limited to " + MAX_QUANTITY + "." : "")
        );
    });

    /* =====================================================
       WISHLIST  (same storage as collections.js)
       ===================================================== */

    const wishlistButton = byId("addToWishlistButton");

    function isFavorite() {
        return readArray(FAVORITES_KEY).some(function (item) {
            return Number(item.id) === product.id;
        });
    }

    function updateWishlistButton() {
        const favorite = isFavorite();
        wishlistButton.textContent = favorite ? "♥" : "♡";
        wishlistButton.setAttribute(
            "aria-label",
            favorite ? "Remove from wishlist" : "Add to wishlist"
        );
    }

    wishlistButton.addEventListener("click", function () {

        let favorites = readArray(FAVORITES_KEY);

        if (isFavorite()) {
            favorites = favorites.filter(function (item) {
                return Number(item.id) !== product.id;
            });
        } else {
            favorites.push(product);
        }

        if (saveArray(FAVORITES_KEY, favorites)) {
            updateWishlistButton();
        }
    });

    updateWishlistButton();

    /* =====================================================
       YOU MAY ALSO LIKE
       Same category first, then other products.
       ===================================================== */

    const container = byId("recommendationsContainer");

    const others = products.filter(function (item) {
        return item.id !== product.id;
    });

    const recommendations = others
        .filter(function (item) { return item.category === product.category; })
        .concat(others.filter(function (item) { return item.category !== product.category; }))
        .slice(0, 4);

    container.innerHTML = "";

    recommendations.forEach(function (item) {

        const card = document.createElement("div");
        card.className = "recommendation-card";

        const imageWrap = document.createElement("div");
        imageWrap.className = "recommendation-image";

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        imageWrap.appendChild(img);

        const info = document.createElement("div");
        info.className = "recommendation-info";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatINR(item.price);

        info.append(title, price);
        card.append(imageWrap, info);

        card.addEventListener("click", function () {
            window.location.href = "product-details.html?id=" + item.id;
        });

        container.appendChild(card);
    });

});


/* =========================================================
   PRODUCT ERROR
   ========================================================= */

function showProductError(message) {

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    setText("productType", "JEWELLERY");
    setText("productName", "Product Not Found");
    setText("productPrice", "—");
    setText("productOldPrice", "");
    setText("productDescription", message);

    [
        "productCategory", "productPurity", "productGem", "productStyle",
        "productDesign", "productOccasion", "productSize", "productGender"
    ].forEach(function (id) {
        setText(id, "—");
    });

    const image = document.getElementById("productImage");
    if (image) image.style.display = "none";

    // Nothing to buy, so switch the buttons off.
    ["addToCartButton", "addToWishlistButton", "increaseQuantity", "decreaseQuantity"].forEach(function (id) {
        const button = document.getElementById(id);
        if (button) button.disabled = true;
    });
}