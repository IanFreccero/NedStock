import { Schema, model } from "mongoose";

const salesSummarySchema = new Schema(
  {
    totalSales: { type: Number, required: true, min: 0 },
    totalRevenue: { type: Number, required: true, min: 0 },
    month: String // Formato 'YYYY-MM'
  },
  { timestamps: true }
);

const SalesSummary = model("SalesSummary", salesSummarySchema);
export default SalesSummary;
