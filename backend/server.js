require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();
const PORT = Number(process.env.PORT || 5000);

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// FRONTEND_ORIGIN may hold several origins separated by commas, e.g.
// http://127.0.0.1:5500,http://localhost:5500
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGIN || "http://127.0.0.1:5500")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

if (!KEY_ID || !KEY_SECRET) {
    console.error("Missing Razorpay credentials. Check backend/.env");
    process.exit(1);
}

if (!KEY_ID.startsWith("rzp_test_")) {
    console.warn("WARNING: RAZORPAY_KEY_ID is not a test key. Use Test Mode keys while developing.");
}

const razorpay = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });

app.use(cors({
    origin(origin, callback) {
        // Browsers always send Origin on cross-origin requests.
        // Requests without one (curl, Postman) are allowed for local testing.
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    }
}));

app.use(express.json({ limit: "100kb" }));

// --------------------------------------------------
// TRUSTED PRODUCT CATALOGUE
// Copied from user/js/collections.js (IDs 1-16).
// The server price always wins. If you change a price
// in collections.js, change it here too.
// --------------------------------------------------

const PRODUCTS = {
    "1":  { id: 1,  name: "Diamond Crystal Necklace", price: 3450 },
    "2":  { id: 2,  name: "Royal Diamond Ring",       price: 5200 },
    "3":  { id: 3,  name: "Diamond Crystal Bracelet", price: 2800 },
    "4":  { id: 4,  name: "Classic Gold Ring",        price: 12500 },
    "5":  { id: 5,  name: "Elegant Gold Necklace",    price: 18900 },
    "6":  { id: 6,  name: "Diamond Bangle",           price: 15700 },
    "7":  { id: 7,  name: "Elegant Earrings",         price: 9800 },
    "8":  { id: 8,  name: "Bridal Ruby Ring",         price: 16500 },
    "9":  { id: 9,  name: "Platinum Classic Ring",    price: 19500 },
    "10": { id: 10, name: "Pearl Diamond Earrings",   price: 7200 },
    "11": { id: 11, name: "Modern Diamond Bracelet",  price: 14300 },
    "12": { id: 12, name: "Traditional Gold Bangle",  price: 19800 },
    "13": { id: 13, name: "Diamond Mangalsutra",      price: 17200 },
    "14": { id: 14, name: "Minimal Gold Ring",        price: 10500 },
    "15": { id: 15, name: "Sapphire Gold Necklace",   price: 20500 },
    "16": { id: 16, name: "Classic Gold Bracelet",    price: 11200 }
};

// Your cart page shows delivery as FREE and has no discounts or tax,
// so the server uses the same rule. Change here if that ever changes.
const DELIVERY_PAISE = 0;
const MAX_QUANTITY = 20;

// Temporary in-memory records for local testing.
// They disappear when the server restarts. Use a database for real orders.
const orders = new Map();
const verifiedPayments = new Map();

function makeHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function normaliseCart(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw makeHttpError(400, "Your cart is empty.");
    }

    if (items.length > 50) {
        throw makeHttpError(400, "Too many items in the cart.");
    }

    // Merge duplicate product IDs so the quantity limit cannot be bypassed.
    const merged = new Map();

    for (const item of items) {
        const productId = String((item && (item.id ?? item.productId)) ?? "");
        const product = PRODUCTS[productId];
        const quantity = Number(item && (item.quantity ?? item.qty));

        if (!product) {
            throw makeHttpError(400, `Product ${productId || "(unknown)"} is not available.`);
        }

        if (!Number.isSafeInteger(quantity) || quantity < 1) {
            throw makeHttpError(400, "Invalid product quantity.");
        }

        merged.set(product.id, (merged.get(product.id) || 0) + quantity);
    }

    const result = [];
    let subtotalPaise = 0;

    for (const [id, quantity] of merged) {
        const product = PRODUCTS[String(id)];

        if (quantity > MAX_QUANTITY) {
            throw makeHttpError(400, `You can buy at most ${MAX_QUANTITY} of "${product.name}".`);
        }

        const unitPricePaise = Math.round(product.price * 100);
        const lineTotalPaise = unitPricePaise * quantity;

        subtotalPaise += lineTotalPaise;

        result.push({
            id: product.id,
            name: product.name,
            quantity,
            unitPricePaise,
            lineTotalPaise
        });
    }

    const totalPaise = subtotalPaise + DELIVERY_PAISE;

    if (!Number.isSafeInteger(totalPaise) || totalPaise < 100) {
        throw makeHttpError(400, "The order total must be at least ₹1.");
    }

    return { items: result, subtotalPaise, totalPaise };
}

