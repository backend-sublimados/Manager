// server.js - Express + Mongoose backend
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/el_emprendedor';

// Models
const Producto = require('./models/Producto');
const Pedido = require('./models/Pedido');

mongoose.connect(MONGO, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('MongoDB error', err));

// --- Auth (simple)
/*
  For production use JWT and strong password hashing.
  This simple route checks ADMIN_USER/ADMIN_PASS from .env
*/
app.post('/api/login', (req,res)=>{
  const { user, pass } = req.body;
  if(user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS){
    return res.json({ ok:true });
  }
  res.status(401).json({ ok:false, message:'Credenciales invalidas' });
});

// --- Productos
app.get('/api/productos', async (req,res)=>{
  const prods = await Producto.find().sort({ nombre:1 });
  res.json(prods);
});

app.post('/api/productos', async (req,res)=>{
  const { nombre, precio, descripcion } = req.body;
  const p = new Producto({ nombre, precio, descripcion, vendidos:0 });
  await p.save();
  res.json(p);
});

app.delete('/api/productos/:id', async (req,res)=>{
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

// --- Pedidos
app.get('/api/pedidos', async (req,res)=>{
  const pedidos = await Pedido.find().sort({ createdAt:-1 });
  res.json(pedidos);
});

app.post('/api/pedidos', async (req,res)=>{
  const { cliente, total, senia } = req.body;
  const restante = (Number(total) || 0) - (Number(senia) || 0);
  const pedido = new Pedido({ cliente, total, senia, restante, estado:'Pendiente', urgente:false });
  await pedido.save();
  res.json(pedido);
});

app.delete('/api/pedidos/:id', async (req,res)=>{
  await Pedido.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

// --- Top 3 (basic)
app.get('/api/top3', async (req,res)=>{
  // aggregate by vendidos  
  const top = await Producto.find().sort({ vendidos:-1 }).limit(3);
  res.json(top);
});

app.listen(PORT, ()=> console.log('Server running on', PORT));
