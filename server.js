const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000; // You can change this port if needed

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/agrimart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a schema and model for accounts
const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    gender: String,
    doorNo: String,
    street: String,
    landmark: String,
    city: String,
    district: String,
    state: String,
    nationality: String
});

const Account = mongoose.model('Account', accountSchema);


// Endpoint to create a new account
app.post('/api/accounts', async (req, res) => {
    try {
        const newAccount = new Account(req.body);
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Check if email exists
app.get('/api/accounts/check-email/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const account = await Account.findOne({ email: email });
        if (account) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to check username and email
app.post('/api/checkUser', async (req, res) => {
    const { username, email } = req.body;
    const account = await Account.findOne({ username, email });
    if (account) {
        res.status(200).json({ exists: true });
    } else {
        res.status(404).json({ exists: false });
    }
});

// Endpoint to get account details of a signed-in user
app.post('/api/account', async (req, res) => {
    const { username, email } = req.body; // Retrieve username and email from the request
    const account = await Account.findOne({ username, email }); // Find the user by username/email
    if (account) {
        res.status(200).json(account); // Send back the account details
    } else {
        res.status(404).json({ message: 'Account not found' }); // If no account is found
    }
});


// Define cart schema
const cartSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productDescription: String,
    selectedQuantity: String,
    originalPrice: Number,
    discountedPrice: Number
});

// Create a model for Cart
const Cart = mongoose.model('Cart', cartSchema);

// Endpoint to add product to cart
app.post('/api/addToCart', async (req, res) => {
    const { username, email, productName, productImage, productDescription, selectedQuantity, originalPrice, discountedPrice } = req.body;

    try {
        const newCartItem = new Cart({
            username,
            email,
            productName,
            productImage,
            productDescription,
            selectedQuantity,
            originalPrice,
            discountedPrice
        });

        await newCartItem.save();
        res.status(201).json(newCartItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Endpoint to get cart details for a user
app.post('/api/getCart', async (req, res) => {
    const { username, email } = req.body;

    try {
        const cartItems = await Cart.find({ username, email });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Endpoint to remove a product from the cart
app.post('/api/removeFromCart', async (req, res) => {
    const { username, email, productName } = req.body;

    try {
        await Cart.findOneAndDelete({ username, email, productName });
        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Define orders schema
const orderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productDescription: String,
    selectedQuantity: String,
    originalPrice: Number,
    discountedPrice: Number,
    orderedDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true }
});

// Create a model for Orders
const Order = mongoose.model('Order', orderSchema);

// Endpoint to place an order
app.post('/api/placeOrder', async (req, res) => {
    const { username, email, productName, productImage, productDescription, selectedQuantity, originalPrice, discountedPrice } = req.body;

    const orderedDate = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(orderedDate.getDate() + 3);

    try {
        const newOrder = new Order({
            username,
            email,
            productName,
            productImage,
            productDescription,
            selectedQuantity,
            originalPrice,
            discountedPrice,
            orderedDate,
            deliveryDate
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Endpoint to get orders for a user
app.post('/api/getOrders', async (req, res) => {
    const { username, email } = req.body;

    try {
        const orders = await Order.find({ username, email });
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Endpoint to cancel an order
app.post('/api/cancelOrder', async (req, res) => {
    const { orderId } = req.body;

    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
