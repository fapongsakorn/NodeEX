const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    username:{type: String},
    product_id:{type: String, },
    product_name:{type: String,},
    price:{ type: Number ,},
    amount:{ type: Number,},
    totalprice:{ type: Number,},
},{
    timestamps :true,
});
module.exports = mongoose.model('orders', orderSchema);

