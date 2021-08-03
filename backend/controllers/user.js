const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then( hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "User created !"}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res) =>  {
    User.findOne({ email: req.body.email})
        .then(user => {
            if(!user) {
                return res.status(401).json({error: 'User not find !'});
            }
            bcrypt.compare(req.body.password, user.password)
                // fonction asynchrone qui renvoie un bolean
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )   
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};