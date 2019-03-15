const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');





const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
    const count = 5;

    // Generate some passwords
    const passwords = Array.from(Array(count).keys()).map(i =>
        generatePassword(12, false)
    )

    // Return them as json
    res.json(passwords);

    console.log(`Sent ${count} passwords`);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});





// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());






app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;



    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "order@unisystem.pl", // generated ethereal user
            pass: "turlam3M&Msy" // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Kontakt z formularza 👻" <order@unisystem.pl>', // sender address
        to: "michal@unisystem.pl, michal.szumnarski@gmail.com", // list of receivers
        subject: "Kontakt z formularza ✔", // Subject line
        text: "Turn on HTML in your mail client", // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL is: %s", nodemailer.getTestMessageUrl(info));
        res.json({msg: 'Email has been sent'});
        //res.sendFile(path.join(__dirname+'/client/build/index.html'));
        res.redirect("https://www.unisystem.pl/pl/thankyou");




       // var send = req.param("send");

       // res.writeHead(200, {
       //     'Content-Type': 'text/html'
       // });
       // res.write('Code: ' + code);
       // res.write('<script>setTimeout(function () { window.location.href = "https://www.unisystem.pl/pl/test_form"; }, 5000);</script>');
       // res.end();







    });




});





















const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);