const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coursesSchema = new Schema(
    {
        title: { type: String, required: false },
        preivew_title: {type: String, required: false},
        type: { type: String, required: false },
        faculty: { type: Object, required: false },
        course_curriculum: { type: Array, requried: false },
        career_prospects: { type: Object, required: false},
        features: { type: Array, required: false },
        testimonials: { type: Object, required: false },
        FAQs: { type: Array, required: false},
        remain_days: {type: Number, required: false},
        course_comments: { type: Array, required: false },
        batch_members: { type: Array, required: false},
        language_support: {type: Array, required: false},
        support_rang: {type: String, required: false}
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model('courses', coursesSchema);
module.exports = Course;