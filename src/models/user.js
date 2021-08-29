import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamp: true,
});

const userModel = mongoose.model('users', userSchema);

export default userModel;
