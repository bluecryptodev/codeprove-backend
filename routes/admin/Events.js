const router = require('express').Router();
let Events = require('../../models/Events.js');
var multer = require('multer');

router.route('/add').post((req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const start_date = req.body.start_date;
    const pay_type = req.body.pay_type;
    const venue = req.body.venue;
    const background_img = req.body.background_img;
    const video_url = req.body.video_url;
    const registered_members = [];
    const newEvent = new Events({
        title, description, start_date, pay_type, venue, background_img, video_url, registered_members
    });
    newEvent.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        res.status(400).json("Error: "+ err)
    })
});
router.route('/events_get_all/:per_page/:page/:search_key').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        data  ={ title: { $regex: req.params.search_key, $options: "i" } }
    }
    Events.countDocuments({}, function(err, count){
        Events.find(data)
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            var data = [];
            doc.map(function (item, i){
                var data1 = {
                    logo: item.background_img, title: item.title, venue: item.venue, video_url: item.video_url, start_date: item.start_date, create: item.createdAt, id: item._id
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
router.route('/event_background_upload').post((req, res) => {
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
        cb(null, 'images/event_background')
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
router.route('/event_update/:id').post((req, res) => {
    Events.findByIdAndUpdate(req.params.id, req.body, function (err, response) { 
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    });
})
router.route('/event_delete').post((req, res) => {
    Events.findByIdAndRemove(req.body.id, function(err, response) {
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    })
})
module.exports = router;