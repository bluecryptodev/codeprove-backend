const router = require('express').Router();
let Chatting = require("../models/SupportChat.js");
const Chatkit = require('@pusher/chatkit-server');
var multer = require('multer');
require('dotenv').config();
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
        chatkit.updateUser({
            id: req.body.userId,
            avatarURL: req.body.avatarURL
        })
        .then(() => {
            chatkit.addUsersToRoom({
                roomId: req.body.roomId,
                userIds: [req.body.userId]
            })
            .then(() => res.json({success: true}))
            .catch(err => console.error(err))
        })
        
    }).catch((err) => {
        chatkit.updateUser({
            id: req.body.userId,
            avatarURL: req.body.avatarURL
        })
        .then(() => {
            chatkit.addUsersToRoom({
                roomId: req.body.roomId,
                userIds: [req.body.userId]
            })
            .then(() => res.json({success: true}))
            .catch(err => console.error(err))
        })
    });
    
});
router.route('/other_admin').post((req, res) => {
    chatkit.sendSimpleMessage(req.body)
    .then(response => {
        res.json({success: true})})
    .catch(err => console.error(err))
})
router.route('/add').post((req, res) => {
    const email = req.body.email;
    const phone = req.body.phone;
    const username = req.body.username;
    const user_id = "";
    const admin_id = "admin";
    const room_id = "";
    const view_flg = false;
    const admin_view_flg = false;
    const join_flg = false;
    const admin_join_flg = false;
    const newChat = new Chatting({
        email, phone, username, user_id, admin_id, room_id, view_flg, admin_view_flg, join_flg, admin_join_flg
    });
    newChat.save()
    .then((response) => {
        const doubte_id = response._id;
        const usersToCreate = [
            {
              id: response._id+"_user",
              name: req.body.username,
            }
        ];
        chatkit.createUsers({ users: usersToCreate })
        .then(() => {
            
            var update_data = {
                id: doubte_id,
                user_id: doubte_id+"_user",
                admin_id: admin_id,
                room_id: doubte_id+"_support"
            }
            Chatting.findByIdAndUpdate(doubte_id, update_data, function (err, response) { 
                if(!err) {
                    res.json({
                        success: true, 
                        message: update_data
                    });
                }
                else {
                    res.json({success: false});
                }
            });
        }).catch((err) => {
            var update_data = {
                id: doubte_id,
                user_id: doubte_id+"_user",
                admin_id: admin_id,
                room_id: doubte_id+"_support"
            }
            res.json({
                success: true, 
                message: update_data
            });
        });
        
    })
    .catch(err => {
        res.status(400).json("Error: "+ err)
    })
});

router.route('/support_chat_get').post((req, res) => {
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

router.route('/support_chat_get_all/:per_page/:page/:search_key/:level/:admin_id').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        data  ={ email: { $regex: req.params.search_key, $options: "i" } }
    }
    if(req.params.level !== 'supper'){
        data.admin_id = req.params.admin_id
    }
    Chatting.countDocuments({data}, function(err, count){
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
                    user_name: item.username, 
                    user_phone: item.phone, 
                    user_email: item.email, 
                    user_id: item.user_id, 
                    admin_id: item.admin_id, 
                    room_id: item.room_id, 
                    join_flg: item.join_flg, 
                    admin_join_flg: item.admin_join_flg,
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