const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const request = require('request');
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || port, function(){
    console.log(`Server is running at port ${port}`);
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            },
        ]
    }

    // Endpoint/ sPath
    const URL = "https://us14.api.mailchimp.com/3.0/lists/d8d7abd259";
    const jsonData = JSON.stringify(data);

    const options = {
        method: "POST",
        auth: "ganaduvva:803dfeb93580e900bd3392605bd652a4-us14"
    }

    const request = https.request(URL, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data)); 
        });
    });

    request.write(jsonData); 
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});
