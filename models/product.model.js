const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    username:{type: String, },
    product_name:{type: String,},
    price:{ type: Number ,},
    amount:{ type: Number,},
},{
    timestamps :true,
});
module.exports = mongoose.model('products', productSchema);