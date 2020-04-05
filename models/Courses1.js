const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coursesSchema = new Schema(
    {
        title: { type: String, required: false },
        description: {type: String, required: false},
        intro_video_id: { type: String, required: false },
        reivew_video_id: { type: String, required: false },
        image: { type: String, requried: false },
        remain_days: { type: String, required: false},
        price: { type: Array, required: false },
        json_file: {type: String, required: false},
        next_json_file: {type: String, required: false},
        json_file_uploaded: {type: Boolean, required: false},
        batch_members: {type: Array, required: false},
        level_number: {type: Number, required: false},
        course_comments: {type: Array, required: false}
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model('courses_list', coursesSchema);
module.exports = Course;