const router = require('express').Router();
let Courses = require('../../models/Courses1.js');
var multer = require('multer');
let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo("f3963695a7d9d816c9bcc8178502c2df3024ed70", "Vz82Bwtc935JQOjeuAOjzyAVUXLkvpizJ8peABop+ZXjblY68TGerhwzK+E8jlyon5Oh+99kgdb6QWhSDG3XoQFhgJ1bOuMLicxcwpHR2qWGBRG9gfWoqQWiV9/GBOsb", "0c053646e58cfdb37f5d3a44402b4d38");

router.route('/add').post((req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const intro_video_id = req.body.intro_video_id;
    const reivew_video_id = req.body.reivew_video_id;
    const image = req.body.image;
    const price = req.body.price;
    const remain_days = req.body.remain_days;
    const batch_members = [];
    const course_comments = [];
    const level_number = req.body.level_number;
    const newCourses = new Courses({
        title, description, intro_video_id, reivew_video_id, image, price, remain_days, batch_members, course_comments, level_number
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
router.route('/course_get_all/:per_page/:page/:search_key').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        data  ={ title: { $regex: req.params.search_key, $options: "i" } }
    }
    Courses.countDocuments({}, function(err, count){
        Courses.find(data)
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            var data = [];
            doc.map(function (item, i){
                var data1 = {
                    logo: item.image, title: item.title, intro: item.intro_video_id, review: item.reivew_video_id, batch_members: item.batch_members.length, batch_json: item.next_json_file, batch_uploaded_flg: item.json_file_uploaded, create: item.createdAt, id: item._id
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
router.route('/course_logo_upload').post((req, res) => {
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
        cb(null, 'images/courses_logos')
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
router.route('/course_batch_file_upload/:name').post((req, res) => {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'json')
      },
      filename: function (req, file, cb) {
        cb(null, req.params.name+".txt")
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
router.route('/course_video_upload').post((req, res) => {
    var userID = req.params.logo;
    
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log("diskStorage", file);
        cb(null, 'video')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname)
      }
    });
    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        console.log(req.file);
    });
})
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
router.route('/vimeo_api_upload').post((req, res) => {
    let file_name = "video/test.mp4";
    client.upload(
        file_name,
        {
            'name': 'Untitled',
            'description': 'The description goes here.'
        },
        function (uri) {
            console.log('Your video URI is: ' + uri);
        },
        function (bytes_uploaded, bytes_total) {
            var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
            console.log(bytes_uploaded, bytes_total, percentage + '%')
        },
        function (error) {
            console.log('Failed because: ' + error)
        }
    )
    res.send()
});
router.route('/course_delete').post((req, res) => {
    Courses.findByIdAndRemove(req.body.id, function(err, response) {
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    })
})



module.exports = router;