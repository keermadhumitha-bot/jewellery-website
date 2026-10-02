/* ================= HOME PAGE ================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Luxéora Home Page Loaded");


    /* ================= CONTACT FORM ================= */

    const contactForm = document.getElementById("contactForm");


    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const name = document.getElementById("contactName").value.trim();

            const email = document.getElementById("contactEmail").value.trim();

            const subject = document.getElementById("contactSubject").value.trim();

            const message = document.getElementById("contactMessage").value.trim();


            /* ================= CHECK EMPTY FIELDS ================= */

            if (name === "") {

                alert("Please enter your name.");

                document.getElementById("contactName").focus();

                return;
            }


            if (email === "") {

                alert("Please enter your email.");

                document.getElementById("contactEmail").focus();

                return;
            }


            if (subject === "") {

                alert("Please enter the subject.");

                document.getElementById("contactSubject").focus();

                return;
            }


            if (message === "") {

                alert("Please enter your message.");

                document.getElementById("contactMessage").focus();

                return;
            }


            /* ================= EMAIL CHECK ================= */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert("Please enter a valid email address.");

                document.getElementById("contactEmail").focus();

                return;
            }


            /* ================= SUCCESS ================= */

            alert("Your message has been sent successfully!");

            contactForm.reset();

        });

    }
    const productCards = document.querySelectorAll(".product-card");

productCards.forEach(function (card) {

    card.addEventListener("click", function (event) {

        // Don't open product details when ADD button is clicked
        if (event.target.classList.contains("add-cart-btn")) {
            return;
        }

        const productId = card.dataset.productId;

        if (productId) {
            window.location.href =
                "product-details.html?id=" + productId;
        }

    });

});

});