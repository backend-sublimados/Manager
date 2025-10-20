// 📦 Sublimados F&B Manager - Backend
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// 🔗 Conexión a MongoDB (Render usará tu variable MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error de conexión:", err));

// 📋 Modelo de Pedido
const Pedido = mongoose.model("Pedido", new mongoose.Schema({
  cliente: String,
  total: Number,
  sena: Number,
  resto: Number
}));

// 🏠 Ruta principal
app.get("/", (req, res) => res.send("Servidor funcionando correctamente ✅"));

// ➕ Guardar pedido
app.post("/api/pedidos", async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.json({ mensaje: "Pedido guardado correctamente", pedido });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el pedido" });
  }
});

// 📄 Listar pedidos
app.get("/api/pedidos", async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐 Servidor activo en puerto ${PORT}`));
