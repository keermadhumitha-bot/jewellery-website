/* =====================================================
   LUXÉORA USER PROFILE

   Changes from your version:
   1. LOGOUT now removes the real login (luxeoCurrentUser)
      and goes to login.html
   2. PREVIOUS ORDERS understands orders saved by checkout
      (they hold an "items" list), and "View all orders"
      now opens orders.html
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const LOGIN_PAGE = "login.html";
    const CURRENT_USER_KEY = "luxeoCurrentUser";


    /* =================================================
       ELEMENTS
    ================================================== */

    const profileForm = document.getElementById("profileForm");
    const addressForm = document.getElementById("addressForm");

    const fullName = document.getElementById("fullName");
    const phoneNumber = document.getElementById("phoneNumber");
    const emailAddress = document.getElementById("emailAddress");
    const aadhaarNumber = document.getElementById("aadhaarNumber");

    const addressLine = document.getElementById("addressLine");
    const city = document.getElementById("city");
    const state = document.getElementById("state");
    const pincode = document.getElementById("pincode");
    const addressType = document.getElementById("addressType");

    const displayName = document.getElementById("displayName");
    const displayEmail = document.getElementById("displayEmail");
    const displayPhone = document.getElementById("displayPhone");
    const profileInitial = document.getElementById("profileInitial");

    const previousOrders = document.getElementById("previousOrders");
    const viewOrdersButton = document.getElementById("viewOrdersButton");

    const editProfileButton = document.getElementById("editProfileButton");
    const addPaymentButton = document.getElementById("addPaymentButton");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const logoutButton = document.getElementById("logoutButton");


    /* =================================================
       LOAD PROFILE DATA
    ================================================== */

    function getProfile() {

        const savedProfile = localStorage.getItem("luxeoProfile");

        if (!savedProfile) {

            return {
                name: "User Name",
                phone: "+91 00000 00000",
                email: "user@example.com",
                aadhaar: ""
            };

        }

        try {

            return JSON.parse(savedProfile);

        } catch (error) {

            return {
                name: "User Name",
                phone: "+91 00000 00000",
                email: "user@example.com",
                aadhaar: ""
            };

        }

    }


    /* =================================================
       SAVE PROFILE DATA
    ================================================== */

    function saveProfile(profile) {

        localStorage.setItem("luxeoProfile", JSON.stringify(profile));

    }


    /* =================================================
       DISPLAY PROFILE
    ================================================== */

    function displayProfile() {

        const profile = getProfile();

        fullName.value = profile.name || "";
        phoneNumber.value = profile.phone || "";
        emailAddress.value = profile.email || "";
        aadhaarNumber.value = profile.aadhaar || "";

        displayName.textContent = profile.name || "User Name";
        displayEmail.textContent = profile.email || "user@example.com";
        displayPhone.textContent = profile.phone || "+91 00000 00000";

        if (profile.name) {

            profileInitial.textContent =
                profile.name.trim().charAt(0).toUpperCase();

        } else {

            profileInitial.textContent = "U";

        }

    }


    /* =================================================
       LOAD ADDRESS
    ================================================== */

    function loadAddress() {

        const savedAddress = localStorage.getItem("luxeoAddress");

        if (!savedAddress) {
            return;
        }

        try {

            const address = JSON.parse(savedAddress);

            addressLine.value = address.address || "";
            city.value = address.city || "";
            state.value = address.state || "";
            pincode.value = address.pincode || "";
            addressType.value = address.type || "Home";

        } catch (error) {

            console.log("Unable to load address.");

        }

    }


    /* =================================================
       SAVE PERSONAL INFORMATION
    ================================================== */

    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = fullName.value.trim();
        const phone = phoneNumber.value.trim();
        const email = emailAddress.value.trim();
        const aadhaar = aadhaarNumber.value.trim();

        if (name === "") {

            alert("Please enter your full name.");
            fullName.focus();
            return;

        }

        if (phone === "") {

            alert("Please enter your phone number.");
            phoneNumber.focus();
            return;

        }

        if (email === "") {

            alert("Please enter your email address.");
            emailAddress.focus();
            return;

        }

        if (aadhaar !== "") {

            if (!/^\d{12}$/.test(aadhaar)) {

                alert("Aadhaar number must contain exactly 12 digits.");
                aadhaarNumber.focus();
                return;

            }

        }

        const profile = {
            name: name,
            phone: phone,
            email: email,
            aadhaar: aadhaar
        };

        saveProfile(profile);
        displayProfile();

        alert("Profile information saved successfully!");

    });


    /* =================================================
       SAVE ADDRESS
    ================================================== */

    addressForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const address = addressLine.value.trim();
        const cityValue = city.value.trim();
        const stateValue = state.value.trim();
        const pincodeValue = pincode.value.trim();
        const type = addressType.value;

        if (address === "") {

            alert("Please enter your address.");
            addressLine.focus();
            return;

        }

        if (cityValue === "") {

            alert("Please enter your city.");
            city.focus();
            return;

        }

        if (stateValue === "") {

            alert("Please enter your state.");
            state.focus();
            return;

        }

        if (!/^\d{6}$/.test(pincodeValue)) {

            alert("Please enter a valid 6-digit pincode.");
            pincode.focus();
            return;

        }

        const addressData = {
            address: address,
            city: cityValue,
            state: stateValue,
            pincode: pincodeValue,
            type: type
        };

        localStorage.setItem("luxeoAddress", JSON.stringify(addressData));

        alert("Address saved successfully!");

    });


    /* =================================================
       EDIT PROFILE BUTTON
    ================================================== */

    editProfileButton.addEventListener("click", function () {

        fullName.focus();

        window.scrollTo({
            top: 300,
            behavior: "smooth"
        });

    });


    /* =================================================
       PREVIOUS ORDERS
    ================================================== */

    function readJSON(key, fallback) {

        try {

            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;

        } catch (error) {

            return fallback;

        }

    }

    // Turns an order from checkout (items list) or an old-style
    // order (product / image / price) into one display row.
    function toDisplayOrder(order) {

        const items = Array.isArray(order.items)
            ? order.items
            : Array.isArray(order.products)
                ? order.products
                : [];

        const first = items[0] || {};
        const firstName = first.name || first.title || "";

        let product = order.product || firstName || "Jewellery order";

        if (!order.product && items.length > 1) {
            product += " + " + (items.length - 1) + " more";
        }

        const total = order.total ?? order.totalAmount ?? order.price ?? 0;

        const status = String(order.status || "Delivered");

        return {
            id: order.id ?? order.orderId ?? order.orderNumber ?? "—",
            product: product,
            image: order.image || first.image || "",
            price: Number(total) || 0,
            status: status.charAt(0).toUpperCase() + status.slice(1)
        };

    }

    function orderBelongsToUser(order, user) {

        if (!user) {
            return true;
        }

        const orderEmail = String(order.customerEmail || order.email || "").toLowerCase();
        const userEmail = String(user.email || "").toLowerCase();

        if (orderEmail && userEmail && orderEmail === userEmail) {
            return true;
        }

        return order.userId != null &&
            user.id != null &&
            String(order.userId) === String(user.id);

    }

    function loadPreviousOrders() {

        const saved = readJSON("luxeoOrders", []);
        const user = readJSON(CURRENT_USER_KEY, null);

        const orders = (Array.isArray(saved) ? saved : [])
            .filter(function (order) {
                return orderBelongsToUser(order, user);
            });

        previousOrders.innerHTML = "";

        /*
            If there are no orders,
            show sample/demo orders.
        */

        if (orders.length === 0) {

            const sampleOrders = [

                {
                    id: "LX1001",
                    product: "Diamond Crystal Necklace",
                    image: "assets/images/necklace.png",
                    price: 3450,
                    status: "Delivered"
                },

                {
                    id: "LX1002",
                    product: "Royal Diamond Ring",
                    image: "assets/images/ring2.png",
                    price: 5200,
                    status: "Delivered"
                }

            ];

            sampleOrders.forEach(function (order) {

                createOrderItem(order);

            });

            return;

        }

        // Newest first, at most 3 on the profile page.
        orders
            .slice()
            .reverse()
            .slice(0, 3)
            .forEach(function (order) {

                createOrderItem(toDisplayOrder(order));

            });

    }


    /* =================================================
       CREATE ORDER ITEM
    ================================================== */

    function createOrderItem(order) {

        const orderItem = document.createElement("div");
        orderItem.className = "order-item";

        const imageBox = document.createElement("div");
        imageBox.className = "order-image";

        if (order.image) {

            const image = document.createElement("img");
            image.src = order.image;
            image.alt = order.product;
            imageBox.appendChild(image);

        }

        const info = document.createElement("div");
        info.className = "order-info";

        const title = document.createElement("h3");
        title.textContent = order.product;

        const idLine = document.createElement("p");
        idLine.textContent = "Order ID: " + order.id;

        const priceLine = document.createElement("p");
        priceLine.textContent = "₹" + Number(order.price).toLocaleString("en-IN");

        info.append(title, idLine, priceLine);

        const status = document.createElement("span");
        status.className = "order-status";
        status.textContent = order.status || "Delivered";

        orderItem.append(imageBox, info, status);

        previousOrders.appendChild(orderItem);

    }

    // "View all orders" opens the My Orders page.
    if (viewOrdersButton) {

        viewOrdersButton.setAttribute("href", "orders.html");

    }


    /* =================================================
       ADD PAYMENT METHOD
    ================================================== */

    addPaymentButton.addEventListener("click", function () {

        const paymentType = prompt("Enter payment method (Card / UPI):");

        if (!paymentType) {
            return;
        }

        const paymentDetails = prompt("Enter the payment details:");

        if (!paymentDetails) {
            return;
        }

        alert(paymentType + " payment method added successfully!");

    });


    /* =================================================
       CHANGE PASSWORD
    ================================================== */

    changePasswordButton.addEventListener("click", function () {

        const currentPassword = prompt("Enter your current password:");

        if (!currentPassword) {
            return;
        }

        const newPassword = prompt("Enter your new password:");

        if (!newPassword) {
            return;
        }

        if (newPassword.length < 6) {

            alert("Password must contain at least 6 characters.");
            return;

        }

        alert("Password changed successfully!");

    });


    /* =================================================
       LOGOUT
    ================================================== */

    logoutButton.addEventListener("click", function () {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (!confirmLogout) {
            return;
        }

        /*
            Remove only the login. The cart, wishlist, orders and
            the list of registered users stay in this browser.
            luxeoCurrentUser is the key the rest of the site
            (checkout, orders) uses to know who is logged in.
        */

        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem("luxeoLoggedIn");

        // replace() so the Back button doesn't return to the profile.
        window.location.replace(LOGIN_PAGE);

    });


    /* =================================================
       INITIAL LOAD
    ================================================== */

    displayProfile();

    loadAddress();

    loadPreviousOrders();

});