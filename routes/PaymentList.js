const router = require('express').Router();
let Payment = require('../models/Payment.js');

router.route('/add').post((req, res) => {
    const user_id = req.body.data.user_id;
    const user_email = req.body.data.user_email;
    const invoice_number = req.body.data.invoice_number;
    const description = req.body.data.description;
    const pay_amount = req.body.data.pay_amount;
    const balance = req.body.data.balance;
    const newPayment = new Payment({
        user_id, user_email, invoice_number, description, pay_amount, balance
    });
    newPayment.save()
    .then((response) => {
        res.json({success: true, message: response});
    })
    .catch(err => {
        
        res.status(400).json("Error: "+ err)
    })
});

router.route('/all_list_get').get((req, res) => {
    Payment.find((err, response) => {
        if(!err) {
            res.json(response);
        }
        else {
            res.json("Error: " + err);
        }
    })
})
router.route('/payment_get_all/:per_page/:page/:search_key').get((req, res) => {
    var pageOptions = {
        page: parseInt(req.params.page),
        limit: parseInt(req.params.per_page)
    }
    var data = {};
    if(req.params.search_key !== "0"){
        data  ={ user_email: { $regex: req.params.search_key, $options: "i" } }
    }
    Payment.countDocuments({}, function(err, count){
        Payment.find(data)
        .sort([["createdAt", -1]])
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            var data = [];
            doc.map(function (item, i){
                var data1 = {
                    user_id: item.user_id, user_email: item.user_email, description: item.description, amount: item.pay_amount, balance: item.balance, create: item.createdAt, id: item._id
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