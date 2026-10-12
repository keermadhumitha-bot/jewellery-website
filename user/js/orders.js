/* =========================================
LUXÉORA JEWELS — MY ORDERS
File: user/js/orders.js

FRONT-END PROTOTYPE ONLY.
Production orders and cancellations must
be handled and verified by your backend.

CHANGE FROM YOUR VERSION: shows "Expected delivery"
on each order card and in View Details.
========================================= */

document.addEventListener("DOMContentLoaded", () => {
const ORDERS_KEY = "luxeoOrders";
const CURRENT_USER_KEY = "luxeoCurrentUser";
const DELIVERY_DAYS = 5;

const ordersList = document.getElementById("ordersList");
const loading = document.getElementById("ordersLoading");
const errorBox = document.getElementById("ordersError");
const errorText = document.getElementById("ordersErrorText");
const emptyOrders = document.getElementById("emptyOrders");
const noMatchingOrders = document.getElementById("noMatchingOrders");

const statusFilter = document.getElementById("orderStatusFilter");
const sortFilter = document.getElementById("orderSort");

const detailsModal = document.getElementById("orderDetailsModal");
const detailsContent = document.getElementById("orderDetailsContent");
const cancelModal = document.getElementById("cancelOrderModal");
const cancelMessage = document.getElementById("cancelOrderMessage");

const totalOrdersElement = document.getElementById("totalOrders");
const activeOrdersElement = document.getElementById("activeOrders");
const deliveredOrdersElement = document.getElementById("deliveredOrders");

let currentUser = null;
let customerOrders = [];
let selectedOrderId = null;

function readJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.error(`Unable to read ${key}:`, error);
        return fallback;
    }
}

function saveOrders(orders) {
    try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        return true;
    } catch (error) {
        console.error("Unable to save orders:", error);
        showError("Your change could not be saved in this browser.");
        return false;
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function formatCurrency(amount) {
    const number = Number(amount);
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number.isFinite(number) ? number : 0);
}

function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function formatLongDate(date) {
    return date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function normaliseStatus(status) {
    return String(status || "pending").trim().toLowerCase();
}

function getOrderId(order) {
    return String(order.id ?? order.orderId ?? order.orderNumber ?? "");
}

function getOrderProducts(order) {
    return Array.isArray(order.items)
        ? order.items
        : Array.isArray(order.products)
            ? order.products
            : [];
}

function getProductName(product) {
    return product.name || product.title || "Jewellery item";
}

function getProductQuantity(product) {
    const quantity = Number(product.quantity ?? product.qty ?? 1);
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function getProductPrice(product) {
    const price = Number(product.price ?? product.unitPrice ?? 0);
    return Number.isFinite(price) && price >= 0 ? price : 0;
}

function getOrderTotal(order) {
    if (order.total != null) return Number(order.total) || 0;
    if (order.totalAmount != null) return Number(order.totalAmount) || 0;

    return getOrderProducts(order).reduce((sum, product) => {
        return sum + getProductPrice(product) * getProductQuantity(product);
    }, 0);
}

function getOrderDate(order) {
    return order.createdAt || order.orderDate || order.date || "";
}

/* ---------- EXPECTED DELIVERY ---------- */

function addWorkingDays(date, days) {
    // Same rule as checkout: working days, skipping Sundays.
    const result = new Date(date.getTime());
    let added = 0;

    while (added < days) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0) added++;
    }

    return result;
}

function getExpectedDelivery(order) {
    // Nothing to expect once an order is finished or cancelled.
    const finished = ["delivered", "cancelled", "canceled", "returned", "refunded"];
    if (finished.includes(normaliseStatus(order.status))) return null;

    // Use the date saved at checkout when there is one.
    const saved = order.estimatedDelivery || order.expectedDelivery || order.deliveryDate;

    if (saved) {
        const savedDate = new Date(saved);
        if (!Number.isNaN(savedDate.getTime())) return savedDate;
    }

    // Older orders have no saved date: estimate from the order date.
    const placed = new Date(getOrderDate(order));
    if (Number.isNaN(placed.getTime())) return null;

    return addWorkingDays(placed, DELIVERY_DAYS);
}

