const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        username: { type: String, required: false},
        first_name: {type: String, required: false},
        last_name: {type: String, required: false},
        password: {type: String, required: false},
        email: { type: String, required: false },
        phone_number: {type: String, required: false},
        image: {type: String, required: false},
        user_level: {type: String, required: false}
    },
    {
        timestamps: true
    }
);

const Users = mongoose.model('admin_users', usersSchema);
module.exports = Users;