import Sales from "../models/Sale.js";
import express from "express";
import Product from "../models/Product.js";
import SalesSummary from "../models/SalesSummary.js";
import ProductSale from "../models/ProductSale.js";

const router = express.Router();
// Obtener todas las ventas
router.get("/", async (req, res) => {
  const sales = await Sales.find();
  res.json(sales);
});

// Obtener venta por ID
router.get("/:id", async (req, res) => {
  const sale = await Sales.findById(req.params.id);
  res.json(sale);
});

// Crear venta
router.post("/", async (req, res) => {
  try{
     const newSale = new Sales(req.body);

  if(!newSale.products || newSale.products.length === 0) {
    return res.status(400).json({ message: "La venta debe incluir al menos un producto" });
  }


  // Actualizar el sumario de ventas
  let summary = await SalesSummary.findOne().sort({ month: -1 }).limit(1);
  if (!summary) {
    summary = new SalesSummary({ totalAmount: 0, totalQuantity: 0 });
  }
  let saleTotalAmount = 0;
  let saleTotalQuantity = 0;
  for (const item of newSale.products) {
    saleTotalAmount += item.unitPrice * item.quantity;
    saleTotalQuantity += item.quantity;
  }
  newSale.totalAmount = saleTotalAmount;

  summary.totalRevenue += saleTotalAmount;
  summary.totalSales += saleTotalQuantity;
  await summary.save();

  // Actualizar el stock de los productos vendidos
  for (const item of newSale.products) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
      await product.save();
    }
  }

  // Aumentar las ventas del producto en ProductSale
  const now = new Date();
  const monthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  let productSale = await ProductSale.findOne({ month: monthString });

  if (!productSale) {
    productSale = new ProductSale({
      month: monthString,
      productId: [],
    });
  }

  for (const item of newSale.products) {
    const existing = productSale.products.find(
      (p) => p.productId && p.productId.toString() === item.productId.toString() 
    );
    console.log("existing: ", existing);

    if (existing) {
      existing.count += item.quantity;
      existing.unitPrice = item.unitPrice;

    } else {
      productSale.products.push({
        productId: item.productId,
        count: item.quantity,
        unitPrice: item.unitPrice
      });
    }
  }
  await productSale.save();
  await newSale.save();
  res.status(201).json(newSale);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear la venta" });
  }
});

export default router;