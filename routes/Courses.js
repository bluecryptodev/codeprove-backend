const router = require('express').Router();
let Courses = require('../models/Courses.js');
var multer = require('multer');

router.route('/add').post((req, res) => {
    const title = req.body.title;
    const preivew_title = req.body.preivew_title;
    const type = req.body.type;
    const faculty = req.body.faculty;
    const course_curriculum = req.body.course_curriculum;
    const career_prospects = req.body.career_prospects;
    const features = req.body.features;
    const testimonials = req.body.testimonials;
    const FAQs = req.body.FAQs;
    const remain_days = req.body.remain_days;
    const course_comments = req.body.course_comments;
    const batch_members = req.body.batch_members;
    const language_support = req.body.language_support;
    const support_rang = req.body.support_rang;
    const newCourses = new Courses({
        title, preivew_title, type, faculty, course_curriculum, career_prospects, features, testimonials, FAQs, remain_days, course_comments, batch_members, language_support, support_rang
    });
    newCourses.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        
        res.status(400).json("Error: "+ err)
    })
});
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





module.exports = router;