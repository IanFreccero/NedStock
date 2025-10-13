import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Obtener productos paginados cada 20
router.get("/page/:page", async (req, res) => { 
  const page = parseInt(req.params.page, 10) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();
    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener productos por categoría paginados cada 20
router.get("/category/:category/page/:page", async (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.params.page, 10) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const query = { category: category };
    const products = await Product.find(query).skip(skip).limit(limit);
    const total = await Product.countDocuments(query);
    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener productos con menos de 10 de stock
router.get("/low-stock", async (req, res) => {
  try {
    const products = await Product.find({ stockQuantity: { $lt: 10 } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

// Crear producto
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(newProduct);
});

// Crear múltiples productos
router.post("/bulk", async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    res.status(201).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar producto
router.patch("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;