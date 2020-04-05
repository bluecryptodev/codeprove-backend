const router = require('express').Router();
let Blog = require('../../models/Blog.js');
var multer = require('multer');

router.route('/add').post((req, res) => {
    const title = req.body.data.title;
    const content = req.body.data.content;
    const image = req.body.data.image;
    const newBlog = new Blog({
        title, content, image
    });
    newBlog.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        
        res.status(400).json("Error: "+ err)
    })
});

router.route('/all_list_get').get((req, res) => {
    newBlog.find((err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
})
router.route('/blog_get_all/:per_page/:page/:search_key').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        data  ={ title: { $regex: req.params.search_key, $options: "i" } }
    }
    Blog.countDocuments({}, function(err, count){
        Blog.find(data)
        .sort([["createdAt", -1]])
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            var data = [];
            doc.map(function (item, i){
                var data1 = {
                    logo: item.image, title: item.title, create: item.createdAt, id: item._id
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
router.route('/blog_background_upload').post((req, res) => {
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
        cb(null, 'images/blog')
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
router.route('/blog_data_upload').post((req, res) => {
    console.log(req.body)
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
        cb(null, 'images/blog')
      },
      filename: function (req, file, cb) {
        cb(null, randomSerial+"_data_"+file.originalname)
      }
    });
    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        var responst_data = {
            data: {
                link: req.file.filename
            },
            success: true
        }
        res.json(responst_data)
    });
})
router.route('/blog_update/:id').post((req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body, function (err, response) { 
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    });
})
router.route('/blog_delete').post((req, res) => {
    Blog.findByIdAndRemove(req.body.id, function(err, response) {
        if(!err) {
            res.json({success: true});
        }
        else {
            res.json({success: false});
        }
    })
})
module.exports = router;