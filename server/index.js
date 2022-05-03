const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
require('dotenv').config();

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
                session = req.session;
                session.user = { username: result[0].username, firstName: result[0].first_name, lastName: result[0].last_name, logTimes: result[0].logTimes, lastLogDate: result[0].lastLogDate };
                res.status(201).json({ success: true, firstName: result[0].first_name });
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
    
    db.query("INSERT INTO user VALUES (?, ?, ?, ?, ?, ?, ?)", [
        username,
        password,
        firstName,
        lastName,
        email,
        0,
        "none"
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
            session.user = { username: username, firstName: firstName, lastName: lastName };
            res.status(201).json({ success: true });
        }
    });
});

app.post('/api/initialize', (req, res) => {

    const initializeFile2 = fs.readFileSync(path.join(__dirname, './data.sql')).toString();
    db.query(initializeFile2, (err, result) => {
        if (err) throw err;
        else {
            console.log("initialized data");
            res.status(201).json({ success: true });
        }
    })
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

app.post('/api/create', (req, res) => {
    if(session.user !== undefined && session.user !== null) {
        const subject = req.body.subject;
        const description = req.body.description;
        const tags = req.body.tags;
        const date = new Date();
        const user_id = session.user.username;
        db.query("SELECT COUNT(date) from blog WHERE date > DATE_SUB(NOW(), INTERVAL 24 HOUR) AND user_id = ?",[user_id], (err, result) => {
            if(result[0]['COUNT(date)'] < 2) {
                db.query("INSERT INTO blog (subject, description, tags, date, user_id) VALUES(?, ?, ?, ?, ?)",[
                    subject,
                    description,
                    tags,
                    date,
                    user_id
                ], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.status(400).json({ success: false, err: err });
                        }
                        else {
                            console.log("successfully created");
                            res.status(201).json({ success: true });
                        }
                    }
                );
            }
            else {
                console.log("You have reached the limit of 2 post per 24 hours");
                res.status(400).json({ success: false, err: "You have reached the limit of 2 post per 24 hours" });
            }
        });
    } else {
        res.status(400).json({ success: false, err: "You must be logged in to create a post" });
    }
})

app.post('/api/hobby', (req, res) => {
    if(session.user !== undefined && session.user !== null) {
        const hobby = req.body.hobby;
        const user_id = session.user.username;
                db.query("INSERT INTO hobby (hobby, user_id) VALUES(?, ?)",[
                    hobby,
                    user_id
                ], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.status(400).json({ success: false, err: err });
                        }
                        else {
                            console.log("successfully created");
                            res.status(201).json({ success: true });
                        }
                    }
                );
    } else {
        res.status(400).json({ success: false, err: "You must be logged in to create a post" });
    }
})

app.get('/api/blogs', (req, res) => {
    db.query("SELECT * FROM blog", (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved searched user blogs");
            res.status(201).json({ success: true, blogs: result });
        }
    });
});

app.post('/api/userBlogs', (req, res) => {

    const userName = req.body.userName;

    db.query("SELECT * FROM blog WHERE user_id = ?", [
        userName
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, blogs: result  });
        }
    });
});

app.post('/api/user-blogs-positive', (req, res) => {
    const userName = req.body.userName;
    db.query("select * from blog where id not in (select blog_id from rating where rating = 0) and user_id = ?;", [
        userName
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        } else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, blogs: result });
        }
    })
});

app.post('/api/oneXOneYList', (req, res) => {
    const tagx = req.body.tagx;
    const tagy = req.body.tagy;

    db.query("SELECT username from user where username in (SELECT user_id FROM blog where tags = ?) AND username in(SELECT user_id FROM blog where tags = ?)", [
        tagy,
        tagx
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, blogs: result });
        }
    });
});

app.get('/api/noBlogList', (req, res) => {
    db.query("SELECT username FROM user WHERE username NOT IN (SELECT user_id FROM blog)", (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, blogs: result });
        }
    });
});

app.get('/api/noCommentsList', (req, res) => {
    db.query("SELECT username FROM user WHERE username NOT IN (SELECT username FROM comment)", (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, blogs: result });
        }
    });
});

app.get('/api/postNegativeList', (req, res) => {
    db.query("SELECT username FROM user WHERE username in(SELECT user_id FROM rating WHERE user_id in ( SELECT user_id FROM comment WHERE rating = 0));", (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, blogs: result });
        }
    });
});

app.get('/api/noNegativeCommentsOnPostList', (req, res) => {
    db.query("SELECT username from user WHERE username IN (SELECT user_id FROM blog WHERE user_id NOT IN (SELECT username FROM comment where username IN (SELECT user_id FROM blog WHERE id IN (SELECT blog_id FROM rating WHERE rating = 0))));", (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, blogs: result });
        }
    });
});

