import { Schema, model } from "mongoose";

const productSaleSchema = new Schema(
  {products:[
    {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    count: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 }
    }
  ],
  month: { type: String, required: true }}, // Formato 'YYYY-MM'
  { timestamps: true }
);

const ProductSale = model("ProductSale", productSaleSchema);
export default ProductSale;
