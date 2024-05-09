const express = require('express');
const router = express.Router();
const userSchema = require('../models/users.model');
const productSchema = require('../models/product.model');
const bcrypt = require('bcrypt');

router.post('/api/v1/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username in the database
    const user = await userSchema.findOne({ username });
    
    // If user not found, return an error
    if (!user) {
      return res.status(401).json({ status: 401, message: '🛑 Invalid username or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an error
    if (!isPasswordValid) {
      return res.status(401).json({ status: 401, message: '🛑 Invalid username or password' });
    }

    // Check if user's role is "user" and status is 1
    if (user.role === 'user' && user.status === 1) {
      // If everything is correct, return success message and user data
      const productsByUser = await productSchema.find({ username: user.username });

        // Assuming userId is the field in productSchema representing the user's _id
        return res.status(200).json({ 
        status: 200, 
        message: '✅ Success', 
        user: {
            _id: user._id,
            username: user.username,
            name: user.name,
            role: user.role,
            status: user.status
        },
        products: productsByUser.map(product => ({
            productId: product._id,
            productName: product.product_name,
            price: product.price,
            amount: product.amount,
        })) 
    });

    } else if (user.role === 'user' && user.status == 0) {
      // If user's status is 0, return a message indicating waiting for admin approval
      return res.status(200).json({ status: 200, message: '🕓 รอแอดมินอนุมัติ...' });
    } else if (user.role === 'admin') {     
        // Return the JWT token and admin user data in the response
        return res.status(200).json({ 
          status: 200, 
          message: '✅ Welcome to ADMIN page', 
          user: {
            _id: user._id,
            username: user.username,
            name: user.name,
            role: user.role,
            status: user.status
          },
        });
    } else {
      // For other cases (e.g., role is not "user" or status is not 1), return an error
      return res.status(401).json({ status: 401, message: '🛑 Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ status: 500, message: '🛑 Internal server error' });
  }
});

module.exports = router;
