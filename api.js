const mongoClient = require("mongodb").MongoClient;
const express = require("express");
const cors = require("cors");
var constr="mongodb://127.0.0.1:27017";
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/users', (req,res)=>{
    mongoClient.connect(constr).then(clientobj=>{
        var database = clientobj.db("SaiTodo");
        database.collection("users").find({}).toArray().then(documents=>{
            res.send(documents);
            res.end();
        });
    });
});

app.get('/get-appointments/:userid', (req,res)=>{
    mongoClient.connect(constr).then(clientobj=>{
        var database = clientobj.db("SaiTodo");
        database.collection("appointments").find({UserId:req.params.userid}).toArray().then(documents=>{
            res.send(documents);
            res.end();
        });
    });
});

app.get('/get-appointment/:id', (req,res)=>{
    mongoClient.connect(constr).then(clientobj=>{
        var database = clientobj.db("SaiTodo");
        database.collection("appointments").findOne({AppointmentId:parseInt(req.params.id)}).then(document=>{
            res.send(document);
            res.end();
        });
    });
});

app.post('/register-user', (req,res)=>{
    var user={
        UserId: req.body.UserId,
        UserName: req.body.UserName,
        Password : req.body.Password,
        Email: req.body.Email,
        Mobile: req.body.Mobile
    };
    mongoClient.connect(constr).then(clientobj=>{
        var database = clientobj.db("SaiTodo");
        database.collection('users').insertOne(user).then(()=>{
            console.log("User Registered..");
            res.end();
        });
    });
});

app.post('/add-appointment', (req,res)=>{
    var appointment={
        AppointmentId: parseInt(req.body.AppointmentId),
        Title: req.body.Title,
        Description : req.body.Description,
        Date: new Date(req.body.Date),
        Time: new Date(req.body.time),
        UserId: req.body.UserId
    }
    mongoClient.connect(constr).then(clientobj=>{
        var database = clientobj.db("SaiTodo");
        database.collection('appointments').insertOne(appointment).then(()=>{
            console.log("Appointment added..");
            res.end();
        });
    });
});

app.put('/edit-appointment/:id', (req,res)=>{
    var appointment={
        AppointmentId: parseInt(req.body.AppointmentId),
        Title: req.body.Title,
        Description : req.body.Description,
        Date: new Date(req.body.Date),
        Time: new Date(req.body.time),
        UserId: req.body.UserId
    }
    mongoClient.connect(constr).then(clientobj=>{
        var database = clientobj.db("SaiTodo");
        database.collection('appointments').updateOne({AppointmentId:parseInt(req.params.id)},{$set:appointment}).then(()=>{
            console.log("Appointment updated..");
            res.end();
        });
    });
});

app.delete('/delete-appointment/:id', (req,res)=>{
    mongoClient.connect(constr).then(clientobj=>{
        var database = clientobj.db("SaiTodo");
        database.collection('appointments').deleteOne({AppointmentId:parseInt(req.params.id)}).then(()=>{
            console.log("Appointment deleted..");
            res.end();
        });
    });
});
app.listen(2020);
console.log("Server started http://127.0.0.1:2020");