function belongsToCurrentUser(order) {
    const orderEmail = String(
        order.customerEmail || order.email || ""
    ).toLowerCase();

    const userEmail = String(currentUser?.email || "").toLowerCase();

    const orderUserId = order.userId == null
        ? ""
        : String(order.userId);

    const currentUserId = currentUser?.id == null
        ? ""
        : String(currentUser.id);

    if (orderEmail && userEmail && orderEmail === userEmail) {
        return true;
    }

    return Boolean(
        orderUserId &&
        currentUserId &&
        orderUserId === currentUserId
    );
}

function showError(message) {
    if (errorText) errorText.textContent = message;
    if (errorBox) errorBox.hidden = false;
    if (loading) loading.hidden = true;
}

function hideMessages() {
    if (errorBox) errorBox.hidden = true;
    if (emptyOrders) emptyOrders.hidden = true;
    if (noMatchingOrders) noMatchingOrders.hidden = true;
}

function updateSummary() {
    const activeStatuses = [
        "pending",
        "paid",
        "processing",
        "shipped"
    ];

    if (totalOrdersElement) {
        totalOrdersElement.textContent = customerOrders.length;
    }

    if (activeOrdersElement) {
        activeOrdersElement.textContent = customerOrders.filter(order =>
            activeStatuses.includes(normaliseStatus(order.status))
        ).length;
    }

    if (deliveredOrdersElement) {
        deliveredOrdersElement.textContent = customerOrders.filter(order =>
            normaliseStatus(order.status) === "delivered"
        ).length;
    }
}

function getProductImage(product) {
    // Only allow relative project paths or HTTP(S) image URLs.
    const image = String(product.image || product.imageUrl || "");

    if (
        image.startsWith("assets/") ||
        image.startsWith("./assets/") ||
        image.startsWith("../assets/") ||
        /^https?:\/\//i.test(image)
    ) {
        return image;
    }

    return "";
}

function renderProduct(product) {
    const name = escapeHTML(getProductName(product));
    const quantity = getProductQuantity(product);
    const price = getProductPrice(product);
    const image = getProductImage(product);

    const imageMarkup = image
        ? `<img class="order-product-image"
                src="${escapeHTML(image)}"
                alt="${name}"
                loading="lazy"
                onerror="this.style.display='none'">`
        : `<div class="order-product-image"
                role="img"
                aria-label="Jewellery image unavailable"></div>`;

    return `
        <div class="order-product">
            ${imageMarkup}
            <div class="order-product-info">
                <h4>${name}</h4>
                <p>Quantity: ${quantity}</p>
                <p>${formatCurrency(price)} each</p>
            </div>
            <div class="order-product-price">
                ${formatCurrency(price * quantity)}
            </div>
        </div>
    `;
}

function canCancelOrder(order) {
    // Demo-only rule: permit cancellation of pending orders.
    // Paid orders may require server-side cancellation/refund.
    return normaliseStatus(order.status) === "pending";
}

function renderOrder(order) {
    const orderId = getOrderId(order);
    const status = normaliseStatus(order.status);
    const products = getOrderProducts(order);
    const visibleProducts = products.slice(0, 3);
    const moreProducts = products.length - visibleProducts.length;
    const expectedDelivery = getExpectedDelivery(order);

    const statusClass = status.replace(/[^a-z0-9-]/g, "");
    const productMarkup = visibleProducts.length
        ? visibleProducts.map(renderProduct).join("")
        : `<p>No product details are available for this order.</p>`;

    return `
        <article class="order-card">
            <div class="order-card-header">
                <div>
                    <p class="order-number">
                        Order #${escapeHTML(orderId || "Unavailable")}
                    </p>
                    <p class="order-date">
                        Placed on ${escapeHTML(formatDate(getOrderDate(order)))}
                    </p>
                    ${
                        expectedDelivery
                            ? `<p class="order-date">
                                Expected delivery:
                                <strong>${escapeHTML(formatLongDate(expectedDelivery))}</strong>
                            </p>`
                            : ""
                    }
                </div>
                <span class="order-status status-${statusClass}">
                    ${escapeHTML(status)}
                </span>
            </div>

            <div class="order-card-body">
                <div class="order-product-list">
                    ${productMarkup}
                </div>
                ${
                    moreProducts > 0
                        ? `<p>And ${moreProducts} more item(s).</p>`
                        : ""
                }
            </div>

            <div class="order-card-footer">
                <div>
                    <span class="order-total-label">Order total</span>
                    <span class="order-total-amount">
                        ${formatCurrency(getOrderTotal(order))}
                    </span>
                </div>

                <div class="order-actions">
                    <button
                        type="button"
                        class="order-btn order-btn-primary"
                        data-action="details"
                        data-order-id="${escapeHTML(orderId)}">
                        View Details
                    </button>

                    ${
                        canCancelOrder(order)
                            ? `<button
                                type="button"
                                class="order-btn order-btn-danger"
                                data-action="cancel"
                                data-order-id="${escapeHTML(orderId)}">
                                Cancel Order
                            </button>`
                            : ""
                    }
                </div>
            </div>
        </article>
    `;
}

