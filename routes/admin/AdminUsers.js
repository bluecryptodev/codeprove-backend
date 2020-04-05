const router = require('express').Router();
let User = require('../../models/AdminUser');
var bcrypt      = require('bcryptjs');
var jwt = require('jsonwebtoken');
var multer = require('multer');
require('dotenv').config();
const local_path = process.env.LOCAL_PATH;

router.route('/login').post((req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email: email}, (err, response) => {
        if(response !== null){
            bcrypt.compare(password, response.password, function(err, res1) {
                if(!res1){
                  res.json({success: false, message: 'Passwords do not match'});
                } else {
                    let token = jwt.sign(response.toJSON(), 'jhon12345', {
                        expiresIn: 1440
                    })
                    res.json({success: true, message: token});
                }
            });
        }
        else {
            res.json({success: false, message: 'The user do not exit'});
        }
    })
});

router.route('/signup').post((req, res) => {
    var username = req.body.user_name;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name
    var email = req.body.email;
    var password = req.body.password;
    var phone_number = req.body.phone;
    var image = 'default.png';
    var user_level = 'normal';
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          password = hash;
          const newUser = new User({
            username, first_name, last_name, email, password, phone_number, image, user_level
          })
          newUser.save()
          .then((response) => {
            let token = jwt.sign(response.toJSON(), 'jhon12345', {
                expiresIn: 1440
            })
            res.json({success: true, message: token});
          })
          .catch(err => {
              res.status(400).json("Error: "+err);
          })
        });
    });
});

router.route('/user_get').post((req, res) => {
    User.findById(req.body.id, (err, response) => {
        res.json({user_data: response});
    })
});

router.route('/user_update').post((req, res) => {
    var id = req.body.id;
    User.findByIdAndUpdate(id, req.body.data, function(err, response) {
        if(!err) {
            let token = jwt.sign(response.toJSON(), 'jhon12345', {
                expiresIn: 1440
            })
            res.json({success: true, message: token});
        }
        if(err){
            res.json({success: false, message: "error"});
        }
    })
});

router.route('/avatar_upload').post((req, res) => {
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
        cb(null, 'images/admin_avatar_img')
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
});

router.route('/changepassword').post((req, res) => {
    var id = req.body.id;
    User.findById(id, (err, response) => {
        if(response !== null){
            bcrypt.compare(req.body.current, response.password, function(err, res1) {
                if(!res1){
                  res.json({success: false, message: 'passwords do not match'});
                } else {
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                            User.findByIdAndUpdate(id, {password: hash}, function(err, response1) {
                                if(!err) {
                                    let token = jwt.sign(response1.toJSON(), 'jhon12345', {
                                        expiresIn: 1440
                                    })
                                    res.json({success: true, message: token});
                                }
                                if(err){
                                    res.json({success: false, message: "error"});
                                }
                            })
                        })
                    })
                }
            });
        }
        else {
            res.status(400).json('Error: ' + err);
        }
    })
});

router.route('/userget').get((req, res) => {
    User.find((err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
});

router.route('/user_delete').post((req, res) => {
    User.findOneAndRemove({email: req.body.email}, (err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
});

router.route('/img_get/:filename').get((req, res)=> {
    res.sendFile(local_path+'admin_avatar_img/'+req.params.filename);
})

module.exports = router;