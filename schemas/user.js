const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
  email: { type: String, required: true, unique: true }, 
  fullName: { type: String, default: "" }, 
  avatarUrl: { type: String, default: "" }, 
  status: { type: Boolean, default: false }, 
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, 
  loginCount: { type: Number, default: 0, min: 0 }, 
}, {
  timestamps: true, 
});

module.exports = mongoose.model('User', userSchema);
