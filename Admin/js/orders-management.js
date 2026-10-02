/* =====================================================
   ORDERS DATA
===================================================== */

const orders = [

    {
        id: "#LX10245",
        customer: "Ananya Sharma",

        products: [
            {
                name: "Diamond Crystal Lotus Ring",
                quantity: 1,
                price: 3000
            }
        ],

        date: "25 Sep 2026",
        payment: "UPI",
        status: "Delivered"
    },

    {
        id: "#LX10246",
        customer: "Rahul Kumar",

        products: [
            {
                name: "Diamond Crystal Necklace",
                quantity: 1,
                price: 3450
            }
        ],

        date: "25 Sep 2026",
        payment: "Credit Card",
        status: "Pending"
    },

    {
        id: "#LX10247",
        customer: "Priya Nair",

        products: [
            {
                name: "Diamond Crystal Earrings",
                quantity: 1,
                price: 4320
            }
        ],

        date: "24 Sep 2026",
        payment: "UPI",
        status: "Shipped"
    },

    {
        id: "#LX10248",
        customer: "Arjun Menon",

        products: [
            {
                name: "Diamond Crystal Bracelet",
                quantity: 1,
                price: 2800
            }
        ],

        date: "24 Sep 2026",
        payment: "Cash on Delivery",
        status: "Delivered"
    },

    {
        id: "#LX10249",
        customer: "Sneha Reddy",

        products: [
            {
                name: "Golden Crystal Bangle",
                quantity: 1,
                price: 3750
            }
        ],

        date: "23 Sep 2026",
        payment: "UPI",
        status: "Pending"
    },

    {
        id: "#LX10250",
        customer: "Karthik Raj",

        products: [
            {
                name: "Royal Diamond Ring",
                quantity: 1,
                price: 5200
            }
        ],

        date: "23 Sep 2026",
        payment: "Credit Card",
        status: "Shipped"
    },

    {
        id: "#LX10251",
        customer: "Meera Krishnan",

        products: [
            {
                name: "Elegant Gold Chain",
                quantity: 1,
                price: 4600
            }
        ],

        date: "22 Sep 2026",
        payment: "Debit Card",
        status: "Delivered"
    },

    {
        id: "#LX10252",
        customer: "Vikram Singh",

        products: [
            {
                name: "Crystal Heart Pendant",
                quantity: 1,
                price: 3200
            }
        ],

        date: "22 Sep 2026",
        payment: "UPI",
        status: "Cancelled"
    },

    {
        id: "#LX10253",
        customer: "Divya Iyer",

        products: [
            {
                name: "Diamond Crystal Lotus Ring",
                quantity: 1,
                price: 3000
            }
        ],

        date: "21 Sep 2026",
        payment: "UPI",
        status: "Returned"
    },

    {
        id: "#LX10254",
        customer: "Ananya Sharma",

        products: [
            {
                name: "Diamond Crystal Earrings",
                quantity: 1,
                price: 4320
            },

            {
                name: "Crystal Heart Pendant",
                quantity: 1,
                price: 3200
            }
        ],

        date: "20 Sep 2026",
        payment: "Credit Card",
        status: "Delivered"
    }

];


/* =====================================================
   CALCULATE ORDER TOTAL
===================================================== */

function getOrderTotal(order) {

    return order.products.reduce(function(total, product) {

        return total + (product.price * product.quantity);

    }, 0);

}


/* =====================================================
   FORMAT CURRENCY
===================================================== */

function formatPrice(price) {

    return "₹" + price.toLocaleString("en-IN");

}


/* =====================================================
   STATUS CLASS
===================================================== */

function getStatusClass(status) {

    return status.toLowerCase();

}


/* =====================================================
   DISPLAY ORDERS
===================================================== */

