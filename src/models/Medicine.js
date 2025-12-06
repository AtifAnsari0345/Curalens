import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dose: {
    type: String,
    required: false,
    default: 'As prescribed'
  },
  times: {
    type: [String],
    required: false,
    default: []
  },
  details: {
    type: Object,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accepted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;