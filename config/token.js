const jwt = require('jsonwebtoken')

module.exports = {
    //Middleware atau method function untuk membuat token
    createToken: (payload) => {
        return jwt.sign(payload, "ikea$", {
            expiresIn: '12h'
        })
    },
    readToken: (req, res, next) => {
        console.log("Cek REQ TOKEN", req.token)
        jwt.verify(req.token, 'ikea$', (err, decoded) => {
            if (err) {
                return res.status(401).send(err)
            }

            //data hasil terjemahan token
            req.user = decoded

            next()
        })
    }
}