function getFilteredOrders() {
    let result = [...customerOrders];
    const selectedStatus = statusFilter?.value || "all";
    const sort = sortFilter?.value || "newest";

    if (selectedStatus !== "all") {
        result = result.filter(order =>
            normaliseStatus(order.status) === selectedStatus
        );
    }

    result.sort((a, b) => {
        const dateA = new Date(getOrderDate(a)).getTime() || 0;
        const dateB = new Date(getOrderDate(b)).getTime() || 0;

        return sort === "oldest" ? dateA - dateB : dateB - dateA;
    });

    return result;
}

function renderOrders() {
    hideMessages();

    if (!customerOrders.length) {
        if (ordersList) ordersList.innerHTML = "";
        if (emptyOrders) emptyOrders.hidden = false;
        return;
    }

    const filteredOrders = getFilteredOrders();

    if (ordersList) {
        ordersList.innerHTML = filteredOrders
            .map(renderOrder)
            .join("");
    }

    if (noMatchingOrders) {
        noMatchingOrders.hidden = filteredOrders.length !== 0;
    }
}

function loadOrders() {
    if (loading) loading.hidden = false;
    hideMessages();

    currentUser = readJSON(CURRENT_USER_KEY, null);

    if (!currentUser || !currentUser.email && currentUser.id == null) {
        showError("Please sign in to view your orders.");
        return;
    }

    const allOrders = readJSON(ORDERS_KEY, []);

    if (!Array.isArray(allOrders)) {
        showError("Your saved order data is not in the expected format.");
        return;
    }

    customerOrders = allOrders.filter(belongsToCurrentUser);

    if (loading) loading.hidden = true;

    updateSummary();
    renderOrders();
}

function findOrder(orderId) {
    return customerOrders.find(order =>
        getOrderId(order) === String(orderId)
    );
}

function openDetails(orderId) {
    const order = findOrder(orderId);
    if (!order || !detailsModal || !detailsContent) return;

    const address = order.address || order.shippingAddress || {};
    const addressText = typeof address === "string"
        ? address
        : [
            address.fullName || address.name,
            address.addressLine1 || address.address,
            address.addressLine2,
            address.city,
            address.state,
            address.pincode || address.postalCode
        ].filter(Boolean).join(", ");

    const products = getOrderProducts(order);
    const paymentMethod = order.paymentMethod || order.payment?.method || "Not available";
    const paymentStatus = order.paymentStatus || order.status || "Not available";
    const expectedDelivery = getExpectedDelivery(order);

    detailsContent.innerHTML = `
        <div class="order-detail-row">
            <span>Order number</span>
            <span>${escapeHTML(getOrderId(order))}</span>
        </div>
        <div class="order-detail-row">
            <span>Order date</span>
            <span>${escapeHTML(formatDate(getOrderDate(order)))}</span>
        </div>
        ${
            expectedDelivery
                ? `<div class="order-detail-row">
                    <span>Expected delivery</span>
                    <span>${escapeHTML(formatLongDate(expectedDelivery))}</span>
                </div>`
                : ""
        }
        <div class="order-detail-row">
            <span>Order status</span>
            <span>${escapeHTML(normaliseStatus(order.status))}</span>
        </div>
        <div class="order-detail-row">
            <span>Payment method</span>
            <span>${escapeHTML(paymentMethod)}</span>
        </div>
        <div class="order-detail-row">
            <span>Payment status</span>
            <span>${escapeHTML(paymentStatus)}</span>
        </div>
        <div class="order-detail-row">
            <span>Items</span>
            <span>${products.reduce((sum, item) =>
                sum + getProductQuantity(item), 0)}</span>
        </div>
        <div class="order-detail-row">
            <span>Total</span>
            <span>${formatCurrency(getOrderTotal(order))}</span>
        </div>
        <div class="order-detail-row">
            <span>Delivery address</span>
            <span>${escapeHTML(addressText || "No address saved")}</span>
        </div>
    `;

    detailsModal.hidden = false;
}

