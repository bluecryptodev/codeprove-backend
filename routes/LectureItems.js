const router = require('express').Router();
let LectureItem = require('../models/LectureItem');
var multer = require('multer');
require('dotenv').config();
const local_path = process.env.LOCAL_PATH_PDF;

router.route('/add').post((req, res) => {
    const title = req.body.title;
    const type = req.body.type;
    const url = req.body.url;
    const filename = req.body.filename;
    const description = req.body.description;
    const in_format = req.body.in_format;
    const out_format = req.body.out_format;
    const notes = req.body.notes;
    const contain = req.body.contain;
    const sample_input = req.body.sample_input;
    const sample_output = req.body.sample_output;
    const sample_code = req.body.sample_code;
    const check_input = req.body.check_input;
    const check_output = req.body.check_output;
    const score = req.body.score;
    const bookmark = req.body.bookmark;
    const newLectureItem = new LectureItem({
        title, type, url, filename, description, in_format, out_format, notes, contain, sample_input, sample_output, sample_code, check_input, check_output, score, bookmark
    });
    newLectureItem.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        
        res.status(400).json("Error: "+ err)
    })
});

router.route('/itemget/:id').get((req, res) => {
    if(req.params.id === '0'){
        LectureItem.find((err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    else {
        LectureItem.findById(req.params.id, (err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    
});
router.route('/item_from_course/:id').get((req, res) => {
    LectureItem.find({lecture_id: req.params.id}, (err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
})

router.route('/imageupload/:id').post((req, res) => {
    var id = req.params.id;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'img/video/')
      },
      filename: function (req, file, cb) {
         
        cb(null, id + "_" + file.originalname)
      }
    });
    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        const videodata = {
            screen: req.file.filename
        }
        Videos.findByIdAndUpdate(id, videodata, function(err, response){
            if(!err){
                res.json({success: true})
            }
            else {
                res.json({success: false})
            }
        })
    });
});

router.route('/update').post((req, res) => {
    var data = {
        title: req.body.title,
        source: req.body.source
    }
    Videos.findByIdAndUpdate(req.body.id, data, function(err, response){
        if(!err){
            res.json(true);
        }
        else {
            res.json(false);
        }
    })
});

router.route('/bookmark').post((req, res) => {
    // res.json(true);
    var data = {
        bookmark: req.body.bookmark_list
    }
    LectureItem.findByIdAndUpdate(req.body.id, data, function(err, response){
        if(!err){
            res.json(true);
        }
        else {
            res.json(false);
        }
    })
})
router.route('/delete').post((req, res) => {
    Videos.findByIdAndRemove(req.body.id, function(err, response) {
        if(!err) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    })
});

router.route('/videoview').post((req, res) => {
    Videos.findById(req.body.id, function(err, response) {
        if(!err){
            res.json(response);
        }
        else {
            res.json(false);
        }
    })
})
router.route('/pdf_get/:filename').get((req, res)=> {
    console.log(req.params.filename)
    res.sendFile(local_path+req.params.filename);
})
module.exports = router;