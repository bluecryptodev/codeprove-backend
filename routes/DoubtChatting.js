const router = require('express').Router();
let Chatting = require("../models/Chatting.js");;
const Chatkit = require('@pusher/chatkit-server');
require('dotenv').config();
var multer = require('multer');
const local_path = process.env.LOCAL_PATH_COMMENT;
const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:eb148fcd-27ff-4a77-baf3-a490172b8165',
    key: '5bbaa10b-f7d2-47d2-b711-6b1e080045a4:S6wN55lXcvDmgOginhC6b2qa67KVl9cbrAyxzhrIuGs=',
})
router.route('/chatroom_update').post((req, res) => {
    chatkit.updateRoom(req.body)
    .then(() => res.json({success: true, msg: 'room successfully updated'}))
    .catch(err => console.error("1"+err))
})
router.route('/chatuser_add').post((req, res) => {
    chatkit.createUser({
        id: 'userId',
        name: 'Some name',
    })
    .then(() => {
        console.log('User created successfully');
    }).catch((err) => {
        console.log(err);
    });
})
router.route('/chatuser_update').post((req, res) => {
    chatkit.updateUser(req.body)
    .then(() => {
        res.json({success: true, msg: 'room successfully updated'})
    })
    .catch(err => console.error(err))
})
router.route('/chatuser_delete').post((req, res) => {
    chatkit.asyncDeleteUser({ userId: req.body.id })
    .then(({ id: jobId }) => console.log("Created async delete job for user"))
    .catch(err => {
        console.error(err)
    })
})
router.route('/chatuser_remove_room').post((req, res) => {
    chatkit.removeUsersFromRoom(req.body)
    .then(() => res.json({success: true}))
    .catch(err => console.error("2"+err))
})
router.route('/message_delete').post((req, res) => {
    chatkit.deleteMessage(req.body)
    .then(() => res.json({success: true}))
    .catch(err => console.error(err))
})
router.route('/chatuser_add_room').post((req, res) => {
    chatkit.createUser({
        id: req.body.userId,
        name: req.body.user_name,
    })
    .then(() => {
        chatkit.addUsersToRoom({
            roomId: req.body.roomId,
            userIds: [req.body.userId]
        })
        .then(() => res.json({success: true}))
        .catch(err => console.error(err))
    }).catch((err) => {
        // console.log(err)
        chatkit.addUsersToRoom({
            roomId: req.body.roomId,
            userIds: [req.body.userId]
        })
        .then(() => res.json({success: true}))
        .catch(err => console.error(err))
    });
    
});
router.route('/other_admin').post((req, res) => {
    chatkit.sendSimpleMessage(req.body)
    .then(response => {
        console.log(response);
        res.json({success: true})})
    .catch(err => console.error(err))
})
router.route('/add').post((req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const course_id = req.body.course_id;
    const course_name = req.body.course_name;
    const lecture_id = req.body.lecture_id;
    const lectureitem_id = req.body.lectureitem_id;
    const lectureitem_name = req.body.lectureitem_name;
    const lectureitem_type = req.body.lectureitem_type;
    const user_id = req.body.user_id
    const user_name = req.body.user_name;
    const admin_id = '';
    const admin_name = '';
    const chat_user_id = "";
    const chat_admin_id = "";
    const course_deadline = req.body.course_deadline;
    const last_message = "";
    const doubte_rate = 0;
    const solve_flg = false;
    const view_flg = false;
    const admin_view_flg = false;
    const join_flg = false;
    const admin_join_flg = false;
    const rate_flg = '';
    const newChat = new Chatting({
        title, description, course_id, course_name, lecture_id, lectureitem_id, lectureitem_name, lectureitem_type, user_id, user_name, admin_id, admin_name, chat_user_id, chat_admin_id, course_deadline, last_message, doubte_rate, solve_flg, view_flg, admin_view_flg, join_flg, admin_join_flg, rate_flg
    });
    newChat.save()
    .then((response) => {
        const doubte_id = response._id;
        const usersToCreate = [
            {
              id: response._id+"_user",
              name: req.body.user_name,
            }
        ];
        chatkit.createUsers({ users: usersToCreate })
        .then(() => {
            
            var update_data = {
                chat_user_id: doubte_id+"_user",
                chat_admin_id: "admin"
            }
            Chatting.findByIdAndUpdate(doubte_id, update_data, function (err, response) { 
                if(!err) {
                    res.json({
                        success: true, 
                        message: {
                            id: doubte_id,
                            user_id: doubte_id+"_user",
                            other_id: "admin"
                        }
                    });
                }
                else {
                    res.json({success: false});
                }
            });
        }).catch((err) => {
            res.json({
                success: true, 
                message: {
                    user_id: doubte_id+"_user",
                    other_id: "admin"
                }
            });
        });
        
    })
    .catch(err => {
        res.status(400).json("Error: "+ err)
    })
});

router.route('/doubte_get').post((req, res) => {
    if(req.body.flg === 'item'){
        var data = {
            lectureitem_id: req.body.id.item_id,
            user_id: req.body.id.user_id
        }
        Chatting.find(data, (err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    if(req.body.flg === 'new') {
        if(req.body.user_level === 'supper'){
            var data = {
                admin_view_flg: req.body.view
            }
        }
        else {
            data = {
                admin_id: req.body.admin_id,
                view_flg: req.body.view
            }
        }
        Chatting.find(data, (err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    if(req.body.flg === 'all') {
        var data = {
            admin_id: req.body.id
        }
        Chatting.find(data,(err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    if(req.body.flg === 'one') {
        Chatting.findById(req.body.id, (err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    if(req.body.flg === 'user') {
        var data = {
            user_id: req.body.user_id,
            course_id: req.body.course_id
        }
        Chatting.find(data, (err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
});

router.route('/doubte_get_all/:per_page/:page/:search_key/:level/:admin_id').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        data  ={ title: { $regex: req.params.search_key, $options: "i" } }
    }
    if(req.params.level !== 'supper'){
        data.admin_id = req.params.admin_id
    }
    Chatting.countDocuments({}, function(err, count){
        Chatting.find(data)
        .sort([["createdAt", -1]])
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            var data = [];
            
            doc.map(function (item, i){
                var data1 = {
                    id: item._id, 
                    user_id: item.admin_id, 
                    room_id: item._id, 
                    user_name: item.user_name, 
                    title: item.title, 
                    description: 
                    item.description, 
                    course_name: item.course_name, 
                    join_flg: item.join_flg, 
                    admin_join_flg: item.admin_join_flg,
                    admin_id: item.admin_id,
                    solve: item.solve_flg, 
                    create: item.createdAt
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

router.route('/doubte_update').post((req, res) => {
    Chatting.findByIdAndUpdate(req.body.id, req.body.data, function (err, response) { 
        if(!err) {
            res.json({
                success: true
            });
        }
        else {
            res.json({success: false});
        }
    });
})

router.route('/doubte_all_update').post((req, res) => {
    Chatting.updateMany({}, req.body, function (err, response) {
        if(!err) {
            res.json({
                success: true
            });
        }
        else {
            res.json({success: false});
        }
    });
})

router.route('/chat_file_upload').post((req, res) => {
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
        cb(null, 'chat_data')
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
router.route('/img_get/:filename').get((req, res)=> {
    res.sendFile(local_path+'chat_data/'+req.params.filename);
});

module.exports = router;