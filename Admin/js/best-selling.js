// =========================================
// HEART BUTTONS
// =========================================

const heartButtons =
    document.querySelectorAll(".heart-btn");


heartButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            button.classList.toggle("active");


            if (
                button.classList.contains("active")
            ) {

                button.textContent = "♥";

            } else {

                button.textContent = "♡";

            }

        }
    );

});



// =========================================
// SEARCH
// =========================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


const productCards =
    document.querySelectorAll(
        ".product-card"
    );


const noResults =
    document.getElementById(
        "noResults"
    );


const productCount =
    document.getElementById(
        "productCount"
    );



if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const searchText =
                searchInput.value
                    .toLowerCase()
                    .trim();


            let visibleProducts = 0;


            productCards.forEach(
                function (card) {

                    const productName =
                        card
                            .querySelector("h3")
                            .textContent
                            .toLowerCase();


                    if (
                        productName.includes(
                            searchText
                        )
                    ) {

                        card.style.display =
                            "block";

                        visibleProducts++;

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );



            // =========================================
            // PRODUCT COUNT
            // =========================================

            if (productCount) {

                productCount.textContent =
                    visibleProducts +
                    (
                        visibleProducts === 1
                            ? " Product"
                            : " Products"
                    );

            }



            // =========================================
            // NO RESULTS
            // =========================================

            if (noResults) {

                if (
                    visibleProducts === 0
                ) {

                    noResults.style.display =
                        "block";

                } else {

                    noResults.style.display =
                        "none";

                }

            }

        }
    );

}