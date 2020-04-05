const router = require('express').Router();
var request = require('request');
const {c, cpp, node, python, java} = require('compile-run');

router.route('/run').post(function(req, res){
    var headers = {
        'Authorization': 'Token 529cf123-61ef-44ee-afb9-1e2fcfee4a92',
        'Content-type': 'application/json'
    };
    
    var options = {
        url: req.body.url,
        method: 'POST',
        headers: headers,
        body: JSON.stringify(req.body.jsondata)
    };
    request(options, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        // console.log(body)
    })
});

router.route('/run1').post(function(req, res){
    const sourcecode = `#include <iostream>
    using namespace std;
    int main()
    {
        cout << "Hello World" << endl;
        return 0;
    }`;
    let resultPromise = cpp.runSource(sourcecode);
    resultPromise
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;