const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mesaageSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, requried: true }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model('Message', mesaageSchema);
module.exports = Message;