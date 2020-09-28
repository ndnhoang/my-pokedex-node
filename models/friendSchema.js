const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
  fromUser: {
    type: Number,
    required: true,
  },
  destinationUser: {
    type: Number,
    required: true,
  },
  isFriendShip: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Friend', friendSchema);
