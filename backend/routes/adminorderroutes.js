const express = require("express");
const Order = require("../models/order");
const { protect, admin } = require("../middleware/authMiddleware"); // ✅ Fixed import case
const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all orders (admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");

    if (order) {
      // 🛠 Add your logs here:
      console.log("🚨 Incoming status:", req.body.status);
      console.log("🚨 Incoming isDelivered:", req.body.isDelivered);

      order.status = req.body.status || order.status;

      if (typeof req.body.isDelivered === "boolean") {
        order.isDelivered = req.body.isDelivered;
        order.deliveredAt = req.body.isDelivered ? Date.now() : null;
      } else if (
        typeof req.body.status === "string" &&
        req.body.status.trim().toLowerCase() === "delivered"
      ) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      console.log("After save:", updatedOrder.isDelivered);

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();
    res.json({ message: "Order removed successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
