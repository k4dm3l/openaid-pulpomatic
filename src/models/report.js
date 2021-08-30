import mongoose from 'mongoose';

const reportSchema = mongoose.Schema({
  identifier: {
    type: String,
    unique: true,
    required: true,
  },
  report: [],
}, {
  timestamp: true,
});

const reportModel = mongoose.model('reports', reportSchema);

export default reportModel;
