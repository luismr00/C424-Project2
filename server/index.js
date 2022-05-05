const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
require('dotenv').config();

//Mailing
var createError = require('http-errors');
var logger = require('morgan');
var bodyParser = require('body-parser'); 
var router = express.Router();
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // render the error page
  res.status(err.status || 500);
  res.render('error');
   
});

const db = require('./config');

let PORT = process.env.PORT || 4000;

const fs = require('fs');
const path = require('path');

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, function (err, result) {
      if (err) throw err;
      else console.log("Database created");
    });

    const create = fs.readFileSync(path.join(__dirname, './comp424.sql')).toString();

    db.query(create,  (err, result) => {
        if (err) throw err;
        else console.log("user table successfully created");
    });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false,
}));

// cookie parser middleware
app.use(cookieParser());
let session;

app.get('/', (req, res) => {
    console.log(session);
    if(session != undefined) {
        if(session.user != undefined && session.user != null)
            res.json({ user: session.user });
    } else {
        res.json({ user: null });
    }
});

app.post('/api/login', (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    console.log('received: ' + email + ', ' + password);

    db.query("SELECT * FROM user WHERE email = ? AND password = ?",[
        email,
        password
    ], (err, result) => {
        if (err) console.log(err) && res.status(400).json({ success: false });
        else {
            console.log("result: ", result);
            if (result.length > 0) {
                if (result[0].activated != 'active') {
                    res.status(401).json({ success: false, err: "User account is not active yet" });
                } else {
                    console.log("creating session...")
                    session = req.session;
                    session.user = { username: result[0].username, firstName: result[0].first_name, lastName: result[0].last_name, logTimes: result[0].logTimes, lastLogDate: result[0].lastLogDate, activated: result[0].activated };
                    console.log(session.user);
                    res.status(201).json({ success: true, firstName: result[0].first_name });
                }
            } else {
                res.status(400).json({ success: false, err: "Invalid username or password" });
            }
        }
    });
});

app.post('/api/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log('received: ' + username + ', ' + password + ', ' + firstName + ', ' + lastName + ', ' + email);
    
    db.query("INSERT INTO user VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        username,
        password,
        firstName,
        lastName,
        email,
        1,
        "none", 
        null,
        'pending'
    ], (err, result) => {
        if (err) {
            console.log(err)
            if(err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ success: false, err: "Username already exists" });
            } else res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("user successfully created");
            session = req.session;
            session.user = { username: username, firstName: firstName, lastName: lastName, activated: 'pending' };
            res.status(201).json({ success: true });
        }
    });
});

app.get('/logout',(req,res) => {
    req.session.destroy();
    session.user = null;
    res.status(200).json({ success: true });
});

app.post('/api/updateLog', (req, res) => {
    const username = req.body.username;
    const logTimes = req.body.logTimes;
    const lastLogDate = req.body.lastLogDate;

    console.log("received: " + username, logTimes, lastLogDate);

    db.query("UPDATE user SET logTimes = ?, lastLogDate = ? WHERE username = ?", [
        logTimes,
        lastLogDate,
        username
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully updated user log information");
            res.status(201).json({ success: true  });
        }
    });


});

app.get('/api/users', (req, res) => {
    db.query("SELECT * FROM user", (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved all users");
            res.status(201).json({ success: true, users: result });
        }
    });
});

//activate account through email
app.post('/request-activation', (req, res) => {

    var email = req.body.email;
 
    //console.log(sendEmail(email, fullUrl));
    console.log(email);
 
    db.query('SELECT * FROM user WHERE email ="' + email + '"', function(err, result) {
        if (result[0] === undefined) {
            // throw err;
            console.log('The email is not registered in the database');
            res.status(404).json({ success: false, error: err});
        } else {
   
            console.log(result[0]);
            //get username and pass as parameter to sendEmail below
            const username = result[0].username;
        
            if (result[0].email.length > 0) {
    
            // var token = randtoken.generate(20);
    
            var sent = sendEmail(email, username);
    
                if (sent != '0') {
    
                    var data = {
                        activated: 'pending'
                    }
    
                    db.query('UPDATE user SET ? WHERE email ="' + email + '"', data, function(err, result) {
                        if(err) {
                            //throw err
                            console.log("unable to activate account for the user speciified");
                            res.status(400).json({ success: false, err: err });
                        }
                    })
    
                    // type = 'success';
                    // msg = 'The reset password link has been sent to your email address';

                    console.log("user account has successfuly been activated");
                    res.status(200).json({ success: true});
    
                } else {
                    // type = 'error';
                    // msg = 'Something goes to wrong. Please try again';
                    console.log("Error. Something went wrong while sending the link to the email. Please try again.");
                    res.status(400).json({ success: false });
                }
    
            } else {
                console.log('The email is not registered in the database');
                res.status(404).json({ success: false});
                type = 'error';
                msg = 'The Email is not registered with us';
    
            }
        }
    
        //req.flash(type, msg);
        //res.redirect('/');
    });
});


