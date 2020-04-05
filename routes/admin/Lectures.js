const router = require('express').Router();
let Lectures = require('../../models/Lectures.js');
var multer = require('multer');

router.route('/add').post((req, res) => {
    const course_id = req.body.course_id;
    const course_name = req.body.course_name;
    const title = req.body.title;
    const release_date = req.body.release_date;
    const deadline = req.body.deadline;
    const weightage = req.body.weightage;
    const lecture_icon = req.body.lecture_icon;
    const free_type = req.body.free_type;
    const color = req.body.color;
    const level_number = req.body.level_number;
    const order_number = req.body.order_number;
    const total_score = 0;
    const newLectures = new Lectures({
        course_id, course_name, title, release_date, deadline, weightage, lecture_icon, free_type, color, level_number, order_number, total_score
    });
    newLectures.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        res.status(400).json("Error: "+ err)
    })
});
router.route('/lecture_get_all/:course_id/:per_page/:page/:search_key').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        if(req.params.course_id !== "0"){
            data  ={ title: { $regex: req.params.search_key, $options: "i" }, course_id: req.params.course_id }
        }
        else {
            data  ={ title: { $regex: req.params.search_key, $options: "i" } }
        }
    }
    else {
        if(req.params.course_id !== "0"){
            data  ={ course_id: req.params.course_id }
        }
        else {
            data  ={ }
        }
    }
    Lectures.countDocuments(data, function(err, count){
        Lectures.find(data)
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            var data = [];
            doc.map(function (item, i){
                var data1 = {
                    logo: item.lecture_icon, title: item.title, course_name: item.course_name, weight: item.weightage, create: item.createdAt, id: item._id, course_id: item.course_id
                }
                data.push(data1);
                return data;
            })
            var res_data = {
                totalpage: count,
                page: req.params.page,
                data: data
            }
            res.status(200).json(res_data);
        })
    });
});
router.route('/lecture_logo_upload').post((req, res) => {
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
        cb(null, 'images/lectures_logo')
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
        res.json({filename: req.file.filename})
    });
})
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
router.route('/lecture_update/:id').post((req, res) => {
    Lectures.findByIdAndUpdate(req.params.id, req.body, function (err, response) { 
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    });
});
router.route('/lecture_delete').post((req, res) => {
    Lectures.findByIdAndRemove(req.body.id, function(err, response) {
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    })
})
module.exports = router;