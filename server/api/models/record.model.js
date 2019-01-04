const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positiveNumber = (distance) => distance > 0;

const RecordSchema = new Schema({
  name: {
    type: String,
  },
  city: {
    type: String,
  },
  difference: {
    type: String,
    default: '0'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
}, {
  timestamp: true,
});

module.exports = mongoose.model('Record', RecordSchema);
