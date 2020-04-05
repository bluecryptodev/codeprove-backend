const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const systemSchema = new Schema(
    {
        site_title: { type: String, required: true },
        logo_image: { type: String, required: true },
        play_Logo_image: { type: String, required: true },
        play_Logo_link: { type: String, required: true },
        meta_keyword: { type: String, required: true },
        meta_description: { type: String, required: true },
        ad_title: { type: String, required: true },
        ad_code: { type: String, required: true },
        terms_title: { type: String, required: true },
        terms_content: { type: String, required: true },
        tracking_id: { type: String, required: true},
        footer_content: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

const System = mongoose.model('System', systemSchema);
module.exports = System;