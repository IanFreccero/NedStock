import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: [
        "Cosmética-Facial",
        "Cosmética-Corporal",
        "Cuidado-Capilar",
        "Coloración-y-Tintura",
        "Uñas-y-Manos",
        "Perfumería",
        "Instrumental-de-Peluquería",
        "Cuidado-Personal",
        "Higiene-Bucal",
        "Pañales",
        "Servilletas",
        "Bebés",
        "Otros",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);
export default Product;
