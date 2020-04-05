const router = require('express').Router();
let Blog = require('../models/Blog.js');
const fs = require('fs');
require('dotenv').config();
const local_path = process.env.LOCAL_PATH;

router.route('/all_list_get').get((req, res) => {
    Blog.find((err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
})
router.route('/blog_get/:id').get((req, res) => {
    if(req.params.id === '0'){
        Blog.find((err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    else {
        Blog.findById(req.params.id, (err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    
});
router.route('/img_get/:filename').get((req, res)=> {
    res.sendFile(local_path+'blog/'+req.params.filename);
});
module.exports = router;