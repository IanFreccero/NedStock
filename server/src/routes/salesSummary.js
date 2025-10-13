import SalesSummary from "../models/SalesSummary.js";
import express from "express";

const router = express.Router();

// Obtener los últimos 12 resúmenes de ventas (1 año)
router.get("/", async (req, res) => {
  const salesSummaries = await SalesSummary.find().sort({ month: -1 }).limit(12); // Ordenar por mes descendente y limitar a 12
  res.json(salesSummaries);
})

// Crear un nuevo saleSummary
router.post("/", async (req, res) => {
  try {
    const monthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const newSummary = new SalesSummary({
      totalSales: 0,
      totalRevenue: 0,
      month: monthString
    });
    const savedSummary = await newSummary.save();
    res.status(201).json(savedSummary);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el resumen de ventas" });
  }
});

export default router;