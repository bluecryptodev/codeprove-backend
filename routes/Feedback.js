const router = require('express').Router();
let Feedback = require('../models/Feedback.js');;
var multer = require('multer');

router.route('/add').post((req, res) => {
    const user_id = req.body.user_id;
    const user_name = req.body.user_name;
    const user_email = req.body.user_email;
    const lectureitem_id = req.body.lectureitem_id;
    const lectureitem_name = req.body.lectureitem_name;
    const feedback = req.body.feedback;
    const newFeedback = new Feedback({
        user_id, user_name, user_email, lectureitem_id, lectureitem_name, feedback
    });
    newFeedback.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        res.status(400).json("Error: "+ err)
    })
});

router.route('/feedback_get_all/:per_page/:page/:search_key').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        data  ={ user_email: { $regex: req.params.search_key, $options: "i" } }
    }
    Feedback.countDocuments({}, function(err, count){
        Feedback.find(data)
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            var data = [];
            doc.map(function (item, i){
                var data1 = {
                    user_name: item.user_name, user_email: item.user_email, lectureitem_name: item.lectureitem_name, feedback: item.feedback, create: item.createdAt, id: item._id
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