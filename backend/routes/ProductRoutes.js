const express = require("express");
const Product = require("../models/product");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();
const mongoose = require("mongoose");

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes, // ✅ Updated "size" to "sizes" for consistency
      colors,
      collections, // ✅ Changed "collection" to "collections" to match frontend data
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route PUT /api/products/:id
// @desc Update a product by ID
// @access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product deleted successfully" });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/products
// @desc Get all products with query filters
// @access Public
router.get("/", async (req, res) => {
  try {
    const {
      collections,
      sizes,
      colors,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};
    if (collections && collections.toLowerCase() !== "all")
      query.collections = collection;
    if (category && category.toLowerCase() !== "all") query.category = category;
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) query.brand = { $in: brand.split(",") };
    if (sizes) query.sizes = { $in: size.split(",") };
    if (colors) query.colors = { $in: [color] };
    if (gender) query.gender = gender;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {}; //
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 }; // ✅ More reliable popularity metric
          break;
        default:
          break;
      }
    }

    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/products/best-sellers
// @desc Get best-selling products with high ratings
// @access Public

router.get("/best-seller", async (req, res) => {
  try {
    const bestSellers = await Product.findOne().sort({ rating: -1 });
    if (bestSellers) {
      res.json(bestSellers);
    } else {
      res.status(404).json({ message: "No best sellers found" });
    }
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/products/new-arrivals
// @desc Get new arrivals sorted by creation date
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);

    res.json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/products/:id
// @desc Get a product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/products/similar/:id
// @desc Get similar products based on category
// @access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: new mongoose.Types.ObjectId(id) },
      gender: product.gender,
      category: product.category,
    }).limit(4); // Limit to 4 similar products

    res.json(similarProducts);
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
