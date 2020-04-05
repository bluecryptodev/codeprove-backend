const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        batch_name: { type: String, required: false},
        members: {type: Array, required: false},
        file_name: {type: String, required: false}
    },
    {
        timestamps: true
    }
);

const Users = mongoose.model('admin_users', usersSchema);
module.exports = Users;