function normalisePhone(value) {
    let digits = String(value || "").replace(/[\s()-]/g, "");

    if (digits.startsWith("+91")) digits = digits.slice(3);
    else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);

    return digits;
}

function validateShipping(input) {
    const source = input && typeof input === "object" ? input : {};
    const clean = field =>
        typeof source[field] === "string"
            ? source[field].trim().replace(/\s+/g, " ")
            : "";

    const shipping = {
        fullName: clean("fullName"),
        email: clean("email").toLowerCase(),
        phone: normalisePhone(clean("phone")),
        addressLine1: clean("addressLine1"),
        addressLine2: clean("addressLine2"),
        city: clean("city"),
        state: clean("state"),
        pincode: clean("pincode")
    };

    const problems = [];

    if (shipping.fullName.length < 2 || shipping.fullName.length > 80) problems.push("full name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(shipping.email) || shipping.email.length > 120) problems.push("email");
    if (!/^[6-9]\d{9}$/.test(shipping.phone)) problems.push("phone number");
    if (shipping.addressLine1.length < 5 || shipping.addressLine1.length > 120) problems.push("address line 1");
    if (shipping.addressLine2.length > 120) problems.push("address line 2");
    if (!/^[A-Za-z .'-]{2,60}$/.test(shipping.city)) problems.push("city");
    if (shipping.state.length < 2 || shipping.state.length > 50) problems.push("state");
    if (!/^[1-9]\d{5}$/.test(shipping.pincode)) problems.push("PIN code");

    if (problems.length) {
        throw makeHttpError(400, `Please check your shipping details: ${problems.join(", ")}.`);
    }

    return shipping;
}

function publicOrder(order) {
    return {
        id: order.id,
        status: order.status,
        currency: order.currency,
        amount: order.amount,
        subtotal: order.subtotalPaise / 100,
        delivery: order.deliveryPaise / 100,
        total: order.amount / 100,
        paymentId: order.paymentId,
        paymentMethod: order.paymentMethod || null,
        createdAt: order.createdAt,
        paidAt: order.paidAt || null,
        items: order.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.unitPricePaise / 100,
            quantity: item.quantity,
            lineTotal: item.lineTotalPaise / 100
        })),
        shipping: order.shipping
    };
}

// Health check: open http://localhost:5000/api/health
app.get("/api/health", (req, res) => {
    res.json({ ok: true, message: "Luxéora payment backend is running." });
});

// --------------------------------------------------
// CREATE RAZORPAY ORDER
// POST /api/payment/create-order
// Body: { items: [{ id, quantity }], shipping: {...} }
// --------------------------------------------------

