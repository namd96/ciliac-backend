var mysql = require('mysql');
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    port: "1433",
    database: "ciliac"
    // password: ""
});

con.connect(function (err) {
    //   console.log("this is",err)
    if (err) throw err;
    console.log("Connected!");
});
module.exports = con;