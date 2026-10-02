document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       PRODUCT DATABASE

       EVERY PRODUCT MUST HAVE A UNIQUE ID
       ===================================================== */

    const products = {


        /* =================================================
           NECKLACES
           ================================================= */

        "diamond-necklace": {

            name: "Diamond Necklace",

            type: "NECKLACE",

            price: "₹56,790",

            rating: "4.9",

            image: "assets/images/diamond-necklace.jpg",

            description:
                "A beautifully crafted diamond necklace designed with an elegant finish for special occasions.",

            height: "18 mm",

            width: "8 mm",

            weight: "12.5 g",

            size: "Adjustable",

            material: "Diamond",

            metal: "Gold",

            purity: "18 KT",

            occasion: "Party & Occasion",

            recommendations: [
                "crystal-ring",
                "diamond-bracelet",
                "classic-bangle"
            ]

        },


        "crystal-necklace": {

            name: "Crystal Necklace",

            type: "NECKLACE",

            price: "₹4,500",

            rating: "4.8",

            image: "assets/images/necklace1.jpg",

            description:
                "An elegant crystal necklace designed to add sparkle and sophistication to your look.",

            height: "20 mm",

            width: "10 mm",

            weight: "10 g",

            size: "Adjustable",

            material: "Crystal",

            metal: "Gold",

            purity: "18 KT",

            occasion: "Party & Everyday",

            recommendations: [
                "diamond-necklace",
                "crystal-ring",
                "diamond-bracelet"
            ]

        },


        /* =================================================
           RINGS
           ================================================= */

        "crystal-ring": {

            name: "Crystal Ring",

            type: "RING",

            price: "₹3,400",

            rating: "4.8",

            image: "assets/images/crystal-ring.jpg",

            description:
                "A beautiful crystal ring featuring an elegant design suitable for everyday wear and special occasions.",

            height: "7 mm",

            width: "5 mm",

            weight: "4.5 g",

            size: "Adjustable",

            material: "Crystal",

            metal: "Gold",

            purity: "18 KT",

            occasion: "Party & Everyday",

            recommendations: [
                "diamond-necklace",
                "diamond-bracelet",
                "classic-bangle"
            ]

        },


        "royal-diamond-ring": {

            name: "Royal Diamond Ring",

            type: "RING",

            price: "₹5,200",

            rating: "4.9",

            image: "assets/images/ring2.png",

            description:
                "A timeless royal diamond ring featuring an elegant design crafted for a sophisticated look.",

            height: "7 mm",

            width: "5 mm",

            weight: "4.8 g",

            size: "Adjustable",

            material: "Diamond",

            metal: "Gold",

            purity: "18 KT",

            occasion: "Engagement & Party",

            recommendations: [
                "diamond-necklace",
                "crystal-necklace",
                "diamond-bracelet"
            ]

        },


        /* =================================================
           BRACELETS
           ================================================= */

        "diamond-bracelet": {

            name: "Diamond Bracelet",

            type: "BRACELET",

            price: "₹8,500",

            rating: "4.8",

            image: "assets/images/diamond-bracelet.jpg",

            description:
                "A sophisticated diamond bracelet designed with a graceful finish for both everyday and special occasions.",

            height: "10 mm",

            width: "6 mm",

            weight: "8.2 g",

            size: "Adjustable",

            material: "Diamond",

            metal: "Gold",

            purity: "18 KT",

            occasion: "Everyday & Party",

            recommendations: [
                "diamond-necklace",
                "crystal-ring",
                "classic-bangle"
            ]

        },


        "crystal-bracelet": {

            name: "Crystal Bracelet",

            type: "BRACELET",

            price: "₹2,800",

            rating: "4.7",

            image: "assets/images/bracelet.png",

            description:
                "A delicate crystal bracelet that combines elegance and simplicity for everyday and special occasions.",

            height: "10 mm",

            width: "6 mm",

            weight: "8.2 g",

            size: "Adjustable",

            material: "Crystal",

            metal: "Gold",

            purity: "18 KT",

            occasion: "Everyday & Party",

            recommendations: [
                "diamond-necklace",
                "crystal-ring",
                "classic-bangle"
            ]

        },


        /* =================================================
           BANGLES
           ================================================= */

        "classic-bangle": {

            name: "Classic Gold Bangle",

            type: "BANGLE",

            price: "₹4,500",

            rating: "4.6",

            image: "assets/images/bangle.png",

            description:
                "A classic bangle designed with a graceful finish that complements both traditional and modern outfits.",

            height: "8 mm",

            width: "8 mm",

            weight: "15 g",

            size: "2.4",

            material: "Gold",

            metal: "Gold",

            purity: "18 KT",

            occasion: "Traditional & Party",

            recommendations: [
                "diamond-necklace",
                "crystal-ring",
                "diamond-bracelet"
            ]

        }

    };


    /* =====================================================
       GET PRODUCT ID FROM URL
       ===================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);


    const productId =
        urlParams.get("id");


    console.log("Product ID:", productId);


    /* =====================================================
       DO NOT USE A DEFAULT PRODUCT
       ===================================================== */

    if (!productId) {

        showProductError(
            "No product was selected."
        );

        return;

    }


    /* =====================================================
       FIND THE EXACT PRODUCT
       ===================================================== */

    const product =
        products[productId];


    console.log("Selected Product:", product);


    /* =====================================================
       PRODUCT NOT FOUND
       ===================================================== */

    if (!product) {

        showProductError(
            "The selected product could not be found."
        );

        return;

    }


    /* =====================================================
       DISPLAY PRODUCT IMAGE
       ===================================================== */

    const productImage =
        document.getElementById("productImage");


    productImage.src =
        product.image;


    productImage.alt =
        product.name;


    /* =====================================================
       DISPLAY BASIC PRODUCT INFORMATION
       ===================================================== */

    document.getElementById(
        "productName"
    ).textContent =
        product.name;


    document.getElementById(
        "productType"
    ).textContent =
        product.type;


    document.getElementById(
        "productPrice"
    ).textContent =
        product.price;


    document.getElementById(
        "productRating"
    ).textContent =
        product.rating;


    document.getElementById(
        "productDescription"
    ).textContent =
        product.description;


    /* =====================================================
       DISPLAY SPECIFICATIONS
       ===================================================== */

    document.getElementById(
        "productHeight"
    ).textContent =
        product.height;


    document.getElementById(
        "productWidth"
    ).textContent =
        product.width;


    document.getElementById(
        "productWeight"
    ).textContent =
        product.weight;


    document.getElementById(
        "productSize"
    ).textContent =
        product.size;


    document.getElementById(
        "productMaterial"
    ).textContent =
        product.material;


    document.getElementById(
        "productMetal"
    ).textContent =
        product.metal;


    document.getElementById(
        "productPurity"
    ).textContent =
        product.purity;


    document.getElementById(
        "productOccasion"
    ).textContent =
        product.occasion;


    /* =====================================================
       QUANTITY
       ===================================================== */

    let quantity = 1;


    const quantityValue =
        document.getElementById(
            "quantityValue"
        );


    document
        .getElementById("increaseQuantity")
        .addEventListener(
            "click",
            function () {

                quantity++;

                quantityValue.textContent =
                    quantity;

            }
        );


    document
        .getElementById("decreaseQuantity")
        .addEventListener(
            "click",
            function () {

                if (quantity > 1) {

                    quantity--;

                    quantityValue.textContent =
                        quantity;

                }

            }
        );


    /* =====================================================
       ADD TO CART
       ===================================================== */

    document
        .getElementById("addToCartButton")
        .addEventListener(
            "click",
            function () {

                const cartItem = {

                    id: productId,

                    name: product.name,

                    type: product.type,

                    price: product.price,

                    image: product.image,

                    quantity: quantity

                };


                let cart =
                    JSON.parse(
                        localStorage.getItem(
                            "cart"
                        )
                    ) || [];


                const existingProduct =
                    cart.find(
                        item =>
                            item.id === productId
                    );


                if (existingProduct) {

                    existingProduct.quantity +=
                        quantity;

                } else {

                    cart.push(cartItem);

                }


                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                );


                alert(
                    product.name +
                    " added to cart!"
                );

            }
        );


    /* =====================================================
       WISHLIST
       ===================================================== */

    document
        .getElementById("addToWishlistButton")
        .addEventListener(
            "click",
            function () {

                let wishlist =
                    JSON.parse(
                        localStorage.getItem(
                            "wishlist"
                        )
                    ) || [];


                const exists =
                    wishlist.some(
                        item =>
                            item.id === productId
                    );


                if (!exists) {

                    wishlist.push({

                        id: productId,

                        name: product.name,

                        type: product.type,

                        price: product.price,

                        image: product.image

                    });


                    localStorage.setItem(
                        "wishlist",
                        JSON.stringify(wishlist)
                    );


                    alert(
                        product.name +
                        " added to wishlist!"
                    );

                } else {

                    alert(
                        "Product is already in your wishlist."
                    );

                }

            }
        );


    /* =====================================================
       RECOMMENDED PRODUCTS
       ===================================================== */

    const recommendationsContainer =
        document.getElementById(
            "recommendationsContainer"
        );


    recommendationsContainer.innerHTML =
        "";


    product.recommendations.forEach(
        function (recommendationId) {


            const recommendation =
                products[recommendationId];


            if (!recommendation) {

                return;

            }


            const card =
                document.createElement("div");


            card.className =
                "recommendation-card";


            card.innerHTML = `

                <div class="recommendation-image">

                    <img
                        src="${recommendation.image}"
                        alt="${recommendation.name}"
                    >

                </div>


                <div class="recommendation-info">

                    <h3>
                        ${recommendation.name}
                    </h3>

                    <p>
                        ${recommendation.price}
                    </p>

                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "product-details.html?id=" +
                        recommendationId;

                }
            );


            recommendationsContainer.appendChild(
                card
            );

        }
    );


});


/* =========================================================
   PRODUCT ERROR
   ========================================================= */

function showProductError(message) {

    document.getElementById(
        "productName"
    ).textContent =
        "Product Not Found";


    document.getElementById(
        "productType"
    ).textContent =
        "JEWELLERY";


    document.getElementById(
        "productPrice"
    ).textContent =
        "—";


    document.getElementById(
        "productDescription"
    ).textContent =
        message;


    document.getElementById(
        "productImage"
    ).style.display =
        "none";


    document.getElementById(
        "productHeight"
    ).textContent =
        "—";


    document.getElementById(
        "productWidth"
    ).textContent =
        "—";


    document.getElementById(
        "productWeight"
    ).textContent =
        "—";


    document.getElementById(
        "productSize"
    ).textContent =
        "—";


    document.getElementById(
        "productMaterial"
    ).textContent =
        "—";


    document.getElementById(
        "productMetal"
    ).textContent =
        "—";


    document.getElementById(
        "productPurity"
    ).textContent =
        "—";


    document.getElementById(
        "productOccasion"
    ).textContent =
        "—";

}