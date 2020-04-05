var request = require('request');

var headers = {
    'Authorization': 'Token 0123456-789a-bcde-f012-3456789abcde',
    'Content-type': 'application/json'
};

var dataString = '{"files": [{"name": "main.py", "content": "print(42)"}]}';

var options = {
    url: 'https://run.glot.io/languages/python/latest',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);