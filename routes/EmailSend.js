const router = require('express').Router();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');
var Speakeasy = require('speakeasy');
var user_name = "info@codeprove.com";
var pass = "Bhx49143$";

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
router.route('/OTP_send').post((req, res) => {
    var secret = Speakeasy.generateSecret({length: 20});
    var tokenDelta = Speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        step: 600
    });
    smtpTransport1 = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: user_name,
            pass: pass
        },
        tls: {
            rejectUnauthorized: false
        }
    }));
    readHTMLFile(__dirname + '/../emailtemplate/emailConfirm/index.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            password: tokenDelta,
            email: req.body.email
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'Codeprove.com <info@codeprove.com>',
            to : req.body.email,
            subject : 'OTP',
            html : htmlToSend
         };
        smtpTransport1.sendMail(mailOptions, function (error, response) {
            if(response){
                console.log(secret.base32)
                res.json({send: true, secret: secret.base32});
            }
            if (error) {
                console.log(tokenDelta)
                console.log(error);
                res.json({send: true, secret: secret.base32});
            }
        });
    });
});

router.route('/register_url_send').post((req, res) => {
    smtpTransport1 = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: user_name,
            pass: pass
        },
        tls: {
            rejectUnauthorized: false
        }
    }));
    
    readHTMLFile(__dirname + '/../emailtemplate/adminRegister/index.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            email: req.body.email,
            host: req.body.host
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'Codeprove.com <info@codeprove.com>',
            to : req.body.email,
            subject : 'test subject',
            html : htmlToSend
         };
        smtpTransport1.sendMail(mailOptions, function (error, response) {
            if(response){
                res.json({send: true});
            }
            if (error) {
                console.log("Error: "+error);
            }
        });
    });
});
router.route('/contact_send').post((req, res) => {
    smtpTransport1 = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: user_name,
            pass: pass
        },
        tls: {
            rejectUnauthorized: false
        }
    }));
    
    let mailDetails = { 
        from: `${req.body.email} <info@codeprove.com>`, 
        to: 'info@codeprove.com', 
        subject: req.body.subject, 
        text: req.body.message
    }; 
      
    smtpTransport1.sendMail(mailDetails, function (error, response) {
        if(response){
            res.json({send: true});
        }
        if (error) {
            console.log("Error: "+error);
            res.json({send: false});
        }
    });
});
router.route('/invoice_send').post((req, res) => {
    smtpTransport1 = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: user_name,
            pass: pass
        },
        tls: {
            rejectUnauthorized: false
        }
    }));
    console.log(req.body)
    var email_list = "info@codeprove.com, "+req.body.data.email;
    let mailDetails = { 
        from: `Codeprove.com <info@codeprove.com>`, 
        to: email_list, 
        subject: "INVOICE", 
        attachments: [
            {   // stream as an attachment
                filename: `${req.body.data.invoice_number}.pdf`,
                content: fs.createReadStream(`./invoice/${req.body.data.invoice_number}.pdf`)
            }
        ],
        text: "Invoice"
    }; 
      
    smtpTransport1.sendMail(mailDetails, function (error, response) {
        if(response){
            res.json({send: true});
        }
        if (error) {
            console.log("Error: "+error);
            res.json({send: false});
        }
    });
});

module.exports = router;