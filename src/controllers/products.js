var express = require('express');
var router = express.Router();
var con = require('../connections/conn')

router.get('/products', getAllProducts)
router.get('/queries', getAllQueries)
router.get('/product/:id', function (req, res) {
    queryData = []
    let stmt = "select * from products where _id= ?  "
    let toInsert = [req.params.id]
    con.query(stmt, toInsert, function (err, result) {
        if (err) {
            console.log(err)
            res.json({
                err: true,
                msg: "sql error"
            })
            return;
        };
        console.log("Result: " + result[0].glutenFree
        );

        result.map((el) => queryData.push({
            name: el.name, company: el.company, glutonFree: el.glutenFree ? true : false,
            source_of_info: el.source_of_info, tags: el.tags, upvotes: el.upvotes, downvotes: el.downvotes
        })
        )
        console.log("query", req.user)
        let query = new RegExp(req.query.query, "i");
        var data = queryData.filter(function (el) {
            return query.test(el.name) || query.test(el.company)   /* .includes(query) */
        })
        var productsToSend = {
            count: data.length,
            data: data
        }
        console.log("sending products", query, productsToSend)
        res.send(productsToSend)
    });



})
router.put('/vote/:id', function (req, res) {
    queryData = []
    let stmt = "select * from products where _id= ?  "
    let toInsert = [req.params.id]
    con.query(stmt, toInsert, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result[0].glutenFree
        );

        let statement = "";
        let options = [];
        if (req.query.type == "up") {
            statement = "update products set upvotes = ? where _id = ?"
            options = [result[0].upvotes + 1, req.params.id]
        }
        if (req.query.type == "down") {
            statement = "update products set upvotes = ? where _id = ?"
            options = [result[0].downvotes + 1, req.params.id]
        }
        console.log("[voting successfull]", statement, options)
        con.query(statement, options, function (err, result) {
            if (err) throw err
            getAllProducts(req, res)
        })

    });



})
router.post('/create/product', function (req, res) {

    let id = req.query.id;
    let body = req.body;
    console.log(req.body.glutenFree)
    let stmt = `INSERT INTO products(name,company,upvotes,downvotes)
    VALUES(?,?,?,?)`;
    let toInsert = [body.name, body.company, body.glutenFree ? 1 : 0, body.glutenFree ? 0 : 1]
    let queryData = []
    con.query(stmt, toInsert, function (err, result) {

        if (err) {
            console.log(err)
            res.json({
                err: true,
                msg: "sql error"
            })
            return;
        };

        getAllProducts(req, res)
    })

})
router.post('/enquire', function (req, res) {

    let id = req.query.id;
    let body = req.body;
    console.log(req.body, req.user.user_id)
    let stmt = `INSERT INTO queries(user_id,name,description,user_email)
    VALUES(?,?,?,?)`;
    let toInsert = [req.user.user_id, body.name, body.description, body.user_email]
    let queryData = []
    con.query(stmt, toInsert, function (err, result) {

        if (err) {
            console.log(err)
            res.json({
                err: true,
                msg: "sql error"
            })
            return;
        };

        getAllQueries(req, res)
    })

})

function getAllProducts(req, res) {
    let queryData = []
    console.log("this shit is working girl")
    con.query('select * from products', function (err, result) {
        if (err) {
            console.log(err)
            res.json({
                err: true,
                msg: "sql error"
            })
            return;
        };
        result[0] && console.log("Result: " + result[0].glutenFree);

        result.map((el) => queryData.push({
            name: el.name, company: el.company, glutonFree: el.glutenFree ? true : false,
            source_of_info: el.source_of_info, tags: el.tags, upvotes: el.upvotes, downvotes: el.downvotes
        })
        )
        console.log("query", req.user)
        let query = new RegExp(req.query.query, "i");
        var data = queryData.filter(function (el) {
            return query.test(el.name) || query.test(el.company)   /* .includes(query) */
        })
        var productsToSend = {
            count: data.length,
            data: data
        }
        console.log("sending products", query, productsToSend)
        res.json(productsToSend)
    });

}
function getAllQueries(req, res) {
    let queryData = []
    console.log("this shit is working man")
    con.query('select * from queries', function (err, result) {
        if (err) {
            console.log(err)
            res.json({
                err: true,
                msg: "sql error"
            })
            return;
        };

        result.map((el) => queryData.push({
            name: el.name, description: el.description, user_email: el.user_email
        })
        )

        var productsToSend = {
            count: queryData.length,
            data: queryData
        }
        console.log("sending products", productsToSend)
        res.json(productsToSend)
    });

}


module.exports = router
