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

const allowedOrigins = [
  "https://neds-stock-client-9mo9.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Servidor Express activo en Vercel 🚀");
});

app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/sales-summary", salesSummaryRoutes);
app.use("/api/product-sales", productSalesRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port: ", process.env.PORT)
})