function openCancelConfirmation(orderId) {
    const order = findOrder(orderId);
    if (!order || !canCancelOrder(order) || !cancelModal) return;

    selectedOrderId = getOrderId(order);

    if (cancelMessage) {
        cancelMessage.textContent =
            `Are you sure you want to cancel order ${selectedOrderId}? `+ "This demo only updates the order stored in this browser.";
    }

    cancelModal.hidden = false;
}

function cancelSelectedOrder() {
    if (!selectedOrderId) return;

    const order = findOrder(selectedOrderId);

    if (!order || !canCancelOrder(order)) {
        if (cancelModal) cancelModal.hidden = true;
        selectedOrderId = null;
        return;
    }

    const allOrders = readJSON(ORDERS_KEY, []);

    if (!Array.isArray(allOrders)) {
        showError("Unable to update the order.");
        return;
    }

    const targetId = selectedOrderId;

    const updatedOrders = allOrders.map(item => {
        const sameOrder = getOrderId(item) === targetId;
        const belongsToUser = belongsToCurrentUser(item);

        if (sameOrder && belongsToUser &&
            normaliseStatus(item.status) === "pending") {
            return {
                ...item,
                status: "cancelled",
                cancelledAt: new Date().toISOString()
            };
        }

        return item;
    });

    if (saveOrders(updatedOrders)) {
        if (cancelModal) cancelModal.hidden = true;
        selectedOrderId = null;
        loadOrders();
    }
}

// Order card buttons use event delegation.
if (ordersList) {
    ordersList.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const orderId = button.dataset.orderId;

        if (button.dataset.action === "details") {
            openDetails(orderId);
        }

        if (button.dataset.action === "cancel") {
            openCancelConfirmation(orderId);
        }
    });
}

if (statusFilter) {
    statusFilter.addEventListener("change", renderOrders);
}

if (sortFilter) {
    sortFilter.addEventListener("change", renderOrders);
}

document.getElementById("retryOrders")?.addEventListener("click", loadOrders);

document.getElementById("clearOrderFilter")?.addEventListener("click", () => {
    if (statusFilter) statusFilter.value = "all";
    if (sortFilter) sortFilter.value = "newest";
    renderOrders();
});

document.getElementById("closeOrderDetails")?.addEventListener("click", () => {
    if (detailsModal) detailsModal.hidden = true;
});

document.getElementById("closeCancelModal")?.addEventListener("click", () => {
    if (cancelModal) cancelModal.hidden = true;
    selectedOrderId = null;
});

document.getElementById("keepOrderButton")?.addEventListener("click", () => {
    if (cancelModal) cancelModal.hidden = true;
    selectedOrderId = null;
});

document.getElementById("confirmCancelOrder")?.addEventListener("click", cancelSelectedOrder);

// Close modals by clicking the shaded background.
[detailsModal, cancelModal].forEach(modal => {
    modal?.addEventListener("click", event => {
        if (event.target === modal) {
            modal.hidden = true;
            selectedOrderId = null;
        }
    });
});

// Close an open modal with Escape.
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (detailsModal) detailsModal.hidden = true;
        if (cancelModal) cancelModal.hidden = true;
        selectedOrderId = null;
    }
});

loadOrders();
});