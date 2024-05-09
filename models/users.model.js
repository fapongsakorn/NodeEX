const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true},
  password: { type: String , required: true},
  name:{ type: String },
  role:{type: String, default: 'user'},
  status:{type: Number, default: '0'}
},{
  timestamps :true,
});

module.exports = mongoose.model('users', userSchema);