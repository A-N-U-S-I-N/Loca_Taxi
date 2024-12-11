const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const dbase = require('./config');

const app = express();

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.json());
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'Mini_Project', 
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/login_auto_driver", async (req, res) => {

    const data = {
        title: req.body.auto_driver_form_default,
        name: req.body.name,
        phoneNumber:req.body.phone,
        points: [req.body.from,req.body.to],
        timing: req.body.timing,
        autono: req.body.autoNo,
        email: req.body.email,
        password: req.body.password
    }

    const existingUser = await dbase.findOne({phoneNumber: data.phoneNumber});
    if(existingUser) {
// Create a popup for user already exists message
res.send(
    `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Something Went Wrong</title>
    <style>
        * {
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        body {
            margin: 0px;
            background-color: #ccc;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
        }

        .pop-card {
            height: 150px;
            border: 1px solid green;
            border-radius: 10px;
            width: 280px;
            background-color: #ffffff; 
            padding: 20px 20px;
            box-shadow: 5px 5px black;
        }

        .pop-card-top {
            font-size: 24px;
            font-weight: 600;
        }

        .pop-card-mid {
            margin: 15px 0px;
            font-size: 16px;
            font-weight: 400;
        }

        .pop-card-bottom {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
        }

        .pop-card-bt {
            background-color:orange;   
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px 30px;
            font-size: 14px;
            margin-top: 15px;
            border-radius: 5px;
            color: #ffffff;
            font-weight: 600;
            border: 0px;
            cursor: pointer;
        }

        .pop-card-bt:active {
            transform: scale(98%);
        }
    </style>
</head>

<body>
    <div class="pop-card">
        <div class="pop-card-top">
            User Already Exists
        </div>
        <div class="pop-card-mid">
            Please choose a different Phone Number
        </div>
        <div class="pop-card-bottom">
            <button class="pop-card-bt" onclick="window.location.href='login_auto_driver.html';">
                Try Again
            </button>
        </div>
    </div>

</body>

</html>`);    
    }else {

        const userdata = await dbase.insertMany(data);
        console.log(userdata);

        req.session.user = {
            phoneNumber: data.phoneNumber,
            title: data.title,
            name: data.name,
        }; 

        res.sendFile(__dirname + '/public/auto_driver_main.html');
    }
});

app.post("/login_rider", async (req, res) => {

    const data = {
        title: req.body.rider_form_default,
        name: req.body.name,
        phoneNumber:req.body.phone,
        email: req.body.email,
        password: req.body.password
    }

    const existingUser = await dbase.findOne({phoneNumber: data.phoneNumber});
    if(existingUser) {
        res.send(
            `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Something Went Wrong</title>
            <style>
                * {
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                }
        
                body {
                    margin: 0px;
                    background-color: #ccc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    width: 100vw;
                }
        
                .pop-card {
                    height: 150px;
                    border: 1px solid green;
                    border-radius: 10px;
                    width: 280px;
                    background-color: #ffffff; 
                    padding: 20px 20px;
                    box-shadow: 5px 5px black;
                }
        
                .pop-card-top {
                    font-size: 24px;
                    font-weight: 600;
                }
        
                .pop-card-mid {
                    margin: 15px 0px;
                    font-size: 16px;
                    font-weight: 400;
                }
        
                .pop-card-bottom {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                }
        
                .pop-card-bt {
                    background-color:orange;   
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 10px 30px;
                    font-size: 14px;
                    margin-top: 15px;
                    border-radius: 5px;
                    color: #ffffff;
                    font-weight: 600;
                    border: 0px;
                    cursor: pointer;
                }
        
                .pop-card-bt:active {
                    transform: scale(98%);
                }
            </style>
        </head>
        
        <body>
            <div class="pop-card">
                <div class="pop-card-top">
                    User Already Exists
                </div>
                <div class="pop-card-mid">
                    Please choose a different Phone Number
                </div>
                <div class="pop-card-bottom">
                    <button class="pop-card-bt" onclick="window.location.href='login_rider.html';">
                        Try Again
                    </button>
                </div>
            </div>
        
        </body>
        
        </html>`);    }else {

        const userdata = await dbase.insertMany(data);
        console.log(userdata);

        req.session.user = {
            phoneNumber: data.phoneNumber,
            title: data.title,
            name: data.name,
        }; 
        res.sendFile(`${__dirname}/public/rider_main.html`);
    }
});

