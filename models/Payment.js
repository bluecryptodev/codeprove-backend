const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentList = new Schema(
    {
        user_id: { type: String, required: false },
        user_email: { type: String, required: false },
        invoice_number: { type: String, required: false },
        description: { type: String, required: false },
        pay_amount: { type: Number, required: false },
        balance: { type: Number, required: false }
    },
    {
        timestamps: true
    }
);

const PaymentList = mongoose.model('payment_list', paymentList);
module.exports = PaymentList;