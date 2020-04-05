const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogsSchema = new Schema(
    {
        title: { type: String, required: false},
        content: {type: String, required: false},
        image: {type: String, required: false}
    },
    {
        timestamps: true
    }
);

const Blogs = mongoose.model('blog', blogsSchema);
module.exports = Blogs;