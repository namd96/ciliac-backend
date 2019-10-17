var mysql = require('mysql');
var con = mysql.createConnection({
    host: "3.230.95.77",
    user: "newuser",
    password : "12345678910",
    port: "3306",
    database: "ciliac"
    // password: ""
});

con.connect(function (err) {
    //   console.log("this is",err)
    if (err) {
        console.log("[failed the sql query]",err)
        // res.json({ err: true , msg : "sql error"})
        return;
     }
    console.log("Connected!");
});
module.exports = con;