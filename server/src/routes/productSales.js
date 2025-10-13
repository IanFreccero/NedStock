import ProductSale from "../models/ProductSale.js";
import express from "express";

const router = express.Router();

// Obtener los 10 productos más vendidos por cantidad de ventas
router.get("/top-sales", async (req, res) => {
  try {
    // Obtener el último mes registrado
    const lastMonthDoc = await ProductSale.findOne().sort({ month: -1 }).limit(1);
    if (!lastMonthDoc) return res.json([]);

    const lastMonth = lastMonthDoc.month;

    // Desagregar para obtener los 10 productos más vendidos por cantidad
    const topProducts = await ProductSale.aggregate([
      { $match: { month: lastMonth } },
      { $unwind: "$products" },
      { $group: {
          _id: "$products.productId",
          totalCount: { $sum: "$products.count" }
        }
      },
      { $sort: { totalCount: -1 } },
      { $limit: 10 },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          totalCount: 1
        }
      }
    ]);

    // Añadir la categoria de cada producto al resultado
    const Product = ProductSale.model('Product');
    for (const p of topProducts) {
      const prod = await Product.findById(p.productId).select('category');
      p.category = prod ? prod.category : null;
    }
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
// Obtener los 10 productos más vendidos por total de precio
router.get("/top-revenue", async (req, res) => {
  try {
    // Obtener el último mes registrado
    const lastMonthDoc = await ProductSale.findOne().sort({ month: -1 }).limit(1);
    if (!lastMonthDoc) return res.json([]);


    const lastMonth = lastMonthDoc.month;

    // Desagregar para obtener los 10 productos con mayor revenue (precio * cantidad)
    const topRevenueProducts = await ProductSale.aggregate([
      { $match: { month: lastMonth } },
      { $unwind: "$products" },
      { $group: {
          _id: "$products.productId",
          totalRevenue: { $sum: { $multiply: ["$products.unitPrice", "$products.count"] } }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          totalRevenue: 1
        }
      }
    ]);

    // Añadir la categoria de cada producto al resultado
    const Product = ProductSale.model('Product');
    for (const p of topRevenueProducts) {
      const prod = await Product.findById(p.productId).select('category');
      p.category = prod ? prod.category : null;
    }

    res.json(topRevenueProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas los productSales
router.get("/", async (req, res) => {
  const sales = await ProductSale.find();
  res.json(sales);
});

export default router;
