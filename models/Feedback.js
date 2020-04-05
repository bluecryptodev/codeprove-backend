const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
    {
        user_id: {type: String, required: false},
        user_name: {type: String, required: false},
        user_email: { type: String, required: false },
        lectureitem_id: { type: String, required: false },
        lectureitem_name: { type: String, required: false },
        feedback: { type: String, requried: false }
    },
    {
        timestamps: true
    }
);

const Feedbacks = mongoose.model('feedbacks', feedbackSchema);
module.exports = Feedbacks;