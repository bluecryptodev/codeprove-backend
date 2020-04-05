const router = require('express').Router();
let LectureItem = require('../../models/LectureItem');
var multer = require('multer');

router.route('/add').post((req, res) => {
    const lecture_id = req.body.lecture_id;
    const lecture_name = req.body.lecture_name;
    const course_id = req.body.course_id;
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
    const test_input = req.body.test_input;
    const test_output = req.body.test_output;
    const check_input = req.body.check_input;
    const check_output = req.body.check_output;
    const hint = req.body.hint;
    const score = req.body.score;
    const bookmark = [];
    const newLectureItem = new LectureItem({
        lecture_id, lecture_name, course_id, title, type, url, filename, description, in_format, out_format, notes, contain, sample_input, sample_output, sample_code, test_input, test_output, check_input, check_output, score, hint, bookmark
    });
    newLectureItem.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        res.status(400).json("Error: "+ err)
    })
});

router.route('/lectureitem_get_all/:lecture_id/:per_page/:page/:search_key').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        if(req.params.lecture_id !== "0"){
            data  ={ title: { $regex: req.params.search_key, $options: "i" }, lecture_id: req.params.lecture_id }
        }
        else {
            data  ={ title: { $regex: req.params.search_key, $options: "i" } }
        }
    }
    else {
        if(req.params.lecture_id !== "0"){
            data  ={ lecture_id: req.params.lecture_id }
        }
        else {
            data  ={ }
        }
    }
    LectureItem.countDocuments(data, function(err, count){
        LectureItem.find(data)
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            var data = [];
            doc.map(function (item, i){
                var data1 = {
                    title: item.title, lecture_name: item.lecture_name, content_type: item.type, create: item.createdAt, id: item._id
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

router.route('/lectureitem_pdf_upload').post((req, res) => {
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
        cb(null, 'pdf')
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
router.route('/lectureitem_update/:id').post((req, res) => {
    LectureItem.findByIdAndUpdate(req.params.id, req.body, function (err, response) { 
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    });
})
router.route('/lectureitem_delete').post((req, res) => {
    LectureItem.findByIdAndRemove(req.body.id, function(err, response) {
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    })
})

module.exports = router;