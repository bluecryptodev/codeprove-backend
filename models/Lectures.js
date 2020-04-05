const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lecturesSchema = new Schema(
    {
        course_id: {type: String, required: false},
        course_name: {type: String, required: false},
        level_number: {type: Number, required: false},
        order_number: {type: Number, required: false},
        title: { type: String, required: false },
        release_date: { type: String, required: false },
        deadline: { type: String, required: false },
        weightage: { type: String, requried: false },
        lecture_icon: {type: String, required: false},
        free_type: {type: String, required: false},
        color: {type: Object, required: false},
        total_score: {type: Number, required: false}
    },
    {
        timestamps: true
    }
);

const Lectures = mongoose.model('lectures', lecturesSchema);
module.exports = Lectures;