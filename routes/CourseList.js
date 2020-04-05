const router = require('express').Router();
let Courses = require('../models/Courses1.js');
const fs = require('fs');
require('dotenv').config();
const local_path = process.env.LOCAL_PATH;
router.route('/course_get/:id').get((req, res) => {
    if(req.params.id === '0'){
        Courses.find((err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    else {
        Courses.findById(req.params.id, (err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    
});
router.route('/course_update/:id').post((req, res) => {
    Courses.findByIdAndUpdate(req.params.id, req.body, function (err, response) { 
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    });
})
router.route('/img_get/:filename').get((req, res)=> {
    res.sendFile(local_path+'courses_logos/'+req.params.filename);
});
router.route('/json_file_read/:filename').get((req, res) => {
    let rawdata = fs.readFileSync(('json/'+req.params.filename));
    let dates = JSON.parse(rawdata);
    res.json(dates);
});
router.route('/json_file_write/:filename').post((req, res) => {
    fs.writeFile(('json/'+req.params.filename), req.body.text, function(err) {
        if(err) {
            return console.log(err);
        }
        res.json({success: true});
    }); 
    fs.writeFileSync('json/'+req.params.filename);
});
router.route('/course_comment_add').post((req, res) => {
    Courses.findByIdAndUpdate(req.body.id, req.body.data, (err, response) => {
        if(!err) {
            res.json({msg: response});
        }
    })
})



module.exports = router;