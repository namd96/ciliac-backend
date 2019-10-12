let secret = require('../JWTsecret')
var jwt = require('jsonwebtoken');
let timeOut = 2 * 3600 * 1000;
module.exports = {
    async validateMiddleware(req, res, next) {
        // to do
        /* 
        verify req.headers.authorization
        
        if(verified) next() 
        else res.json unauthorized
        
        */
        try {
            jwt.verify(req.headers.authorization, secret, function (err, decoded) {

                if (err) {
                    console.log("[verirication failed]", err)
                    res.json({ err: true, msg: "authentication failed" })
                    return;
                }
                console.log("[decoded]", decoded, err)
                req.user = decoded
                next();

            })
        } catch (err) {
            res.json({ err: true })
        }
    },

    createToken(payload) {
        let signedToken;
        signedToken = jwt.sign(payload, secret);
        console.log("[signedToken]", signedToken)
        /* create a signed token from payload  */
        return signedToken
    }
}