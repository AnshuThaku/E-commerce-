const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const products = require("./data/product");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);
const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    const userID = createdUser._id;
    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: userID,
      };
    });

    await Product.insertMany(sampleProducts);

    console.log("🚀 Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding the data:", error.message);
    process.exit(1);
  }
};

seedData();
