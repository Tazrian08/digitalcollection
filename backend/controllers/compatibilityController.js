const Product = require('../models/Product');

// Check compatibility between two products by their ids
exports.checkCompatibility = async (req, res) => {
  try {
    const { product1Id, product2Id } = req.query;

    if(!product1Id || !product2Id){
      return res.status(400).json({ message: 'Two product IDs required' });
    }

    const product1 = await Product.findById(product1Id);
    const product2 = await Product.findById(product2Id);

    if(!product1 || !product2){
      return res.status(404).json({ message: 'Product(s) not found' });
    }

    // Check if product2 is in product1 compatibility list or vice versa
    const compatible = product1.compatibility.includes(product2Id) || product2.compatibility.includes(product1Id);

    res.json({ compatible });

  } catch(error){
    console.error(error);
    res.status(500).json({ message: 'Error checking compatibility' });
  }
};