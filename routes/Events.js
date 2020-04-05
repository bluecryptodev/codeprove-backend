const router = require('express').Router();
let Events = require('../models/Events.js');
const fs = require('fs');
require('dotenv').config();
const local_path = process.env.LOCAL_PATH;

router.route('/event_get/:id').get((req, res) => {
    if(req.params.id === '0'){
        Events.find((err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    else {
        Events.findById(req.params.id, (err, response) => {
            if(!err) {
                res.json(response);
            }
            else {
                res.json("Error: " + err);
            }
        })
    }
    
});
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
router.route('/img_get/:filename').get((req, res)=> {
    res.sendFile(local_path+'event_background/'+req.params.filename);
});



module.exports = router;