function displayOrders(list) {

    const tableBody = document.getElementById("orderTableBody");

    tableBody.innerHTML = "";


    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center; padding:30px;">
                    No orders found
                </td>
            </tr>
        `;

        return;
    }


    list.forEach(function(order, index) {

        const row = document.createElement("tr");


        /* SHOW ALL PRODUCT NAMES */

        const productNames = order.products
            .map(function(product) {

                if (product.quantity > 1) {
                    return product.name + " × " + product.quantity;
                }

                return product.name;

            })
            .join("<br>");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                <span class="order-id">
                    ${order.id}
                </span>
            </td>

            <td>
                <span class="customer-name">
                    ${order.customer}
                </span>
            </td>

            <td>
                <div class="product-name">
                    ${productNames}
                </div>
            </td>

            <td>
                ${order.date}
            </td>

            <td>
                <span class="amount">
                    ${formatPrice(getOrderTotal(order))}
                </span>
            </td>

            <td>
                ${order.payment}
            </td>

            <td>
                <span class="status ${getStatusClass(order.status)}">
                    ${order.status}
                </span>
            </td>

            <td>
                <button
                    class="view-btn"
                    onclick="viewOrder('${order.id}')"
                >
                    View
                </button>
            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =====================================================
   SEARCH
===================================================== */

const searchInput = document.getElementById("searchInput");


searchInput.addEventListener("input", function() {

    const searchValue = this.value
        .trim()
        .toLowerCase();


    const filteredOrders = orders.filter(function(order) {

        const productText = order.products
            .map(function(product) {
                return product.name;
            })
            .join(" ");


        return (

            order.id.toLowerCase().includes(searchValue) ||

            order.customer.toLowerCase().includes(searchValue) ||

            productText.toLowerCase().includes(searchValue) ||

            order.payment.toLowerCase().includes(searchValue) ||

            order.status.toLowerCase().includes(searchValue)

        );

    });


    displayOrders(filteredOrders);

});


/* =====================================================
   VIEW ORDER
===================================================== */

function viewOrder(orderId) {

    const order = orders.find(function(item) {

        return item.id === orderId;

    });


    if (!order) {
        return;
    }


    document.getElementById("receiptOrderId").textContent =
        order.id;


    document.getElementById("receiptCustomer").textContent =
        order.customer;


    document.getElementById("receiptDate").textContent =
        order.date;


    document.getElementById("receiptPayment").textContent =
        order.payment;


    document.getElementById("receiptStatus").textContent =
        order.status;


    document.getElementById("receiptTotal").textContent =
        formatPrice(getOrderTotal(order));


    /* PRODUCTS */

    const receiptProducts =
        document.getElementById("receiptProducts");


    receiptProducts.innerHTML = "";


    order.products.forEach(function(product) {

        const productRow =
            document.createElement("div");


        productRow.className =
            "receipt-product";


        const productTotal =
            product.price * product.quantity;


        productRow.innerHTML = `

            <span class="receipt-product-name">

                ${product.name}

                ${
                    product.quantity > 1
                    ? " × " + product.quantity
                    : ""
                }

            </span>

            <span class="receipt-product-price">

                ${formatPrice(productTotal)}

            </span>

        `;


        receiptProducts.appendChild(productRow);

    });


    document
        .getElementById("orderModal")
        .classList.add("show");

}


/* =====================================================
   CLOSE ORDER MODAL
===================================================== */

const orderModal =
    document.getElementById("orderModal");


const closeModal =
    document.getElementById("closeModal");


closeModal.addEventListener("click", function() {

    orderModal.classList.remove("show");

});


orderModal.addEventListener("click", function(event) {

    if (event.target === orderModal) {

        orderModal.classList.remove("show");

    }

});


document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        orderModal.classList.remove("show");

    }

});


/* =====================================================
   SIDE MENU
===================================================== */

const menuBtn =
    document.getElementById("menuBtn");


const sideMenu =
    document.getElementById("sideMenu");


menuBtn.addEventListener("click", function(event) {

    event.stopPropagation();

    sideMenu.classList.toggle("open");

});


/* CLOSE MENU WHEN CLICKING OUTSIDE */

document.addEventListener("click", function(event) {

    if (
        sideMenu.classList.contains("open") &&
        !sideMenu.contains(event.target) &&
        event.target !== menuBtn
    ) {

        sideMenu.classList.remove("open");

    }

});


/* =====================================================
   ADMIN POPUP
===================================================== */

const adminArea =
    document.getElementById("adminArea");


const adminPopup =
    document.getElementById("adminPopup");


adminArea.addEventListener("click", function(event) {

    event.stopPropagation();

    adminPopup.classList.toggle("show");

});


document.addEventListener("click", function(event) {

    if (
        adminPopup.classList.contains("show") &&
        !adminPopup.contains(event.target) &&
        event.target !== adminArea
    ) {

        adminPopup.classList.remove("show");

    }

});


/* =====================================================
   LOGOUT CONFIRMATION
===================================================== */

const logoutLink =
    document.getElementById("logoutLink");


logoutLink.addEventListener("click", function(event) {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {

        event.preventDefault();

    }

});


const popupLogout =
    document.getElementById("popupLogout");


popupLogout.addEventListener("click", function(event) {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {

        event.preventDefault();

    }

});


/* =====================================================
   INITIAL DISPLAY
===================================================== */

displayOrders(orders);