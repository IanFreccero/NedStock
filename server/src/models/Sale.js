import { Schema, model } from "mongoose";

const saleSchema = new Schema(
  {
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
      },
    ],
    timestamp: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Sale = model("Sale", saleSchema);
export default Sale;
