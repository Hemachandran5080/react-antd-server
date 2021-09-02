const express = require("express");
const path = require('path');
const sql = require("mssql");
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));


const db = {
    user: 'admin-h',
    password: 'Hems@1005',
    server: 'sql-server-h.database.windows.net', 
    database: 'sql-db-h3' 
}


app.get("/api/get", function(req, res) {
    var dbConn = new sql.ConnectionPool(db);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
        request.query("Select * from Sheet1").then(function (resp) {
            res.send(resp);
            dbConn.close();
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
});


var executeQuery = function(res,query,parameters){
    sql.connect(db,function(err){
        if(err){
            console.log("there is a database connection error -> "+err);
            res.send(err);
        }
        else{
            // create request object
            var request = new sql.Request();

            // Add parameters
            parameters.forEach(function(p) {
                request.input(p.name, p.sqltype, p.value);
            });

            // query to the database
            request.query(query,function(err,result){
                if(err){
                    console.log("error while querying database -> "+err);
                    res.send(err);
                }
                else{
                    console.log("Inserted Successfully");
                    sql.close();
                }
            });
        }
    });
}

app.post("/api/insert", function(req, res) {

    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const gender = req.body.gender;
    const age = req.body.last_age;
    const country = req.body.country;


    var parameters = [
        {name: 'first_name', sqltype: sql.NVarChar, value: first_name},
        {name: 'last_name', sqltype: sql.NVarChar, value: last_name},
        {name: 'email', sqltype: sql.NVarChar, value: email},
        {name: 'gender', sqltype: sql.NVarChar, value: gender},
        {name: 'age', sqltype: sql.Int, value: age},
        {name: 'country', sqltype: sql.NVarChar, value: country},
    ];

    var query = "INSERT INTO  [Sheet1] (first_name, last_name, email, gender, age, country) VALUES (@first_name, @last_name, @email, @gender, @age, @country )";
    executeQuery(res, query, parameters);
});


var executeDeleteQuery = function(res,query,parameters){
    sql.connect(db,function(err){
        if(err){
            console.log("there is a database connection error -> "+err);
            res.send(err);
        }
        else{
            // create request object
            var request = new sql.Request();

            // Add parameters
            parameters.forEach(function(p) {
                request.input(p.name, p.sqltype, p.value);
            });

            // query to the database
            request.query(query,function(err,result){
                if(err){
                    console.log("error while querying database -> "+err);
                    res.send(err);
                }
                else{
                    console.log("Deleted Successfully");
                    sql.close();
                }
            });
        }
    });
}

app.delete("/api/delete/:first_name", function(req, res) {
    const first_name = req.params.first_name;

    var parameters = [
        {name: 'first_name', sqltype: sql.NVarChar, value: first_name}
    ];

    var query = "DELETE FROM  [Sheet1] where first_name = @first_name";
    executeDeleteQuery(res, query, parameters);

});


var executeUpdateQuery = function(res,query,parameters){
    sql.connect(db,function(err){
        if(err){
            console.log("there is a database connection error -> "+err);
            res.send(err);
        }
        else{
            // create request object
            var request = new sql.Request();

            // Add parameters
            parameters.forEach(function(p) {
                request.input(p.name, p.sqltype, p.value);
            });

            // query to the database
            request.query(query,function(err,result){
                if(err){
                    console.log("error while querying database -> "+err);
                    res.send(err);
                }
                else{
                    console.log("Updated Successfully");
                    sql.close();
                }
            });
        }
    });
}


app.put("/api/update", function(req, res) {
    const id = req.body.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const gender = req.body.gender;
    const country = req.body.country;

    var parameters = [
        {name: 'id', sqltype: sql.Int, value: id},
        {name: 'first_name', sqltype: sql.NVarChar, value: first_name},
        {name: 'last_name', sqltype: sql.NVarChar, value: last_name},
        {name: 'email', sqltype: sql.NVarChar, value: email},
        {name: 'gender', sqltype: sql.NVarChar, value: gender},
        {name: 'country', sqltype: sql.NVarChar, value: country},
    ];

    var query = "UPDATE [Sheet1] SET first_name=@first_name, last_name=@last_name, email=@email, gender=@gender, country=@country WHERE id = @id";
    executeUpdateQuery(res, query, parameters);

});




app.listen(80, function() {
    console.log("Server running on Port 3020");
});