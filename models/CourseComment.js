const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        course_id: { type: String, required: false},
        user_id: {type: String, required: false},
        title: {type: String, required: false},
        content: {type: String, required: false},
        post_date: { type: String, required: false },
        image: {type: String, required: false},
        upload_file: {type: String, required: false},
        file_type: {type: String, required: false},
        comment_like: {type: Array, required: false},
        added_comment: {type: Array, required: false}        
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('course_comment', commentSchema);
module.exports = Comment;