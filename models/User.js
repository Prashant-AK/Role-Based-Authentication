const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'superAdmin'],
    },
  },
  { timestamps: true }
);

module.exports = model('users', UserSchema);
