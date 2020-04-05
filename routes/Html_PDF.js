const router = require('express').Router();
var fs = require('fs');
var pdf = require('html-pdf');
var handlebars = require('handlebars');
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
function dateFormate(date1) {
    var monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];
    var weekNmaes = [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];
    var monthIndex = date1.getMonth();
    var year = date1.getFullYear();
    var day = date1.getDate();
    var weekIndex = date1.getDay();
    return weekNmaes[weekIndex]+", "+day+" "+monthNames[monthIndex]+" "+year;
}
router.route('/generat_invoice').post((req, res) => {
    // var html = fs.readFileSync('./invoice/index.html', 'utf8');
    var options = { 
        format: 'A3',
        phantomPath: "./node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs"
    };
    readHTMLFile(__dirname + '/../invoice/index.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            email: req.body.data.user_email,
            payment_id: req.body.data.razorpay_payment_id,
            invoice_number: req.body.data.invoice_number,
            description: req.body.data.description,
            pay_amount: req.body.data.pay_amount,
            date: dateFormate(new Date())
        };
        var htmlToSend = template(replacements);
        pdf.create(htmlToSend, options).toFile(`./invoice/${req.body.data.invoice_number}.pdf`, function(err, response) {
        if (err) return console.log(err);
            res.send("created")
        });
    });
})
module.exports = router;