app.post("/api/payment/create-order", async (req, res) => {
    try {
        const body = req.body || {};
        const { items, subtotalPaise, totalPaise } = normaliseCart(body.items);
        const shipping = validateShipping(body.shipping);

        const receipt = `lx_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

        // No personal data is sent to Razorpay in notes.
        const razorpayOrder = await razorpay.orders.create({
            amount: totalPaise,
            currency: "INR",
            receipt,
            notes: { store: "Luxeora Jewels" }
        });

        orders.set(razorpayOrder.id, {
            id: razorpayOrder.id,
            receipt,
            items,
            subtotalPaise,
            deliveryPaise: DELIVERY_PAISE,
            amount: totalPaise,
            currency: "INR",
            shipping,
            status: "pending",
            paymentId: null,
            paymentMethod: null,
            verifying: false,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({
            keyId: KEY_ID,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            summary: {
                subtotal: subtotalPaise / 100,
                delivery: DELIVERY_PAISE / 100,
                discount: 0,
                total: totalPaise / 100
            },
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPricePaise / 100,
                lineTotal: item.lineTotalPaise / 100
            }))
        });
    } catch (error) {
        console.error("Create order failed:", error.message);

        res.status(error.status || 500).json({
            error: error.status
                ? error.message
                : "Unable to create the payment order. Please try again."
        });
    }
});

// --------------------------------------------------
// VERIFY PAYMENT
// POST /api/payment/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// --------------------------------------------------

app.post("/api/payment/verify", async (req, res) => {
    let order = null;

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body || {};

        if (
            typeof razorpay_order_id !== "string" ||
            typeof razorpay_payment_id !== "string" ||
            typeof razorpay_signature !== "string"
        ) {
            throw makeHttpError(400, "Missing payment verification details.");
        }

        order = orders.get(razorpay_order_id);

        // Only verify an order that this server created.
        if (!order) {
            throw makeHttpError(404, "Order not found on the server.");
        }

        // Idempotent: same order + same payment already verified.
        if (order.status === "paid" && order.paymentId === razorpay_payment_id) {
            return res.json({
                verified: true,
                orderId: order.id,
                paymentId: order.paymentId,
                status: order.status,
                order: publicOrder(order)
            });
        }

        if (order.status === "paid") {
            throw makeHttpError(409, "This order is already paid.");
        }

        if (order.verifying) {
            throw makeHttpError(409, "Verification is already in progress. Please check again in a moment.");
        }

        const expectedSignature = crypto
            .createHmac("sha256", KEY_SECRET)
            .update(`${order.id}|${razorpay_payment_id}`)
            .digest("hex");

        const supplied = Buffer.from(razorpay_signature, "hex");
        const expected = Buffer.from(expectedSignature, "hex");

        if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
            throw makeHttpError(400, "Payment signature verification failed.");
        }

        order.verifying = true;

        // A valid signature alone is not proof the money was captured,
        // so ask Razorpay for the payment itself.
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (payment.order_id !== order.id) {
            throw makeHttpError(400, "Payment does not match this order.");
        }

        if (payment.amount !== order.amount || payment.currency !== order.currency) {
            throw makeHttpError(400, "Payment amount or currency mismatch.");
        }

        if (payment.status !== "captured") {
            return res.status(409).json({
                verified: false,
                status: payment.status,
                error: payment.status === "authorized"
                    ? "Your payment is authorised but not captured yet. Please check again shortly."
                    : "Your payment is not confirmed yet. Please check again."
            });
        }

        const previousOrderId = verifiedPayments.get(razorpay_payment_id);

        if (previousOrderId && previousOrderId !== order.id) {
            throw makeHttpError(409, "This payment has already been used for another order.");
        }

        order.status = "paid";
        order.paymentId = razorpay_payment_id;
        order.paymentMethod = payment.method || null;
        order.paidAt = new Date().toISOString();

        verifiedPayments.set(razorpay_payment_id, order.id);

        res.json({
            verified: true,
            orderId: order.id,
            paymentId: order.paymentId,
            status: order.status,
            order: publicOrder(order)
        });
    } catch (error) {
        console.error("Payment verification failed:", error.message);

        res.status(error.status || 500).json({
            verified: false,
            error: error.status
                ? error.message
                : "Could not verify payment. Please retry."
        });
    } finally {
        if (order) order.verifying = false;
    }
});

// --------------------------------------------------
// UPI QR PAYMENTS (Razorpay QR Codes API)
// A fixed-amount, single-use QR is created for the server-calculated
// total. The server then asks Razorpay whether a matching captured
// payment arrived. The browser never reports success itself.
// NOTE: QR Codes must be enabled on your Razorpay account. If creation
// fails, the checkout page falls back to Razorpay's own UPI window.
// Requires Node.js 18+ (built-in fetch).
// --------------------------------------------------

const QR_LIFETIME_SECONDS = 600;
const RZP_API = "https://api.razorpay.com/v1";
const RZP_AUTH = "Basic " + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");

async function rzpRequest(method, path, body) {
    if (typeof fetch !== "function") {
        throw makeHttpError(500, "This server needs Node.js 18 or newer for UPI QR payments.");
    }

    const response = await fetch(RZP_API + path, {
        method,
        headers: { Authorization: RZP_AUTH, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
    });

    let data = {};
    try { data = await response.json(); } catch (error) { /* empty body */ }

    if (!response.ok) {
        const failure = makeHttpError(502, "Razorpay request failed.");
        failure.detail = data && data.error && data.error.description;
        throw failure;
    }

    return data;
}

app.post("/api/payment/create-qr", async (req, res) => {
    try {
        const body = req.body || {};
        const { items, subtotalPaise, totalPaise } = normaliseCart(body.items);
        const shipping = validateShipping(body.shipping);
        const closeBy = Math.floor(Date.now() / 1000) + QR_LIFETIME_SECONDS;

        let qr;
        try {
            qr = await rzpRequest("POST", "/payments/qr_codes", {
                type: "upi_qr",
                name: "Luxeora Jewels",
                usage: "single_use",
                fixed_amount: true,
                payment_amount: totalPaise,
                description: "Jewellery order",
                close_by: closeBy,
                notes: { store: "Luxeora Jewels" }
            });
        } catch (error) {
            console.error("QR creation failed:", error.detail || error.message);
            throw makeHttpError(
                501,
                "UPI QR isn't available right now. Use the \"Pay with UPI app / ID\" button instead."
            );
        }

        if (!qr || !qr.id || typeof qr.image_url !== "string") {
            throw makeHttpError(501, "UPI QR isn't available right now. Use the \"Pay with UPI app / ID\" button instead.");
        }

        const orderId = "lxqr_" + crypto.randomBytes(12).toString("hex");

        orders.set(orderId, {
            id: orderId,
            receipt: orderId,
            qrId: qr.id,
            items,
            subtotalPaise,
            deliveryPaise: DELIVERY_PAISE,
            amount: totalPaise,
            currency: "INR",
            shipping,
            status: "pending",
            paymentId: null,
            paymentMethod: null,
            verifying: false,
            createdAt: new Date().toISOString(),
            expiresAt: closeBy * 1000
        });

        res.status(201).json({
            orderId,
            imageUrl: qr.image_url,
            amount: totalPaise,
            currency: "INR",
            expiresAt: closeBy * 1000,
            summary: {
                subtotal: subtotalPaise / 100,
                delivery: DELIVERY_PAISE / 100,
                discount: 0,
                total: totalPaise / 100
            },
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPricePaise / 100,
                lineTotal: item.lineTotalPaise / 100
            }))
        });
    } catch (error) {
        console.error("Create QR failed:", error.message);
        res.status(error.status || 500).json({
            error: error.status ? error.message : "Unable to create the QR code. Please try again."
        });
    }
});

app.get("/api/payment/qr-status/:orderId", async (req, res) => {
    let order = null;

    try {
        order = orders.get(req.params.orderId);

        if (!order || !order.qrId) {
            throw makeHttpError(404, "QR order not found.");
        }

        if (order.status === "paid") {
            return res.json({ paid: true, order: publicOrder(order) });
        }

        if (order.status === "cancelled") {
            return res.json({ paid: false, state: "expired" });
        }

        if (order.verifying) {
            return res.json({ paid: false, state: "checking" });
        }

        order.verifying = true;

        const data = await rzpRequest(
            "GET",
            `/payments/qr_codes/${encodeURIComponent(order.qrId)}/payments?count=10`
        );

        // Only a captured payment for exactly the expected amount counts.
        const payment = (data.items || []).find(item =>
            item.status === "captured" &&
            item.amount === order.amount &&
            item.currency === order.currency
        );

        if (payment) {
            const previousOrderId = verifiedPayments.get(payment.id);

            if (previousOrderId && previousOrderId !== order.id) {
                throw makeHttpError(409, "This payment has already been used for another order.");
            }

            order.status = "paid";
            order.paymentId = payment.id;
            order.paymentMethod = payment.method || "upi";
            order.paidAt = new Date().toISOString();
            verifiedPayments.set(payment.id, order.id);

            return res.json({ paid: true, order: publicOrder(order) });
        }

        const expired = Date.now() > order.expiresAt + 5000;
        res.json({ paid: false, state: expired ? "expired" : "waiting" });
    } catch (error) {
        console.error("QR status check failed:", error.detail || error.message);
        res.status(error.status === 404 ? 404 : 500).json({
            paid: false,
            error: error.status === 404 ? error.message : "Could not check the payment. Please retry."
        });
    } finally {
        if (order) order.verifying = false;
    }
});

// Best-effort: close an unused QR when the customer switches method.
app.post("/api/payment/qr-close", async (req, res) => {
    const order = orders.get(String((req.body || {}).orderId || ""));

    if (order && order.qrId && order.status === "pending") {
        order.status = "cancelled";
        try {
            await rzpRequest("POST", `/payments/qr_codes/${encodeURIComponent(order.qrId)}/close`);
        } catch (error) {
            console.error("QR close failed:", error.detail || error.message);
        }
    }

    res.json({ ok: true });
});

// Order status endpoint for the "check payment status" retry.
// It does not authenticate customers: demo only, not for production.
app.get("/api/payment/order/:orderId", (req, res) => {
    const order = orders.get(req.params.orderId);

    if (!order) {
        return res.status(404).json({ error: "Order not found." });
    }

    if (order.status === "paid") {
        return res.json(publicOrder(order));
    }

    res.json({
        id: order.id,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        createdAt: order.createdAt,
        paidAt: null
    });
});

// Avoid leaking internal errors.
app.use((error, req, res, next) => {
    console.error("Unexpected error:", error.message);
    res.status(error.status || 500).json({
        error: error.status === 400
            ? "The request could not be read."
            : "An unexpected server error occurred."
    });
});

app.listen(PORT, () => {
    console.log(`Luxéora backend running at http://localhost:${PORT}`);
    console.log(`Frontend allowed: ${ALLOWED_ORIGINS.join(", ")}`);
});