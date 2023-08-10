const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    console.log('auth')
    const authHeader = req.header('Authorization')

    if (!authHeader) {
        return res.status(401).json({msg: 'Missing authorization header'})
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({msg: 'Missing token'})
    }

    try {
        const docodedToken = jwt.verify(token, 'verysecurekey')

        req.user = docodedToken;

        next()
    } catch (err) {
        console.log(err.message)
        return res.status(403).json({msg: 'Invalid token'})
    }
}

module.exports = authMiddleware