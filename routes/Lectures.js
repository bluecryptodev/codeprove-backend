const router = require('express').Router();
let Lectures = require('../models/Lectures.js');
require('dotenv').config();
const local_path = process.env.LOCAL_PATH;

router.route('/add').post((req, res) => {
    const course_id = req.body.course_id;
    const title = req.body.title;
    const release_date = req.body.release_date;
    const deadline = req.body.deadline;
    const weightage = req.body.weightage;
    const level_type = req.body.level_type;
    const lecture_icon = req.body.lecture_icon;
    const free_type = req.body.free_type;
    const newLectures = new Lectures({
        course_id, title, release_date, deadline, weightage, level_type, lecture_icon, free_type
    });
    newLectures.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        res.status(400).json("Error: "+ err)
    })
});
router.route('/lecture_get/:course/:id').get((req, res) => {
    if(req.params.course === "from_course"){
        Lectures.find({course_id: req.params.id}, (err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    else {
        if(req.params.id === '0'){
            Lectures.find((err, response) => {
                if(!err) {
                    res.json(response);
                }
                else {
                    res.json("Error: " + err);
                }
            })
        }
        else {
            Lectures.findById(req.params.id, (err, response) => {
                if(!err) {
                    res.json(response);
                }
                else {
                    res.json("Error: " + err);
                }
            })
        }
        
    }
    
});
router.route('/img_get/:filename').get((req, res)=> {
    res.sendFile(local_path+'lectures_logo/'+req.params.filename);
})
module.exports = router;