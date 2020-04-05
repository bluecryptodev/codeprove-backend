const router = require('express').Router();
var he = require('he-sdk-nodejs');
var request = require('request');
var headers = {
    'Authorization': 'Token a93cfe23-15aa-4db0-968c-7babadbb9fed',
    'Content-type': 'application/json'
};

var dataString = '{"files": [{"name": "main.py", "content": "print(42)"}]}';
var options = {
    url: 'https://run.glot.io/languages/python/latest',
    method: 'POST',
    headers: headers,
    body: dataString
};

router.route('/login').get(function(req, res){
    
    request(options, function callback(error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    })
});


module.exports = router;