const router = require('express').Router();
let Systems = require('../models/System');
var multer = require('multer');

router.route('/add').post((req, res) => {
    const site_title = req.body.site_title;
    const logo_image = req.body.logo_image;
    const play_Logo_image = req.body.play_Logo_image;
    const play_Logo_link = req.body.play_Logo_link;
    const meta_keyword = req.body.meta_keyword;
    const meta_description =req.body.meta_description;
    const ad_title = req.body.ad_title;
    const ad_code = req.body.ad_code;
    const terms_title = req.body.terms_title;
    const terms_content = req.body.terms_content;
    const tracking_id = req.body.tracking_id;
    const newSystem = new Systems({
        site_title, logo_image, play_Logo_image, play_Logo_link, meta_keyword, meta_description, ad_title, ad_code, terms_title, terms_content, tracking_id
    });
    newSystem.save()
    .then(() => {
        res.json('Success')
    })
    .catch(err => {
        console.log(err);
        res.status(400).json("Error: "+ err)
    })
});

router.route('/dataget').get((req, res) => {
    Systems.find((err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
});

router.route('/logoupload/:id').post((req, res) => {
    var id = req.params.id;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'img/')
      },
      filename: function (req, file, cb) {
        cb(null, 'logo_google.png')
      }
    });
    
    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        const imagedata = {
            logo_image: "logo_google.png"
        }
        Systems.findByIdAndUpdate(id, imagedata, function(err, response){
            if(!err){
                res.json({success: true})
            }
            else {
                res.json({success: false})
            }
        })
    });
})
router.route('/playupload/:id').post((req, res) => {
    var id = req.params.id;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'img/')
      },
      filename: function (req, file, cb) {
        cb(null, 'play_google.png')
      }
    });
    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        const imagedata = {
            play_Logo_image: "play_google.png"
        }
        Systems.findByIdAndUpdate(id, imagedata, function(err, response){
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
        site_title: req.body.title,
        play_Logo_link: req.body.logolink,
        meta_keyword: req.body.keyword,
        meta_description: req.body.description,
        tracking_id: req.body.tracking_id
    };
    Systems.findByIdAndUpdate(req.body.id, data, function(err, response) {
        if(!err) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    })
});
router.route('/adupdate').post((req, res) => {
    var data = {
        ad_title: req.body.title,
        ad_code: req.body.code
    };
    Systems.findByIdAndUpdate(req.body.id, data, function(err, response) {
        if(!err) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    })
});
router.route('/termsupdate').post((req, res) => {
    var data = {
        terms_title: req.body.title,
        terms_content: req.body.content,
        footer_content: req.body.footer,
        email: req.body.email,
        password: req.body.password
    };
    Systems.findByIdAndUpdate(req.body.id, data, function(err, response) {
        if(!err) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    })
});
router.route('/img').get((req, res) => {
    console.log(req.body);
});
router.route('/delete').post((req, res) => {
    Systems.findByIdAndRemove(req.body.id, function(err, response) {
        if(!err) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    })
})
module.exports = router;