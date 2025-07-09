const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    image: String,
    price: String,
    size: String,
    color: String,

    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
); // Disable automatic _id generation for cart items

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
      default: function () {
        return `guest_${Date.now()}`;
      },
    },
    products: [cartItemSchema],
  },
  { timestamps: true }
);

// Add custom validation for user or guestId
CartSchema.pre("validate", function (next) {
  if (!this.user && !this.guestId) {
    this.invalidate("guestId", "Either user or guestId is required");
  }
  next();
});

module.exports = mongoose.model("Cart", CartSchema);
