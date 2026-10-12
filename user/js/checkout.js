/* =========================================================
   LUXÉORA CHECKOUT  (Razorpay Test Mode)

   Storage keys (already in your project):
     luxeoCart, luxeoCurrentUser, luxeoUsers, luxeoOrders
   Extra key (sessionStorage only): luxeoPendingPayment

   The browser never decides the price or whether a payment
   succeeded. The backend calculates the total and confirms
   every payment with Razorpay before an order is saved.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const API_BASE = "http://localhost:5000";

    const CART_KEY = "luxeoCart";
    const CURRENT_USER_KEY = "luxeoCurrentUser";
    const USERS_KEY = "luxeoUsers";
    const ORDERS_KEY = "luxeoOrders";
    const PENDING_KEY = "luxeoPendingPayment";

    const LOGIN_PAGE = "login.html";
    const HOME_PAGE = "home.html";
    const MAX_QUANTITY = 20;
    const DELIVERY_DAYS = 5;
    const REDIRECT_SECONDS = 5;
    const QR_POLL_MS = 4000;

    const FIELDS = ["fullName", "phone", "email", "addressLine1", "addressLine2", "city", "state", "pincode"];
    const METHODS = ["upi", "card", "netbanking", "wallet", "all"];

    const BUTTON_TEXT = {
        upi: "Pay with UPI app / ID",
        card: "Pay by card",
        netbanking: "Continue to net banking",
        wallet: "Continue to wallet",
        all: "Choose how to pay"
    };

    const $ = id => document.getElementById(id);

    let user = null;
    let busy = false;
    let finished = false;
    let lastCart = [];
    let lastFailure = "";
    let paymentHandled = false;
    const estimatedDelivery = computeDeliveryDate();

    const qr = { active: false, orderId: null, expiresAt: 0, timerId: null, pollId: null };

    /* ---------- helpers ---------- */

    function readJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function formatINR(amount) {
        const number = Number(amount);
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(Number.isFinite(number) ? number : 0);
    }

    function computeDeliveryDate() {
        // Estimate only: 5 working days, skipping Sundays.
        const date = new Date();
        let added = 0;
        while (added < DELIVERY_DAYS) {
            date.setDate(date.getDate() + 1);
            if (date.getDay() !== 0) added++;
        }
        return date;
    }

    function formatDate(date) {
        return date.toLocaleDateString("en-IN", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
    }

    function safeImage(path) {
        const image = String(path || "");
        return /^(\.{0,2}\/)?assets\//.test(image) || /^https?:\/\//i.test(image) ? image : "";
    }

    function normalisePhone(value) {
        let digits = String(value || "").replace(/[\s()-]/g, "");
        if (digits.startsWith("+91")) digits = digits.slice(3);
        else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
        else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
        return digits;
    }

    /* ---------- panels & messages ---------- */

    const PANELS = ["blockedNotice", "emptyCheckout", "pendingPanel", "failedPanel", "checkoutLayout"];

    function showPanel(name) {
        PANELS.forEach(id => { $(id).hidden = id !== name; });
    }

    function showOverlay(text) {
        $("processingText").textContent = text;
        $("processingOverlay").hidden = false;
    }

    function hideOverlay() {
        $("processingOverlay").hidden = true;
    }

    function showMessage(text, type) {
        const box = $("formMessage");
        box.textContent = text;
        box.className = "form-message " + (type === "error" ? "is-error" : "is-info");
        box.hidden = false;
    }

    function clearMessage() {
        $("formMessage").hidden = true;
        $("formMessage").textContent = "";
    }

    function idleLabel() {
        return BUTTON_TEXT[selectedMethod()] || "Pay securely";
    }

    function setBusy(on, text) {
        busy = on;
        $("payButton").disabled = on;
        $("payButton").setAttribute("aria-busy", on ? "true" : "false");
        $("payButtonText").textContent = on ? (text || "Please wait…") : idleLabel();
    }

    /* ---------- user & account status ---------- */

    function getUser() {
        const current = readJSON(CURRENT_USER_KEY, null);
        return current && (current.id != null || current.email) ? current : null;
    }

    function isBlocked(current) {
        // luxeoCurrentUser is a copy made at login, so also check the live
        // luxeoUsers record in case an admin blocked the user afterwards.
        const blockedStatus = status => String(status || "").toLowerCase() === "blocked";
        if (blockedStatus(current.status)) return true;

        const users = readJSON(USERS_KEY, []);
        if (!Array.isArray(users)) return false;

        const live = users.find(account =>
            (current.id != null && String(account.id) === String(current.id)) ||
            (current.email && String(account.email || "").toLowerCase() === String(current.email).toLowerCase())
        );

        return Boolean(live && blockedStatus(live.status));
    }

    /* ---------- cart ---------- */

    function readCart() {
        const raw = readJSON(CART_KEY, []);
        const items = [];
        let invalid = 0;

        if (!Array.isArray(raw)) return { items, invalid: 1 };

        raw.forEach(entry => {
            const id = Number(entry && entry.id);
            const quantity = Number(entry && entry.quantity);
            const price = Number(entry && entry.price);

            if (Number.isInteger(id) && id > 0 && Number.isInteger(quantity) && quantity >= 1 && Number.isFinite(price) && price >= 0) {
                items.push({
                    id,
                    name: String(entry.name || "Jewellery item"),
                    price,
                    quantity,
                    image: String(entry.image || "")
                });
            } else {
                invalid++;
            }
        });

        return { items, invalid };
    }

    function localTotals(items) {
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { subtotal, delivery: 0, total: subtotal };
    }

    function renderSummary(items, totals) {
        const list = $("checkoutItems");
        list.innerHTML = "";

        items.forEach(item => {
            const row = document.createElement("li");
            row.className = "summary-item";

            const thumb = document.createElement("div");
            thumb.className = "summary-thumb";
            const src = safeImage(item.image);
            if (src) {
                const img = document.createElement("img");
                img.src = src;
                img.alt = item.name;
                img.loading = "lazy";
                img.addEventListener("error", () => img.remove());
                thumb.appendChild(img);
            }

            const info = document.createElement("div");
            const name = document.createElement("p");
            name.className = "summary-name";
            name.textContent = item.name;
            const meta = document.createElement("p");
            meta.className = "summary-meta";
            meta.textContent = "Qty " + item.quantity + " × " + formatINR(item.price);
            info.append(name, meta);

            const line = document.createElement("div");
            line.className = "summary-line";
            line.textContent = formatINR(item.price * item.quantity);

            row.append(thumb, info, line);
            list.appendChild(row);
        });

        $("subtotalAmount").textContent = formatINR(totals.subtotal);
        $("deliveryAmount").textContent = totals.delivery > 0 ? formatINR(totals.delivery) : "FREE";
        $("totalAmount").textContent = formatINR(totals.total);
    }

    // Compares the server's figures with the cart. Returns true when they agree.
    function reconcile(cartItems, serverData) {
        const expected = localTotals(cartItems).total;
        const priceChanged = serverData.items.some(serverItem => {
            const local = cartItems.find(item => item.id === serverItem.id);
            return !local || local.price !== serverItem.unitPrice;
        });

        if (!priceChanged && serverData.summary.total === expected) return true;

        renderSummary(cartItems.map(item => {
            const serverItem = serverData.items.find(s => s.id === item.id);
            return serverItem ? { ...item, price: serverItem.unitPrice } : item;
        }), serverData.summary);

        showMessage(
            "Some prices have changed. The total is now " + formatINR(serverData.summary.total) +
            ". Please review it and choose your payment method again.",
            "error"
        );
        return false;
    }

    /* ---------- address: view / edit ---------- */

    const validators = {
        fullName: v => v.length >= 2 && v.length <= 80 ? "" : "Enter your full name.",
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email address.",
        phone: v => /^[6-9]\d{9}$/.test(normalisePhone(v)) ? "" : "Enter a valid 10-digit Indian mobile number.",
        addressLine1: v => v.length >= 5 && v.length <= 120 ? "" : "Enter your street address.",
        addressLine2: v => v.length <= 120 ? "" : "Address line 2 is too long.",
        city: v => /^[A-Za-z .'-]{2,60}$/.test(v) ? "" : "Enter a valid city name.",
        state: v => v ? "" : "Select your state.",
        pincode: v => /^[1-9]\d{5}$/.test(v) ? "" : "Enter a valid 6-digit PIN code."
    };

    function fieldValue(name) {
        return $(name).value.trim().replace(/\s+/g, " ");
    }

    function collectShipping() {
        const shipping = {};
        FIELDS.forEach(name => { shipping[name] = fieldValue(name); });
        shipping.phone = normalisePhone(shipping.phone);
        shipping.email = shipping.email.toLowerCase();
        return shipping;
    }

    function validateAddress(showErrors) {
        let firstInvalid = null;

        FIELDS.forEach(name => {
            const message = validators[name](fieldValue(name));
            if (showErrors) {
                $("err-" + name).textContent = message;
                $(name).setAttribute("aria-invalid", message ? "true" : "false");
            }
            if (message && !firstInvalid) firstInvalid = name;
        });

        return firstInvalid;
    }

    function renderAddressView() {
        const s = collectShipping();
        $("viewName").textContent = s.fullName || "—";
        $("viewPhone").textContent = s.phone ? "+91 " + s.phone : "—";
        $("viewEmail").textContent = s.email || "—";
        $("viewAddress").textContent = [
            s.addressLine1,
            s.addressLine2,
            s.city,
            [s.state, s.pincode].filter(Boolean).join(" - ")
        ].filter(Boolean).join(", ") || "—";
    }

    function setEditing(editing) {
        $("shippingForm").hidden = !editing;
        $("addressView").hidden = editing;
        $("editAddressButton").hidden = editing;
    }

    function prefillAddress(current) {
        const values = {
            fullName: current.name,
            phone: current.phone,
            email: current.email,
            addressLine1: current.address,
            city: current.city,
            pincode: current.pincode
        };

        Object.keys(values).forEach(name => {
            if (values[name]) $(name).value = String(values[name]);
        });

        if (current.state) {
            const wanted = String(current.state).toLowerCase();
            Array.from($("state").options).forEach(option => {
                if (option.value.toLowerCase() === wanted) $("state").value = option.value;
            });
        }
    }

    /* ---------- network ---------- */

    async function explainNetworkError(error) {
        if (error && error.name === "AbortError") {
            return "The payment server took too long to respond. Please try again.";
        }

        // A "no-cors" request succeeds (opaque) if the server is up, even when
        // CORS blocks normal requests. That tells the two failures apart.
        try {
            await fetch(API_BASE + "/api/health", { mode: "no-cors" });
            return "The payment server is running but is blocking this page. Add " + window.location.origin +
                " to FRONTEND_ORIGIN in backend/.env (separate several with commas), then restart the backend.";
        } catch (probeError) {
            return "The payment server isn't running. In the backend folder run  npm.cmd run dev  and check " +
                API_BASE + "/api/health opens, then try again.";
        }
    }

    async function request(method, path, body, timeoutMs) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs || 20000);
        let response;

        try {
            const options = { method, signal: controller.signal };
            if (body) {
                options.headers = { "Content-Type": "application/json" };
                options.body = JSON.stringify(body);
            }
            response = await fetch(API_BASE + path, options);
        } catch (error) {
            clearTimeout(timer);
            const failure = new Error(await explainNetworkError(error));
            failure.network = true;
            throw failure;
        }

        clearTimeout(timer);

        let data = {};
        try { data = await response.json(); } catch (error) { /* non-JSON body */ }

        if (!response.ok) {
            const failure = new Error(data.error || "Something went wrong (" + response.status + ").");
            failure.status = response.status;
            throw failure;
        }

        return data;
    }

    /* ---------- pending payment (survives a refresh) ---------- */

    function savePending(payload) {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload)); } catch (error) { /* ignore */ }
    }

    function readPending() {
        try {
            const value = sessionStorage.getItem(PENDING_KEY);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            return null;
        }
    }

    function clearPending() {
        try { sessionStorage.removeItem(PENDING_KEY); } catch (error) { /* ignore */ }
    }

    function showPending(text) {
        $("pendingText").textContent = text;
        showPanel("pendingPanel");
    }

    function showFailed(text) {
        $("failedText").textContent = text;
        showPanel("failedPanel");
    }

    /* ---------- payment method UI ---------- */

    function selectedMethod() {
        const checked = document.querySelector('input[name="paymentMethod"]:checked');
        return checked ? checked.value : null;
    }

    function updateMethodUI() {
        const method = selectedMethod();
        METHODS.forEach(key => { $("panel-" + key).hidden = key !== method; });
        if (!busy) $("payButtonText").textContent = idleLabel();
    }

    function onMethodChange() {
        clearMessage();
        updateMethodUI();

        if (selectedMethod() === "upi") {
            startQr();
        } else {
            stopQr(true);
            qrIdle("Preparing your QR code…", false);
        }
    }

    function methodOption(selected) {
        // Limits Razorpay's window to the method the customer picked.
        if (selected === "all") return undefined;
        return {
            upi: selected === "upi",
            card: selected === "card",
            netbanking: selected === "netbanking",
            wallet: selected === "wallet",
            emi: false,
            paylater: false
        };
    }

    /* ---------- UPI QR ---------- */

    function qrIdle(text, showRefresh) {
        $("qrImage").hidden = true;
        $("qrImage").removeAttribute("src");
        $("qrPlaceholder").hidden = false;
        $("qrPlaceholder").textContent = text;
        $("qrStatus").textContent = "";
        $("qrStatus").className = "qr-status";
        $("qrTimer").textContent = "";
        $("qrAmount").textContent = "";
        $("qrRefreshButton").hidden = !showRefresh;
    }

    function qrFail(text, showRefresh) {
        qrIdle("QR code not available", showRefresh);
        $("qrStatus").textContent = text;
        $("qrStatus").className = "qr-status is-error";
    }

    function stopQr(closeOnServer) {
        clearInterval(qr.timerId);
        clearTimeout(qr.pollId);

        const id = qr.orderId;
        const wasActive = qr.active;

        qr.active = false;
        qr.orderId = null;
        qr.timerId = null;
        qr.pollId = null;

        // Best effort: tell the server this QR is no longer needed.
        if (closeOnServer && id && wasActive && !finished) {
            request("POST", "/api/payment/qr-close", { orderId: id }, 8000).catch(function () { /* ignore */ });
        }
    }

    function tickQr() {
        const remaining = qr.expiresAt - Date.now();

        if (remaining <= 0) {
            clearInterval(qr.timerId);
            $("qrTimer").textContent = "Checking final status…";
            return;
        }

        const minutes = String(Math.floor(remaining / 60000)).padStart(2, "0");
        const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
        $("qrTimer").textContent = "This QR code expires in " + minutes + ":" + seconds;
    }

    async function pollQr() {
        if (!qr.active || !qr.orderId) return;

        const id = qr.orderId;

        try {
            const data = await request("GET", "/api/payment/qr-status/" + encodeURIComponent(id), null, 15000);

            if (!qr.active || qr.orderId !== id) return;

            if (data.paid === true && data.order) {
                stopQr(false);
                finalise(data.order);
                return;
            }

            if (data.state === "expired") {
                stopQr(false);
                qrFail("This QR code has expired.", true);
                return;
            }

            $("qrStatus").textContent = "Waiting for your payment…";
            $("qrStatus").className = "qr-status";
        } catch (error) {
            if (!qr.active || qr.orderId !== id) return;

            if (error.status === 404) {
                stopQr(false);
                qrFail("The server no longer has this QR code.", true);
                return;
            }

            $("qrStatus").textContent = "Couldn't check the payment just now. Retrying…";
        }

        qr.pollId = setTimeout(pollQr, QR_POLL_MS);
    }

    async function startQr() {
        if (qr.active || finished) return;

        $("qrRefreshButton").hidden = true;

        user = getUser();
        if (!user) { window.location.href = LOGIN_PAGE; return; }
        if (isBlocked(user)) { showPanel("blockedNotice"); return; }

        const cart = readCart();

        if (cart.items.length === 0 || cart.invalid > 0 || cart.items.some(item => item.quantity > MAX_QUANTITY)) {
            qrFail("Fix your cart first, then try again.", true);
            return;
        }

        if (validateAddress(false) !== null) {
            setEditing(true);
            qrIdle("Save your delivery address to see the QR code.", true);
            $("qrStatus").textContent = "Your delivery details are incomplete.";
            $("qrStatus").className = "qr-status is-error";
            return;
        }

        lastCart = cart.items;
        qr.active = true;
        qrIdle("Preparing your QR code…", false);

        try {
            const data = await request("POST", "/api/payment/create-qr", {
                items: cart.items.map(item => ({ id: item.id, quantity: item.quantity })),
                shipping: collectShipping()
            });

            // The customer may have switched method while the QR was loading.
            if (!qr.active) {
                request("POST", "/api/payment/qr-close", { orderId: data.orderId }, 8000).catch(function () { /* ignore */ });
                return;
            }

            qr.orderId = data.orderId;

            if (!reconcile(cart.items, data)) {
                stopQr(true);
                qrFail("The total changed. Review it, then generate a new QR code.", true);
                return;
            }

            if (typeof data.imageUrl !== "string" || !/^https:\/\//i.test(data.imageUrl)) {
                stopQr(true);
                qrFail("The QR image could not be loaded.", true);
                return;
            }

            qr.expiresAt = data.expiresAt;

            $("qrImage").src = data.imageUrl;
            $("qrImage").hidden = false;
            $("qrPlaceholder").hidden = true;
            $("qrAmount").textContent = formatINR(data.summary.total);
            $("qrStatus").textContent = "Waiting for your payment…";
            $("qrStatus").className = "qr-status";

            tickQr();
            qr.timerId = setInterval(tickQr, 1000);
            qr.pollId = setTimeout(pollQr, QR_POLL_MS);
        } catch (error) {
            qr.active = false;
            // 501 means QR isn't enabled on the Razorpay account: no point retrying.
            qrFail(error.message, error.status !== 501);
        }
    }

    /* ---------- Razorpay window payment ---------- */

    async function startPayment() {
        if (busy || finished) return;
        clearMessage();
        lastFailure = "";
        paymentHandled = false;

        const method = selectedMethod();
        if (!method) {
            showMessage("Choose a payment method first.", "error");
            return;
        }

        user = getUser();
        if (!user) { window.location.href = LOGIN_PAGE; return; }
        if (isBlocked(user)) { showPanel("blockedNotice"); return; }

        const cart = readCart();
        if (cart.items.length === 0) { showPanel("emptyCheckout"); return; }
        if (cart.invalid > 0) {
            showMessage("Some items in your cart can't be read. Please remove them in your cart and add them again.", "error");
            return;
        }
        if (cart.items.some(item => item.quantity > MAX_QUANTITY)) {
            showMessage("You can buy at most " + MAX_QUANTITY + " of each item. Please reduce a quantity in your cart.", "error");
            return;
        }

        const invalidField = validateAddress(true);
        if (invalidField) {
            setEditing(true);
            $(invalidField).focus();
            showMessage("Please complete your delivery details.", "error");
            return;
        }

        if (typeof window.Razorpay !== "function") {
            showMessage("The payment window could not load. Check your internet connection and refresh.", "error");
            return;
        }

        // The customer is paying through the window instead of the QR.
        if (qr.active) {
            stopQr(true);
            qrIdle("QR code closed. Generate a new one if you'd like to scan instead.", true);
        }

        const shipping = collectShipping();
        lastCart = cart.items;
        setBusy(true, "Creating secure order…");

        try {
            const order = await request("POST", "/api/payment/create-order", {
                items: cart.items.map(item => ({ id: item.id, quantity: item.quantity })),
                shipping
            });

            if (!reconcile(cart.items, order)) {
                setBusy(false);
                return;
            }

            openRazorpay(order, shipping, method);
        } catch (error) {
            showMessage(error.message, "error");
            setBusy(false);
        }
    }

    function openRazorpay(order, shipping, method) {
        setBusy(true, "Waiting for payment…");

        const options = {
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: "Luxéora Jewels",
            description: "Jewellery order",
            order_id: order.orderId,
            prefill: {
                name: shipping.fullName,
                email: shipping.email,
                contact: "+91" + shipping.phone
            },
            theme: { color: "#a27a3d" },
            handler: function (response) {
                paymentHandled = true;
                const payload = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                };
                // Not proof of payment: the server must verify it first.
                savePending(payload);
                verifyPayment(payload);
            },
            modal: {
                escape: true,
                ondismiss: function () {
                    if (paymentHandled) return;
                    setBusy(false);
                    if (!lastFailure) {
                        showMessage("Payment cancelled. No money was taken and your cart is unchanged.", "info");
                    }
                }
            }
        };

        const RESTRICT_METHODS = false;
   const restricted = methodOption(method);
   if (RESTRICT_METHODS && restricted) options.method = restricted;

        const checkout = new window.Razorpay(options);

        checkout.on("payment.failed", function (response) {
            const reason = response && response.error && response.error.description;
            lastFailure = reason || "The payment failed.";
            showMessage(lastFailure + " You can try again.", "error");
        });

        checkout.open();
    }

    async function verifyPayment(payload) {
        showOverlay("Confirming your payment…");

        try {
            const data = await request("POST", "/api/payment/verify", payload, 25000);

            if (data.verified === true && data.order) {
                finalise(data.order);
                return;
            }

            showPending("We couldn't confirm your payment yet.");
        } catch (error) {
            const reference = "Payment ID: " + payload.razorpay_payment_id + ".";

            if (error.status === 400) {
                clearPending();
                showFailed(error.message + " If money was deducted, contact support@luxeora.com with this reference. " + reference);
            } else if (error.status === 404) {
                clearPending();
                showFailed("The server doesn't recognise this order (it may have restarted). If money was deducted, contact support@luxeora.com. " + reference);
            } else {
                showPending(error.message);
            }
        } finally {
            hideOverlay();
            setBusy(false);
        }
    }

    /* ---------- after server-verified payment ---------- */

    function finalise(order) {
        finished = true;
        stopQr(false);
        let saveFailed = false;

        // TEMPORARY localStorage bridge for the My Orders prototype.
        // It is written only after the backend verified the payment, using
        // the server's items, amounts and address. In production, My Orders
        // should load orders from the backend instead.
        try {
            const imageById = {};
            lastCart.concat(readCart().items).forEach(item => { imageById[item.id] = item.image; });

            const saved = readJSON(ORDERS_KEY, []);
            const orders = Array.isArray(saved) ? saved : [];

            if (!orders.some(existing => String(existing.id) === String(order.id))) {
                orders.push({
                    id: order.id,
                    orderId: order.id,
                    userId: user ? user.id : null,
                    customerEmail: user ? user.email : order.shipping.email,
                    items: order.items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: imageById[item.id] || ""
                    })),
                    subtotal: order.subtotal,
                    deliveryCharge: order.delivery,
                    total: order.total,
                    createdAt: order.paidAt || order.createdAt,
                    estimatedDelivery: estimatedDelivery.toISOString(),
                    status: "paid",
                    paymentStatus: "paid",
                    paymentMethod: "Razorpay" + (order.paymentMethod ? " (" + String(order.paymentMethod).toUpperCase() + ")" : " (Test Mode)"),
                    paymentId: order.paymentId,
                    shippingAddress: {
                        fullName: order.shipping.fullName,
                        phone: order.shipping.phone,
                        email: order.shipping.email,
                        addressLine1: order.shipping.addressLine1,
                        addressLine2: order.shipping.addressLine2,
                        city: order.shipping.city,
                        state: order.shipping.state,
                        pincode: order.shipping.pincode
                    }
                });
                localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
            }

            // Cart is cleared only now, after server verification.
            localStorage.removeItem(CART_KEY);
        } catch (error) {
            saveFailed = true;
        }

        clearPending();
        PANELS.forEach(id => { $(id).hidden = true; });
        hideOverlay();

        $("successAmount").textContent = formatINR(order.total);
        $("successOrderId").textContent = "#" + order.id;
        $("successDelivery").textContent = formatDate(estimatedDelivery);
        $("successNote").textContent = saveFailed
            ? "Your payment is confirmed, but this browser couldn't save the order to My Orders. Keep the order number above."
            : "";
        $("successModal").hidden = false;
        $("goHomeButton").focus();

        let seconds = REDIRECT_SECONDS;
        $("successCountdown").textContent = seconds;

        const timer = setInterval(function () {
            seconds--;
            $("successCountdown").textContent = Math.max(seconds, 0);
            if (seconds <= 0) {
                clearInterval(timer);
                window.location.href = HOME_PAGE;
            }
        }, 1000);

        $("goHomeButton").addEventListener("click", function () {
            clearInterval(timer);
            window.location.href = HOME_PAGE;
        });
    }

    /* ---------- page setup ---------- */

    function refreshPage() {
        if (finished) return;

        user = getUser();
        if (!user) { window.location.href = LOGIN_PAGE; return; }
        if (isBlocked(user)) { stopQr(true); showPanel("blockedNotice"); return; }

        const cart = readCart();
        if (cart.items.length === 0) { stopQr(true); showPanel("emptyCheckout"); return; }

        renderSummary(cart.items, localTotals(cart.items));

        if (cart.invalid > 0) {
            showMessage("Some items in your cart can't be read. Please remove them in your cart and add them again.", "error");
        }

        if ($("pendingPanel").hidden && $("failedPanel").hidden) showPanel("checkoutLayout");
    }

    function init() {
        user = getUser();
        if (!user) { window.location.href = LOGIN_PAGE; return; }

        $("deliveryDateText").textContent = formatDate(estimatedDelivery);
        $("summaryDeliveryDate").textContent = estimatedDelivery.toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });

        prefillAddress(user);
        renderAddressView();

        // Show the saved details if complete, otherwise ask for them.
        setEditing(validateAddress(false) !== null);

        updateMethodUI();
        refreshPage();

        const pending = readPending();
        if (pending && !isBlocked(user)) {
            showPending("A payment you made earlier is waiting to be confirmed.");
        }
    }

    /* ---------- events ---------- */

    $("editAddressButton").addEventListener("click", function () {
        // The QR was made for the old address, so retire it.
        if (qr.active) {
            stopQr(true);
            qrIdle("Save your delivery address to generate a new QR code.", false);
        }
        setEditing(true);
        $("fullName").focus();
    });

    $("shippingForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const invalidField = validateAddress(true);
        if (invalidField) { $(invalidField).focus(); return; }
        renderAddressView();
        setEditing(false);
        clearMessage();
        if (selectedMethod() === "upi") startQr();
    });

    FIELDS.forEach(function (name) {
        $(name).addEventListener("input", function () {
            $("err-" + name).textContent = "";
            $(name).setAttribute("aria-invalid", "false");
        });
    });

    document.querySelectorAll('input[name="paymentMethod"]').forEach(function (radio) {
        radio.addEventListener("change", onMethodChange);
    });

    $("qrRefreshButton").addEventListener("click", function () {
        stopQr(true);
        startQr();
    });

    $("payButton").addEventListener("click", startPayment);

    $("checkStatusButton").addEventListener("click", function () {
        const pending = readPending();
        if (!pending) { showPanel("checkoutLayout"); refreshPage(); return; }
        verifyPayment(pending);
    });

    $("tryAgainButton").addEventListener("click", function () {
        $("failedPanel").hidden = true;
        refreshPage();
        showPanel("checkoutLayout");
    });

    // Re-calculate if the cart changes in another tab or when returning to this page.
    window.addEventListener("storage", function (event) {
        if (event.key !== CART_KEY) return;
        if (qr.active) {
            stopQr(true);
            qrIdle("Your cart changed. Generate a new QR code to pay the new total.", true);
        }
        refreshPage();
    });

    window.addEventListener("pageshow", function (event) {
        if (event.persisted) refreshPage();
    });

    init();
});