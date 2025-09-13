require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve images statically
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/compatibility', require('./routes/compatibilityRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/ads', require('./routes/adRoutes'));
app.use('/api/quad-ads', require('./routes/quadAdRoutes'));

// Base Route
app.get('/', (req, res) => {
  res.send('Welcome to DigitalCollection E-commerce API');
});

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));