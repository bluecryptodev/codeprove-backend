const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supportChat = new Schema(
    {
        email: { type: String, required: false},
        phone: { type: String, required: false},
        username: { type: String, required: false},
        user_id: { type: String, required: false },
        admin_id: { type: String, required: false },
        room_id: { type: String, required: false },
        view_flg: {type: Boolean, required: false},
        admin_view_flg: {type: Boolean, required: false},
        join_flg: {type: Boolean, required: false},
        admin_join_flg: {type: Boolean, required: false},
    },
    {
        timestamps: true
    }
);

const SupportChat = mongoose.model('support_chatting', supportChat);
module.exports = SupportChat;