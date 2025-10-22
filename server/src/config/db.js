import mongoose from "mongoose";

let isConnected = false; // Para recordar el estado de la conexión

export const connectDB = async () => {
  if (isConnected) {
    console.log("🔁 Ya conectado a MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = !!db.connections[0].readyState;
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error con la conexión a MongoDB:", error.message);
    throw new Error("No se pudo conectar a la base de datos");
  }
};