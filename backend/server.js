const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const chatRoutes = require('./routes/chatRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const curatedListRoutes = require('./routes/curatedList');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/curatedlist', curatedListRoutes); // ✅ no hyphen
app.use('/api/payments', paymentRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("API is running");
});

// DB Connection and server start
const PORT = process.env.PORT || 5002;

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected successfully');
      // ✅ Start server only after DB connection
      app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('⚠️  Exiting server due to DB failure');
      process.exit(1); // Stop server if DB is critical
    });
} else {
  console.log('⚠️  No MONGO_URI found, running without database');
  app.listen(PORT, () => {
    console.log(`⚠️  Server running on port ${PORT} without DB`);
  });
}
