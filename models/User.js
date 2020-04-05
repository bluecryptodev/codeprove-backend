const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        username: { type: String, required: false},
        password: {type: String, required: false},
        email: { type: String, required: false },
        phone_number: {type: String, required: false},
        course_list: {type: Array, required: false},
        lecture_list: {type: Array, required: false},
        lecture_content_list: {type: Array, required: false},
        image: {type: String, required: false},
        bookmark_list: {type: Array, required: false},
        doubts_list: {type: Array, required: false},
        user_level: {type: String, required: false},
        google_id: {type: String, required: false},
        event_list: {type: Array, required: false},
        login_flg: {type: Boolean, required: false},
        login_info: {type: Object, required: false}
    },
    {
        timestamps: true
    }
);

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;