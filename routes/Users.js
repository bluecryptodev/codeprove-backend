const router = require('express').Router();
let User = require('../models/User');
var bcrypt      = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Speakeasy = require('speakeasy');
const client = require('twilio')(
    "AC30e6b9756285919a7b285a24c5e32b96",
    "b0aa37ac0a9747ae0ffb057576c85701"
);

router.route('/secret').post((req, res) => {
    var secret = Speakeasy.generateSecret({length: 20});
    res.json({
        "secret": secret.base32,
        "time": new Date().getTime()
    })
})
router.route('/opt_send').post((req, res) => {
    var tokenDelta = Speakeasy.totp({
        secret: req.body.secret,
        encoding: 'base32',
        step: 600
    });
    res.json({
        "token": tokenDelta,
        "time": new Date().getTime()
    })
})
router.route('/otp_verify').post((req, res) => {
    var tokenDelta = Speakeasy.totp.verify({
        secret: req.body.secret,
        encoding: 'base32',
        token: req.body.token,
        window: 0,
        step: 600
    });
    res.json({
        "valid": tokenDelta
    })
})
router.route('/email_check').post((req, res) => {
    var email = req.body.email;
    User.findOne({email: email}, (err, response) => {
        if(response !== null) {
            res.json({status: true, response: response});
        }
        else {
            res.json({status: false, response: {login_flg: false}});
        }
    })
})
router.route('/phon_number_verify').post((req, res) => {
    res.header('Content-Type', 'application/json');
    client.messages
    .create({
        from: "+17754512461",
        to: req.body.to,
        body: req.body.code
    })
    .then(() => {
        res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
        console.log(err);
        res.send(JSON.stringify({ success: false }));
    });
})
router.route('/login').post((req, res) => {
    var email = req.body.email;
    var tokenDelta = Speakeasy.totp.verify({
        secret: req.body.secret,
        encoding: 'base32',
        token: req.body.token,
        window: 0,
        step: 600
    });
    if(tokenDelta){
        User.findOne({email: email}, (err, response) => {
            var data = {login_flg: true}
            User.updateOne({email: email}, data, (err, response1) => {
                res.json({success: true, message: response});
            })
        })
    }
    else {
        res.json({otp_error: true});
    }
});

router.route('/signup').post((req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var phone_number = req.body.phone;
    var course_list = [];
    var lecture_list = [];
    var lecture_content_list = [];
    var doubts_list = [];
    var bookmark_list = [];
    var user_level = "normal";
    var image = 'default.png';
    var login_flg = true;
    if(req.body.img !== ""){
        image = req.body.img
    }
    var tokenDelta = Speakeasy.totp.verify({
        secret: req.body.secret,
        encoding: 'base32',
        token: req.body.token,
        window: 0,
        step: 600
    });
    if(tokenDelta){
        const newUser = new User({
            username, email, password, phone_number, course_list, lecture_list, lecture_content_list, image, doubts_list, bookmark_list, user_level, login_flg
        })
        newUser.save()
        .then((response) => {
            res.json({success: true, message: response});
        })
        .catch(err => {
            res.status(400).json("Error: "+err);
        })
    }
    else {
        res.json({otp_error: true});
    }
});

router.route('/social-signup').post((req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var phone_number = req.body.phone;
    var course_list = [];
    var lecture_list = [];
    var lecture_content_list = [];
    var doubts_list = [];
    var bookmark_list = [];
    var user_level = "normal";
    var image = 'default.png';
    var google_id = req.body.google_id;
    var login_flg = true;
    if(req.body.img !== ""){
        image = req.body.img
    }
    User.findOne({email: email}, (err, response) => {
        if(response !== null) {
            var data = {login_flg: true}
            User.updateOne({email: email}, data, (err, response1) => {
                res.json({success: true, message: response});
            })
        }
        else {
            const newUser = new User({
                username, email, password, phone_number, course_list, lecture_list, lecture_content_list, image, doubts_list, bookmark_list, user_level, google_id, login_flg
            })
            newUser.save()
            .then((response) => {
                res.json({success: true, message: response});
            })
            .catch(err => {
                res.status(400).json("Error: "+err);
            })
        }
    })
})

