const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lectureItemSchema = new Schema(
    {
        lecture_id: { type: String, required: false },
        lecture_name: { type: String, required: false },
        course_id: { type: String, required: false },
        title: { type: String, required: false },
        type: { type: String, required: false },
        url: { type: String, required: false },
        filename: { type: Object, requried: false },
        description: { type: String, required: false},
        in_format: { type: String, required: false },
        out_format: { type: String, required: false },
        notes: { type: String, required: false},
        contain: {type: String, required: false},
        sample_input: { type: Array, required: false },
        sample_output: { type: Array, required: false},
        sample_code: {type: Object, required: false},
        test_input: {type: Array, requried: false},
        test_output: {type: Array, requried: false},
        check_input: {type: Array, required: false},
        check_output: {type: Array, required: false},
        score: {type: Number, requried: false},
        hint: {type: String, required: false},
        bookmark: {type: Array, requried: false},
        order_number: {type: Number, required: false}
    },
    {
        timestamps: true
    }
);

const LectureItem = mongoose.model('lectureItem', lectureItemSchema);
module.exports = LectureItem;
