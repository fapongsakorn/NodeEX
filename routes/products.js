var express = require('express');
const { default: mongoose } = require('mongoose');
var router = express.Router();
var multer = require('multer')
var productSchema =  require('../models/product.model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/product')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '_' + file.originalname)
    }
})
const upload = multer({ storage: storage })

router.get('/api/v1/product', async function(req, res, next) {
    try{
        let product = await productSchema.find();
        return res.status(200).send({
            product: product,
            message: "✅ Successfully found",
            success: true,
        });
    }catch(err){
        return res.status(500).send({
            message: "🛑 server error",
            success: false,
        });
    }
});

router.get('/api/v1/product/:id', async function(req, res, next) {
    try {
        const id = req.params.id;
        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ID",
                success: false,
                error: "🛑 id is not a valid ObjectId",
            });
        }
        // Find the product by ID
        const product = await productSchema.findById(id);
        // If product not found, return an error
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
            });
        }
        // If product found, return it
        return res.status(200).json({
            product: product,
            message: "✅ Successfully found",
            success: true,
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({
            message: "🛑 Server error",
            success: false,
        });
    }
});

router.post('/api/v1/product', upload.single('image'), async function(req, res, next) {
    try{
        const{ username, product_name , price, amount } = req.body;
        let newProduct = new productSchema({
            username,
            product_name : product_name,
            price : price,
            amount : amount,
            file: req.file.filename
        });
        let save = await newProduct.save();
        res.status(200).send(save);
        return res.status(201).send({
            data: product,
            message: '✅ Product saved successfully',
            success: true,
        });
    } catch(err){
        return res.status(500).send({
            message: "🛑 Create product failed",
            success: false,
        });
    }
});

/* PUT */
router.put('/api/v1/product/:id', async function (req, res, next) {
    try {
      const { username, product_name, price, amount } = req.body;

      console.log(username, product_name, price, amount);
  
      // Check if the provided ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: 'Invalid ID',
          success: false,
          error: '🛑 id is not a valid ObjectId',
        });
      }
  
      // Find the product by ID and update it
      const update = await productSchema.findByIdAndUpdate(req.params.id, { username, product_name, price, amount }, { new: true });
  
      // If product not found, return a 404 error
      if (!update) {
        return res.status(404).json({
          message: '🛑 Product not found',
          success: false,
        });
      }
  
      // Return the updated product
      return res.status(200).json({
        data: update,
        message: '✅ Product updated successfully',
        success: true,
      });
    } catch (error) {
      // Handle any errors that occur during the update process
      console.error('Error during update:', error);
      return res.status(500).json({
        message: '🛑 Update failed',
        success: false,
        error: error.toString(),
      });
    }
  });
  

/* DELETE */
router.delete('/api/v1/product/:id', async function (req, res, next) {
  try {
    
    let delete_product = await productSchema.findByIdAndDelete(req.params.id)

    res.status(200).send(delete_product);
  } catch (error) {
    res.status(500).send(error.toString())
  }
});

module.exports = router;