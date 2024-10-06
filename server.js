const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log the Mongo URI for debugging
console.log("Mongo URI:", process.env.MONGO_URI);

// Middleware
app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define a Product schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

// Routes

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Add a new product
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error adding product' });
    }
});

// Update a product
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product' });
    }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
