const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
    {
        title: {type: String, required: false},
        description: {type: String, required: false},
        start_date: { type: String, required: false },
        pay_type: { type: String, required: false },
        venue: { type: String, required: false },
        background_img: { type: String, requried: false },
        video_url: {type: String, required: false},
        registered_members: {type: Array, required: false}
    },
    {
        timestamps: true
    }
);

const Events = mongoose.model('events', eventSchema);
module.exports = Events;