//send email
function sendEmail(email, username, token) {
 
    var email = email;
    var token = token;

    console.log("sending to " + email);
 
    var mail = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'lmr_apptesting@hotmail.com',
            pass: 'CSUNtesting'
        },
    });

    var mailOptions;

    if (token) {
        mailOptions = {
            from: 'lmr_apptesting@hotmail.com',
            to: email,
            subject: 'Reset Password Link',
            html: '<p>Hello, ' + username + '. You requested for reset password, kindly use this <a href="http://localhost:3000/reset-password/' + username + '/' + token + '">link</a> to reset your password</p>'
            // text: "testing sending emails from react application"
     
        };
    } else {
        mailOptions = {
            from: 'lmr_apptesting@hotmail.com',
            to: email,
            subject: 'Activate account',
            html: '<p>Hello, ' + username + '. In order to activate your account, kindly use this <a href="http://localhost:3000/activate-account/' + username + '/activate">link</a> to be able to sign in into your account</p>'
            // text: "testing sending emails from react application"
     
        };
    }
 
    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            console.log(1);
            // res.status(400).json({ success: false, err: error });
        } else {
            console.log(0);
            // res.status(201).json({ success: true, result });
        }
    });
}

/* send reset password link in email */
app.post('/reset-password-email', (req, res) => {

    var email = req.body.email;
 
    //console.log(sendEmail(email, fullUrl));
    console.log(email);
 
    db.query('SELECT * FROM user WHERE email ="' + email + '"', function(err, result) {
        if (result[0] === undefined) {
            // throw err;
            console.log('The email is not registered in the database');
            res.status(404).json({ success: false, error: err});
        } else {
   
            console.log(result[0]);
            //get username and pass as parameter to sendEmail below
            const username = result[0].username;
        
            if (result[0].email.length > 0) {
    
            var token = randtoken.generate(20);
    
            var sent = sendEmail(email, username, token);
    
                if (sent != '0') {
    
                    var data = {
                        token: token
                    }
    
                    db.query('UPDATE user SET ? WHERE email ="' + email + '"', data, function(err, result) {
                        if(err) {
                            //throw err
                            console.log("unable to update token for the user speciified");
                            res.status(400).json({ success: false, err: err });
                        }
                    })
    
                    // type = 'success';
                    // msg = 'The reset password link has been sent to your email address';

                    console.log("Success. The reset password link has been sent to your email address");
                    res.status(200).json({ success: true});
    
                } else {
                    // type = 'error';
                    // msg = 'Something goes to wrong. Please try again';
                    console.log("Error. Something went wrong while sending the link to the email. Please try again.");
                    res.status(400).json({ success: false });
                }
    
            } else {
                console.log('The email is not registered in the database');
                res.status(404).json({ success: false});
                type = 'error';
                msg = 'The Email is not registered with us';
    
            }
        }
    
        //req.flash(type, msg);
        //res.redirect('/');
    });
});

app.post('/reset-password', (req, res) => {

    const user = req.body.user;
    const token = req.body.token;

    db.query("SELECT token FROM user WHERE username = ?", [
        user
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved token from user");
            console.log("comparing tokens");
            console.log(result, token);

            if (result[0].token != token) {
                console.log("tokens do not match. Try requesting to reset your password again.")
                res.status(203).json({success: false});
            } else {
                console.log("tokens match and user is authorized to reset password");
                res.status(201).json({ success: true, result });
            }
        }
    });
});

app.post('/update-password', (req, res) => {

    const user = req.body.user;
    const password = req.body.password;

    //reset token too

    db.query("UPDATE user SET password = ?, token = ? WHERE username = ?", [
        password,
        null,
        user
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully updated user's password");
            res.status(201).json({ success: true  });
        }
    });
});

app.post('/activate-account', (req, res) => {

    const user = req.body.user;

    //reset token too

    db.query("UPDATE user SET activated = ? WHERE username = ?", [
        'active',
        user
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully activated user's account");
            res.status(201).json({ success: true  });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});