app.post('/api/maxPostOnDateList', (req, res) => {
    const date = req.body.date;
    if (date === undefined || date === null) {
        db.query("SELECT username, MAX(Total) as Highest from (SELECT user_id as username, COUNT(blog_id) as Total from (SELECT user_id, id as blog_id from blog WHERE date between '2022/04/12 00:00:00' AND '2022/04/12 23:59:59') as B GROUP BY username) as A;", (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, err: err });
            }
            else {
                console.log("successfully retrieved");
                res.status(201).json({ success: true, blogs: result });
            }
        });
    } else {
        db.query("SELECT username, MAX(Total) as Highest from (SELECT user_id as username, COUNT(blog_id) as Total from (SELECT user_id, id as blog_id from blog WHERE date between ? AND ?) as B GROUP BY username) as A;",[
            date + " 00:00:00",
            date + " 23:59:59"
        ], (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ success: false, err: err });
            }
            else {
                console.log("successfully retrieved");
                res.status(201).json({ success: true, blogs: result });
            }
        });
    }
});

app.get('/api/userPairsWithSharedHobbies', (req, res) => {
    db.query("SELECT user_id,hobby FROM hobby WHERE hobby IN (SELECT hobby FROM hobby GROUP BY hobby HAVING COUNT(hobby) > 1);", (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, blogs: result });
        }
    });
});

app.post('/api/:id/comment', (req, res) => {
    if(session.user != undefined && session.user != null) {
        const comment = req.body.comment;
        const blog_id = req.params.id.split(':')[1];
        const username = session.user.username;
        const date = new Date();
        const rating = req.body.rating;
        console.log("rating: " + rating)
        db.query("SELECT COUNT(date) from comment WHERE date > DATE_SUB(NOW(), INTERVAL 24 HOUR) AND username = ?",[username], (err, result) => {
            if(err){
                console.log(err)
                res.status(400).json({ success: false, err: err });
            }
            if(result[0]['COUNT(date)'] < 3) {
                db.query("SELECT user_ID FROM blog WHERE id = ?", [blog_id], (err, result) => {
                    console.log("Query",result,username, blog_id);
                    if(result[0].user_ID != username){
                        db.query("SELECT count(id) FROM comment WHERE username = ? AND blog_id = ?", [
                            username,
                            blog_id,
                            ], (err, result) => {
                                if(err){
                                    console.log(err)
                                    res.status(400).json({ success: false, err: err });
                                }
                                if(result[0]['count(id)'] == 0)
                                {
                                    db.query("INSERT INTO comment (comment, blog_id, username, date) VALUES(?, ?, ?, ?); INSERT INTO rating (rating, blog_id, user_id) VALUES(?, ?, ?);",[
                                        comment,
                                        blog_id,
                                        username,
                                        date,
                                        rating,
                                        blog_id,
                                        username
                                    ], (err, result) => {
                                            if (err) {
                                                console.log(err)
                                                res.status(400).json({ success: false, err: err });
                                            }
                                            else {
                                                console.log("successfully created");
                                                res.status(201).json({ success: true, username: username });
                                            }
                                        }
                                    );
                                }
                                else{
                                    console.log("You have already commented on this post");
                                    res.status(400).json({ success: false, err: "You have already commented on this post" });
                                }
                            });
                    }
                    else{
                        console.log("You cannot comment on your own post");
                        res.status(400).json({ success: false, err: "You cannot comment on your own post" });
                    }
                });
            }
            else{
                console.log("You have already commented 3 times in 24 hours");
                res.status(400).json({ success: false, err: "You have already commented 3 times in 24 hours" });
            }
        });
        
    } else {
        res.status(400).json({ success: false, err: "You must be logged in to comment" });
    }
})

app.get('/api/:id/comments', (req, res) => {
    const blog_id = req.params.id.split(':')[1];

    db.query("SELECT * FROM comment ,rating WHERE comment.blog_id = ? AND rating.blog_id = ? AND rating.user_id = comment.username",[
        blog_id,
        blog_id
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, comments: result });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/api/mutualFollowers', (req, res) => {

    const user1 = req.body.user1;
    const user2 = req.body.user2;

    db.query("SELECT follower_id FROM followers WHERE user_id = ? AND follower_id IN (SELECT follower_id FROM followers WHERE user_id = ?)", [
        user1,
        user2
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            res.status(201).json({ success: true, followers: result  });
        }
    });
});

app.post('/api/follow', (req, res) => {
    const followedUser = req.body.followedUser;
    const follower = req.body.follower;

    console.log('received: ' + followedUser + ', ' + follower);

    db.query("SELECT COUNT(*) FROM followers WHERE user_id = ? AND follower_id = ?", [
        followedUser,
        follower
    ], (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({ success: false, err: err });
        }
        else {
            console.log("successfully retrieved");
            if(result[0]['COUNT(*)'] == 0) {
                db.query("INSERT INTO followers (user_id, follower_id) VALUES(?, ?)", [
                    followedUser,
                    follower
                ], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(400).json({ success: false, err: err });
                    }
                    else {
                        console.log("successfully created");
                        res.status(201).json({ success: true, username: follower });
                    }
                });
            }
            else{
                console.log("You are already following this user");
                res.status(400).json({ success: false, err: "You are already following this user" });
            }
        }
    });
});
