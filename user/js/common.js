document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    function performSearch() {

        if (!searchInput) {
            console.log("Search input not found.");
            return;
        }

        const searchValue = searchInput.value.trim().toLowerCase();

        console.log("Searching for:", searchValue);

        if (searchValue === "") {
            alert("Please enter something to search.");
            searchInput.focus();
            return;
        }
        function openProduct(productId) {

    window.location.href =
        "product-details.html?id=" +
        encodeURIComponent(productId);

}


        /* =====================================================
           RINGS
           ===================================================== */

        if (
            searchValue.includes("ring")
        ) {
            window.location.href = "rings.html";
            return;
        }


        /* =====================================================
           NECKLACES
           ===================================================== */

        if (
            searchValue.includes("necklace")
        ) {
            window.location.href = "necklaces.html";
            return;
        }


        /* =====================================================
           BRACELETS
           ===================================================== */

        if (
            searchValue.includes("bracelet")
        ) {
            window.location.href = "bracelets.html";
            return;
        }


        /* =====================================================
           EARRINGS
           ===================================================== */

        if (
            searchValue.includes("earring")
        ) {
            window.location.href = "earrings.html";
            return;
        }


        /* =====================================================
           BANGLES
           ===================================================== */

        if (
            searchValue.includes("bangle")
        ) {
            window.location.href = "bangles.html";
            return;
        }


        /* =====================================================
           ALL JEWELLERY
           ===================================================== */

        if (
            searchValue.includes("jewellery") ||
            searchValue.includes("jewelry")
        ) {
            window.location.href = "collections.html";
            return;
        }


        /* =====================================================
           NO RESULT
           ===================================================== */

        alert("No jewellery found for \"" + searchInput.value + "\".");

    }


    /* SEARCH BUTTON */

    if (searchButton) {

        searchButton.addEventListener("click", function () {
            performSearch();
        });

    }


    /* ENTER KEY */

    if (searchInput) {

        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                performSearch();
            }

        });

    }

});