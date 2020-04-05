const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        level_name: { type: String, required: false},
        course_id: {type: String, required: false},
        email: { type: String, required: false },
        phone_number: {type: String, required: false},
        image: {type: String, required: false}
    },
    {
        timestamps: true
    }
);

const Users = mongoose.model('admin_users', usersSchema);
module.exports = Users;