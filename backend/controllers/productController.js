const Product = require('../models/Product'); // adjust path as needed
const fs = require('fs');
const path = require('path');

// Get all products with optional search and pagination
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, brand, page = 1, limit = 500 } = req.query;
    const query = {};

    if(keyword){
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    if(category) query.category = category;
    if(brand) query.brand = brand;

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);

    res.json({ products, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving products' });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('compatibility', 'name brand');
    if(!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving product' });
  }
};

// Add new product (admin level - here no admin role implemented but can be extended)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, brand, category, stock, long_desc } = req.body; // <-- add long_desc here
    const compatibility = [];
    // Create folder for images
    const folderName = `images/${name}`;
    const imagesDir = path.join(__dirname, '..', folderName);
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    // Save images
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, idx) => {
        const ext = path.extname(file.originalname) || '.jpg';
        const imgName = `${idx + 1}${ext}`;
        const imgPath = path.join(imagesDir, imgName);
        fs.writeFileSync(imgPath, file.buffer);
        // Use double backslash in the returned path
    const relativePath = folderName.replace(/\//g, '\\') + '\\' + imgName;
    imagePaths.push(`\\${relativePath}`);
      });
    }
    // Create product
    const product = new Product({
      name,
      description,
      long_desc, // <-- save long_desc here
      price,
      brand,
      category,
      compatibility,
      images: imagePaths,
      stock: stock || 0
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, brand, category, compatibility, images, stock } = req.body;
    Object.assign(product, { name, description, price, brand, category, compatibility, images, stock });
    await product.save();

    res.json(product);
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Remove images and folder
    if (product.images && product.images.length > 0) {
      // Images are stored as: \images\ProductName\1.jpg
      const firstImage = product.images[0];
      // Get folder path
      const match = firstImage.match(/\\images\\([^\\]+)\\/);
      const folderName = match ? match[1] : null;
      if (folderName) {
        const folderPath = path.join(__dirname, '..', 'images', folderName);
        if (fs.existsSync(folderPath)) {
          fs.rmSync(folderPath, { recursive: true, force: true });
        }
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product and images deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// Search products by query
exports.searchProducts = async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    if (!q.trim()) {
      return res.json({ products: [] });
    }
    const allProducts = await Product.find({});
    const products = allProducts.filter(product => {
      return (
        (product.name && product.name.toLowerCase().includes(q)) ||
        (product.brand && product.brand.toLowerCase().includes(q)) ||
        (product.description && product.description.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q))
      );
    });

    // Remove duplicates by _id
    const uniqueProducts = [];
    const seen = new Set();
    for (const prod of products) {
      const id = prod._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        uniqueProducts.push(prod);
      }
    }

    res.json({ products: uniqueProducts });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle stock status of a product
exports.toggleStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Toggle stock between 0 and 1
    product.stock = product.stock > 0 ? 0 : 1;
    await product.save();

    res.json({ message: 'Stock status updated', stock: product.stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error toggling stock' });
  }
};

// Admin: update only name and price
exports.updateNamePrice = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (typeof name === 'undefined' && typeof price === 'undefined') {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (typeof name !== 'undefined') {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'Invalid name' });
      }
      product.name = name.trim();
    }

    if (typeof price !== 'undefined') {
      const p = Number(price);
      if (!Number.isFinite(p) || p < 0) {
        return res.status(400).json({ message: 'Invalid price' });
      }
      product.price = p;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('updateNamePrice error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};