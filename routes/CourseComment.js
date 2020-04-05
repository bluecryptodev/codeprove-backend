const router = require('express').Router();
let Comment = require('../models/CourseComment.js');
var multer = require('multer');
require('dotenv').config();
const local_path = process.env.LOCAL_PATH_COMMENT;

router.route('/add').post((req, res) => {
    const course_id = req.body.course_id;
    const user_id = req.body.user_id;
    const title = req.body.title;
    const content = req.body.content;
    const post_date = req.body.post_date;
    const image = req.body.image;
    const upload_file = req.body.upload_file;
    const file_type = req.body.file_type;
    const comment_like = [];
    const added_comment = [];
    const newComment = new Comment({
        course_id, user_id, title, content, post_date, image, upload_file, file_type, comment_like, added_comment
    });
    newComment.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        res.status(400).json("Error: "+ err)
    })
});

router.route('/comment_get/:id').get((req, res) => {
    Comment.find({course_id: req.params.id})
    .sort([["createdAt", -1]])
    .exec(function (err, response) {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
});

router.route('/comment_update/:id').post((req, res) => {
    Comment.findByIdAndUpdate(req.params.id, req.body, function (err, response) { 
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    });
});

router.route('/comment_delete').post((req, res) => {
    Comment.findByIdAndRemove(req.body.id, (err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
});

router.route('/file_upload').post((req, res) => {
    var filename = "";
    var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        serialLength = 10,
        randomSerial = "",
        i,
        randomNumber;
    
    for (i = 0; i < serialLength; i = i + 1) {
        randomNumber = Math.floor(Math.random() * chars.length);
        randomSerial += chars.substring(randomNumber, randomNumber + 1);
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'comment')
      },
      filename: function (req, file, cb) {
        cb(null, randomSerial+"_"+file.originalname)
      }
    });
    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        if(req.file !== undefined) {
            res.json({filename: req.file.filename})
        }
        else {
            res.json({filename: ''})
        }
    });
});

router.route('/img_get/:filename').get((req, res)=> {
    res.sendFile(local_path+'comment/'+req.params.filename);
});

module.exports = router