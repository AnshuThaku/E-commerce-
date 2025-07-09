// ──────────────────────────────────────────────────────────────────────
// 📦 Module Imports
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// 🧩 Route Imports
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/ProductRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminOrderRoutes = require("./routes/adminorderroutes");

const adminProductRoutes = require("./routes/productAdminRoutes");

// ──────────────────────────────────────────────────────────────────────
// 🌿 Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────────────────────────────
// 🔌 Database Connection
connectDB().catch((error) => {
  console.error("❌ Database connection failed:", error);
  process.exit(1);
});

// ──────────────────────────────────────────────────────────────────────
// 🧰 Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// 🧾 Logging incoming requests
app.use((req, res, next) => {
  console.log(`🚀 ${req.method} ${req.url}`);
  next();
});

if (process.env.NODE_ENV === "production") {
  app.use(limiter);
}

// ──────────────────────────────────────────────────────────────────────
// 🛣️ Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/admin/products", adminProductRoutes);

app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

// ──────────────────────────────────────────────────────────────────────
// 🚀 Start Server
const server = app.listen(PORT, () => {
  console.log(`🌍 Server running on port ${PORT}`);
});

// 🛑 Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await connectDB.disconnect();
  server.close(() => {
    console.log("✅ Server closed gracefully.");
    process.exit(0);
  });
});
