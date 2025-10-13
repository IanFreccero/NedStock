import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/products.js";
import salesRoutes from "./routes/sales.js";
import salesSummaryRoutes from "./routes/salesSummary.js";
import productSalesRoutes from "./routes/productSales.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/sales-summary", salesSummaryRoutes);
app.use("/api/product-sales", productSalesRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server Running on port ${process.env.PORT}`);
});