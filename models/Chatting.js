const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        title: { type: String, required: false},
        description: {type: String, required: false},
        course_id: {type: String, required: false},
        course_name: {type: String, required: false},
        lecture_id: {type: String, required: false},
        lectureitem_id: {type: String, required: false},
        lectureitem_name: {type: String, required: false},
        lectureitem_type: {type: String, required: false},
        user_id: {type: String, required: false},
        user_name: { type: String, required: false },
        admin_id: { type: String, required: false },
        admin_name: { type: String, required: false },
        room_id: { type: String, required: false },
        chat_user_id: { type: String, required: false },
        chat_admin_id: { type: String, required: false },
        course_deadline: {type: String, required: false},
        last_message: {type: String, required: false},
        doubte_rate: {type: Number, required: false},
        solve_flg: {type: Boolean, required: false},
        view_flg: {type: Boolean, required: false},
        admin_view_flg: {type: Boolean, required: false},
        join_flg: {type: Boolean, required: false},
        admin_join_flg: {type: Boolean, required: false},
        rate_flg: {type: String, required: false}
    },
    {
        timestamps: true
    }
);

const Users = mongoose.model('doubt_chatting', usersSchema);
module.exports = Users;