router.route('/logout').post((req, res) => {
    var data = {login_flg: false}
    User.findByIdAndUpdate(req.body.id, data, function(err, response) {
        res.json({success: true});
        
    })
});

router.route('/update').post((req, res) => {
    var data = {
        course_list: req.body.course_list,
        lecture_list: req.body.lecture_list,
        lecture_content_list: req.body.lecture_content_list
    }
    User.findByIdAndUpdate(req.body._id, data, function(err, response) {
        if(!err) {
            res.json({success: true});
        }
        if(err){
            res.json({success: false, message: "error"});
        }
    })
});
router.route('/custome_update/:id').post((req, res) => {
    User.findById(req.params.id, (err, response) => {
        const date1 = new Date(parseInt(req.body.deadline_date));
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        var lecture_score = 0;
        var item_score = 0;
        var submit_score = 0;
        var data = {};
        if(req.body.flg === 'reset_code') {
            var lecture_content_list = response.lecture_content_list;
            for(var i = 0; i < response.lecture_content_list.length; i++){
                if(req.body.item_id === response.lecture_content_list[i].id){
                    if(req.body.code_mode === 'python'){
                        lecture_content_list[i].python_code.your = ""
                        lecture_content_list[i].python_code.main = ""
                    }
                    if(req.body.code_mode === 'c_cpp'){
                        lecture_content_list[i].cpp_code.your = ""
                        lecture_content_list[i].cpp_code.main = ""
                    }
                    if(req.body.code_mode === 'java'){
                        lecture_content_list[i].java_code.your = ""
                        lecture_content_list[i].java_code.main = ""
                    }
                }
            }
            data = {
                lecture_content_list: lecture_content_list
            }
        }
        if(req.body.flg === 'submit_list'){
            var lecture_content_list = response.lecture_content_list;
            var contain_flg = false;
            for(var i = 0; i < response.lecture_content_list.length; i++){
                if(req.body.item_id === response.lecture_content_list[i].id){
                    
                    lecture_content_list[i].lecture_id = req.body.lecture_id;
                    if(!req.body.solutio_view){
                        if((parseInt(diffDays)-parseInt(req.body.pause_days)) <= 0) {
                            lecture_content_list[i].score = req.body.item_score;
                            item_score =  req.body.item_score;
                            req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score;
                        }
                        if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 0 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 7) {
                            req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0.75;
                            if(lecture_content_list[i].score < parseFloat(req.body.item_score)*0.75){
                                lecture_content_list[i].score = parseFloat(req.body.item_score)*0.75;
                                item_score = parseFloat(req.body.item_score)*0.75;
                            }
                            else {
                                item_score =  lecture_content_list[i].score;
                            }
                        }
                        if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 7 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 14) {
                            req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0.5;
                            if(lecture_content_list[i].score < parseFloat(req.body.item_score)*0.5){
                                lecture_content_list[i].score = parseFloat(req.body.item_score)*0.5;
                                item_score =  parseFloat(req.body.item_score)*0.5;
                            }
                            else {
                                item_score =  lecture_content_list[i].score;
                            }
                        }
                        if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 15) {
                            req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0;
                            if(lecture_content_list[i].score <= 0){
                                lecture_content_list[i].score = 0;
                                item_score =  0;
                            }
                            else {
                                item_score =  lecture_content_list[i].score;
                            }
                        }
                    }
                    else {
                        if(lecture_content_list[i].score > parseFloat(req.body.item_score)){
                            item_score = parseFloat(req.body.item_score);
                        }
                        req.body.data[req.body.data.length-1].score = 0;
                    }
                    submit_score = req.body.data[req.body.data.length-1].score;
                    lecture_content_list[i].submit_list = req.body.data;
                    lecture_content_list[i].submit_status = req.body.submite_result_status;
                    if(lecture_content_list[i].python_code === ""){
                        lecture_content_list[i].python_code =  {your: "", main: ""};
                    }
                    if(lecture_content_list[i].cpp_code === ""){
                        lecture_content_list[i].cpp_code = {your: "", main: ""};
                    }
                    if(lecture_content_list[i].java_code === ""){
                        lecture_content_list[i].java_code = {your: "", main: ""};
                    }
                    if(req.body.code_mode === 'python'){
                        lecture_content_list[i].python_code.your = req.body.me_code.your
                        lecture_content_list[i].python_code.main = req.body.me_code.main
                    }
                    if(req.body.code_mode === 'c_cpp'){
                        lecture_content_list[i].cpp_code.your = req.body.me_code.your
                        lecture_content_list[i].cpp_code.main = req.body.me_code.main
                    }
                    if(req.body.code_mode === 'java'){
                        lecture_content_list[i].java_code.your = req.body.me_code.your
                        lecture_content_list[i].java_code.main = req.body.me_code.main
                    }
                    contain_flg = true;
                }
            }
            if(!contain_flg) {
                var lecture_item_add = {}
                // lecture_item_add.submit_list.id = req.body.item_id
                lecture_item_add.id = req.body.item_id;
                lecture_item_add.lecture_id = req.body.lecture_id;
                if(!req.body.solutio_view){
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) <= 0) {
                        lecture_item_add.score = req.body.item_score;
                        item_score =  req.body.item_score;
                        req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score;
                    }
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 0 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 7) {
                        lecture_item_add.score = parseFloat(req.body.item_score)*0.75;
                        item_score = parseFloat(req.body.item_score)*0.75;
                        req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0.75;
                    }
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 7 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 14) {
                        lecture_item_add.score = parseFloat(req.body.item_score)*0.5;
                        item_score =  parseFloat(req.body.item_score)*0.5;
                        req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0.5;
                    }
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 14) {
                        lecture_item_add.score = 0;
                        item_score =  0;
                        req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0;
                    }
                }
                else {
                    if(lecture_content_list[i].score > parseFloat(req.body.item_score)){
                        item_score = parseFloat(req.body.item_score);
                    }
                    req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0;
                }
                submit_score = req.body.data[req.body.data.length-1].score;
                lecture_item_add.submit_status = req.body.submite_result_status;
                lecture_item_add.python_code =  {your: "", main: ""};
                lecture_item_add.cpp_code = {your: "", main: ""};
                lecture_item_add.java_code = {your: "", main: ""};
                if(req.body.code_mode === 'python'){
                    lecture_item_add.python_code.your = req.body.me_code.your
                    lecture_item_add.python_code.main = req.body.me_code.main
                }
                if(req.body.code_mode === 'c_cpp'){
                    lecture_item_add.cpp_code.your = req.body.me_code.your
                    lecture_item_add.cpp_code.main = req.body.me_code.main
                }
                if(req.body.code_mode === 'java'){
                    lecture_item_add.java_code.your = req.body.me_code.your
                    lecture_item_add.java_code.main = req.body.me_code.main
                }
                lecture_item_add.submit_list = req.body.data;
                lecture_content_list.push(lecture_item_add);
            }
            var lecture_list = response.lecture_list;
            for(i = 0; i < response.lecture_list.length; i++){
                if(req.body.lecture_id === response.lecture_list[i].id){
                    if(!req.body.solutio_view){
                        if((parseInt(diffDays)-parseInt(req.body.pause_days)) <= 0) {
                            lecture_list[i].score = req.body.lecture_score + req.body.item_score;
                            lecture_score = req.body.lecture_score + req.body.item_score;
                        }
                        if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 0 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 7) {
                            if(req.body.lecture_score + parseFloat(req.body.item_score)*0.75 > lecture_list[i].score){
                                lecture_list[i].score = req.body.lecture_score + parseFloat(req.body.item_score)*0.75;
                                lecture_score = req.body.lecture_score + parseFloat(req.body.item_score)*0.75;
                            }
                            else {
                                lecture_score = lecture_list[i].score;
                            }
                            
                        }
                        if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 7 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 14) {
                            if(req.body.lecture_score + parseFloat(req.body.item_score)*0.5 > lecture_list[i].score){
                                lecture_list[i].score = req.body.lecture_score + parseFloat(req.body.item_score)*0.5;
                                lecture_score = req.body.lecture_score + parseFloat(req.body.item_score)*0.5;
                            }
                            else {
                                lecture_score = lecture_list[i].score;
                            }
                        }
                        if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 14) {
                            if(0 > lecture_list[i].score){
                                lecture_list[i].score = req.body.lecture_score + 0;
                                lecture_score = req.body.lecture_score + 0;
                            }
                            else {
                                lecture_score = lecture_list[i].score;
                            }
                        }
                    }
                    else {
                        lecture_score = lecture_list[i].score;
                    }
                }
            }
            data = {
                lecture_content_list: lecture_content_list,
                lecture_list: lecture_list
            }
        }
        if(req.body.flg === 'puzzle'){

            var lecture_content_list = response.lecture_content_list;
            var contain_flg = false;
            for(var i = 0; i < response.lecture_content_list.length; i++){
                if(req.body.item_id === response.lecture_content_list[i].id){
                    lecture_content_list[i].submit_list = req.body.data;
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) <= 0) {
                        lecture_content_list[i].score = req.body.item_score;
                        item_score =  req.body.item_score;
                    }
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 0 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 7) {
                        if(lecture_content_list[i].score < parseFloat(req.body.item_score)*0.75){
                            lecture_content_list[i].score = parseFloat(req.body.item_score)*0.75;
                            item_score =  parseFloat(req.body.item_score)*0.75;
                        }
                        else {
                            item_score =  lecture_content_list[i].score;
                        }
                    }
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 7 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 14) {
                        if(lecture_content_list[i].score < parseFloat(req.body.item_score)*0.5){
                            lecture_content_list[i].score = parseFloat(req.body.item_score)*0.5;
                            item_score =  parseFloat(req.body.item_score)*0.5;
                        }
                        else {
                            item_score =  lecture_content_list[i].score;
                        }
                    }
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 14) {
                        if(lecture_content_list[i].score <= 0){
                            lecture_content_list[i].score = 0;
                            item_score =  0;
                        }
                        else {
                            item_score =  lecture_content_list[i].score;
                        }
                    }
                    lecture_content_list[i].submit_status = req.body.submite_result_status;
                    contain_flg = true;
                }
            }
            if(!contain_flg) {
                var lecture_item_add = {}
                lecture_item_add.id = req.body.item_id
                
                lecture_item_add.lecture_id = req.body.lecture_id;
                if((parseInt(diffDays)-parseInt(req.body.pause_days)) <= 0) {
                    lecture_item_add.score = req.body.item_score;
                    item_score =  req.body.item_score;
                    req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score;
                }
                if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 0 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 7) {
                    lecture_item_add.score = parseFloat(req.body.item_score)*0.75;
                    item_score = parseFloat(req.body.item_score)*0.75;
                    req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0.75;
                }
                if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 7 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 14) {
                    lecture_item_add.score = parseFloat(req.body.item_score)*0.5;
                    item_score =  parseFloat(req.body.item_score)*0.5;
                    req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0.5;
                }
                if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 14) {
                    lecture_item_add.score = 0;
                    item_score =  0;
                    req.body.data[req.body.data.length-1].score = req.body.data[req.body.data.length-1].score*0;
                }
                lecture_item_add.submit_status = req.body.submite_result_status;
                lecture_item_add.submit_list = req.body.data;
                
                lecture_content_list.push(lecture_item_add);
            }
            var lecture_list = response.lecture_list;
            for(i = 0; i < response.lecture_list.length; i++){
                if(req.body.lecture_id === response.lecture_list[i].id){
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) <= 0) {
                        lecture_list[i].score = req.body.lecture_score + req.body.item_score;
                        lecture_score = req.body.lecture_score + req.body.item_score;
                    }
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 0 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 7) {
                        if(req.body.lecture_score + parseFloat(req.body.item_score)*0.75 > lecture_list[i].score){
                            lecture_list[i].score = req.body.lecture_score + parseFloat(req.body.item_score)*0.75;
                            lecture_score = req.body.lecture_score + parseFloat(req.body.item_score)*0.75;
                        }
                        else {
                            lecture_score = lecture_list[i].score;
                        }
                        
                    }
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 7 && (parseInt(diffDays)-parseInt(req.body.pause_days)) <= 14) {
                        if(req.body.lecture_score + parseFloat(req.body.item_score)*0.5 > lecture_list[i].score){
                            lecture_list[i].score = req.body.lecture_score + parseFloat(req.body.item_score)*0.5;
                            lecture_score = req.body.lecture_score + parseFloat(req.body.item_score)*0.5;
                        }
                        else {
                            lecture_score = lecture_list[i].score;
                        }
                    }
                    if((parseInt(diffDays)-parseInt(req.body.pause_days)) > 14) {
                        if(0 > lecture_list[i].score){
                            lecture_list[i].score = req.body.lecture_score + 0;
                            lecture_score = req.body.lecture_score + 0;
                        }
                        else {
                            lecture_score = lecture_list[i].score;
                        }
                    }
                }
            }
            data = {
                lecture_content_list: lecture_content_list,
                lecture_list: lecture_list
            }
        }
        if(req.body.flg === 'step_status'){

            var course_list = response.course_list;
            for(var i = 0; i < response.course_list.length; i++){
                if(req.body.course_id === response.course_list[i].id){
                    course_list[i].step_status = {id: req.body.lecture_id, name: req.body.lecture_name}
                }
            }
            var lecture_list = response.lecture_list;
            for(i = 0; i < response.lecture_list.length; i++){
                if(req.body.lecture_id === response.lecture_list[i].id){
                    lecture_list[i].step_status = {id: req.body.item_id, name: req.body.item_name}
                }
            }
            data = {
                course_list: course_list,
                lecture_list: lecture_list
            }
            
        }
        if(req.body.flg === 'bookmark'){
            data = {
                bookmark_list: req.body.data
            }
        }
        if(req.body.flg === 'event'){
            data = {
                event_list: req.body.data
            }
        }
        if(req.body.flg === 'solution_view'){
            data = {
                lecture_content_list: req.body.data
            }
        }
        if(req.body.flg === 'pause'){
            data = {
                course_list: req.body.data
            }
        }
        if(req.body.flg === 'new_lecture'){
            data = {
                lecture_list: req.body.data
            }
        }
        User.findByIdAndUpdate(req.params.id, data, function(err, response) {
            if(!err) {
                res.json({lecture_socre: lecture_score, item_score: item_score});
            }
            if(err){
                res.json({success: false, message: "error"});
            }
        })
    })
    
})
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

router.route('/userget').post((req, res) => {
    User.findById(req.body.id, (err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
});

router.route('/all_userget').post((req, res) => {
    User.find((err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
});

router.route('/userdelete').post((req, res) => {
    User.findOneAndRemove({email: req.body.email}, (err, response) => {

        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
});

router.route('/users_get_all/:per_page/:page/:search_key').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        data  ={ username: { $regex: req.params.search_key, $options: "i" } }
    }
    User.countDocuments(data, function(err, count){
        User.find(data)
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            var data = [];
            doc.map(function (item, i){
                var data1 = {
                    image: item.image, username: item.username, email: item.email, create: item.createdAt, id: item._id
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

module.exports = router;