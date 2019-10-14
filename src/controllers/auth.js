var express = require('express');
var router = express.Router()
// const io = require('socket.io')();
var authenticator = require('../services/authenticator')
var con = require('../connections/conn')



router.post('/login', function (req, res) {
   // var body = req.body;
   // con.query()
   
   let stmt = "select * from users where username= ?  "
   let toInsert = [req.body.username]
   con.query(stmt, toInsert, function (err, result) {
      if (err) {
         console.log("[failed the sql query]",err)
         res.json({ err: true , msg : "sql error"})
         return;
      }
      
      // console.log("login called ",result[0].password,req.body.password, result)
      if (!!result[0] && (result[0].password == req.body.password)) {
         let token = authenticator.createToken({ username: req.body.username, user_id : result[0]._id })

         console.log("login called ")
         res.json({ login: true, token })
      } else {
         res.json({ err: true, msg: "invalid credentials" })
      }
   })

})

router.post('/register', function (req, res) {
   var body = req.body;
   console.log(body)
   if (!body || !body.name || !body.username || !body.password) {
      res.json({ err: true, msg: "required fields are empty" });
      return;
   }
   console.log("register called")
   let stmt = "insert into users(name,username, password,ciliac_patient,created_at) values(?,?,?,?,?)"
   let toInsert = [body.name, body.username, body.password, body.ciliac_patient ? 1 : 0, new Date()]
   con.query(stmt, toInsert, function (err, result) {
      if (err) {
         console.log(err)
         res.json({ err: true, msg : "sql error" })
         return;
      }
      res.json({ err: false, registered: true })
   })
})


module.exports = router