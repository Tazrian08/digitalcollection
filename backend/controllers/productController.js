const Product = require('../models/Product');

// Get all products with optional search and pagination
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, brand, page = 1, limit = 20 } = req.query;
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
    const { name, description, price, brand, category, compatibility, images, stock } = req.body;
    const product = new Product({
      name, description, price, brand, category, compatibility, images, stock
    });
    await product.save();
    res.status(201).json(product);
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating product' });
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
    if(!product) return res.status(404).json({ message: 'Product not found' });

    await product.remove();
    res.json({ message: 'Product removed' });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};