app.post("/login", async (req, res) => {
    try{
        const check = await dbase.findOne({phoneNumber: req.body.phone});
        

        if(req.body.password === check.password) {

            req.session.user = {
                phoneNumber: check.phoneNumber,
                title: check.title,
                name: check.name,
            }; 

            if(check.title === 'rider') {
                res.sendFile(__dirname + '/public/rider_main.html');
            }else {
                res.sendFile(__dirname + '/public/auto_driver_main.html');
            }
            
        }else {
            res.send(
                `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Something Went Wrong</title>
                <style>
                    * {
                        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                    }
            
                    body {
                        margin: 0px;
                        background-color: #ccc;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        width: 100vw;
                    }
            
                    .pop-card {
                        height: 150px;
                        border: 1px solid green;
                        border-radius: 10px;
                        width: 280px;
                        background-color: #ffffff; 
                        padding: 20px 20px;
                        box-shadow: 5px 5px black;
                    }
            
                    .pop-card-top {
                        font-size: 24px;
                        font-weight: 600;
                    }
            
                    .pop-card-mid {
                        margin: 15px 0px;
                        font-size: 16px;
                        font-weight: 400;
                    }
            
                    .pop-card-bottom {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                    }
            
                    .pop-card-bt {
                        background-color:orange;   
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 10px 30px;
                        font-size: 14px;
                        margin-top: 15px;
                        border-radius: 5px;
                        color: #ffffff;
                        font-weight: 600;
                        border: 0px;
                        cursor: pointer;
                    }
            
                    .pop-card-bt:active {
                        transform: scale(98%);
                    }
                </style>
            </head>
            
            <body>
                <div class="pop-card">
                    <div class="pop-card-top">
                        Login Error
                    </div>
                    <div class="pop-card-mid">
                        Oops! It looks like the password you entered is incorrect.
                    </div>
                    <div class="pop-card-bottom">
                        <button class="pop-card-bt" onclick="window.location.href='login.html';">
                            Try Again
                        </button>
                    </div>
                </div>
            
            </body>
            
            </html>`);        }
    }catch{
        res.send(
            `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Something Went Wrong</title>
            <style>
                * {
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                }
        
                body {
                    margin: 0px;
                    background-color: #ccc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    width: 100vw;
                }
        
                .pop-card {
                    height: 190px;
                    border: 1px solid green;
                    border-radius: 10px;
                    width: 280px;
                    background-color: #ffffff; 
                    padding: 20px 20px;
                    box-shadow: 5px 5px black;
                }
        
                .pop-card-top {
                    font-size: 24px;
                    font-weight: 600;
                }
        
                .pop-card-mid {
                    margin: 15px 0px;
                    font-size: 16px;
                    font-weight: 400;
                }
        
                .pop-card-bottom {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                }
        
                .pop-card-bt {
                    background-color:orange;   
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 10px 30px;
                    font-size: 14px;
                    margin-top: 15px;
                    border-radius: 5px;
                    color: #ffffff;
                    font-weight: 600;
                    border: 0px;
                    cursor: pointer;
                }
        
                .pop-card-bt:active {
                    transform: scale(98%);
                }
            </style>
        </head>
        
        <body>
            <div class="pop-card">
                <div class="pop-card-top">
                    Login Error
                </div>
                <div class="pop-card-mid">
                    Oops! It looks like the phone number or password you entered is incorrect. Please double-check your details and try again.
                </div>
                <div class="pop-card-bottom">
                    <button class="pop-card-bt" onclick="window.location.href='login.html';">
                        Try Again
                    </button>
                </div>
            </div>
        
        </body>
        
        </html>`);    }
});

app.get('/auto_driver_main', (req, res) => {
    if (req.session.user) {
        
        res.sendFile(path.join(__dirname, 'public', 'auto_driver_main.html'));
    } else {
        res.redirect('/login'); 
    }
});

app.get('/rider_main', (req, res) => {
    if (req.session.user) {
        
        res.sendFile(path.join(__dirname, 'public', 'rider_main.html'));
    } else {
        res.redirect('/login');
    }
});

app.post('/main_auto_driver', async (req, res) => {
    const status = req.body.status;
    const phoneNumber = req.session.user?.phoneNumber;

    try {
        
        const result = await dbase.findOneAndUpdate(
            { phoneNumber: phoneNumber }, // Query to find the user
            { status: status },           // Update operation
            { new: true }  // Returns the updated document
        );

        if (result) {
            console.log({ message: 'Status updated successfully', user: result });
            res.sendFile(__dirname + '/public/auto_driver_main.html');
        } else {
            console.log({ message: 'User not found' });
            res.sendFile(__dirname + '/public/login.html');
        }
    } catch (error) {
        console.error("Error updating status:", error);
        console.log({ message: 'Internal server error' });
        res.sendFile(__dirname + '/public/login.html');
    }
});

app.post('/search-drivers', async (req, res) => {
    const { from, to, status } = req.body;

    try {
        // Prepare query based on selected values
        const query = {
            title: 'auto_driver',
            points: { $all: [from, to] } // Match both 'from' and 'to' in points array
        };

        if (status !== 'all') {
            query.status = status; // Filter by status if not 'all'
        }

        // Find matching drivers
        const drivers = await dbase.find(query);
        
        res.status(200).json(drivers); // Send back the matching drivers
    } catch (error) {
        console.error("Error searching drivers:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/dashboard', async (req, res) => {
    if (req.session.user) {
        const userinfo = await dbase.findOne({phoneNumber: req.session.user?.phoneNumber});

        if (userinfo.title === 'auto_driver') {
            res.sendFile(path.join(__dirname, 'public', 'auto_driver_main.html'));
        } else {
            res.sendFile(path.join(__dirname, 'public', 'rider_main.html'));
        }
        
    } else {
        res.sendFile(__dirname + '/public/login.html');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.sendFile(__dirname + '/public/login.html');
    });
});
