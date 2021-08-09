const Sauce = require('../models/Sauce');
const fs = require('fs');
const jwt = require('jsonwebtoken');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log("req.fil", req.file);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    console.log(sauce);
    sauce.save()
        .then( () => res.status(201).json({message:'Sauce created !'}))
        .catch(error => {
            res.status(400).json({error});
            console.log(error);
        });
};


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    if (req.file) {
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) throw error;
                    console.log('Old image successfully deleted');
                });
            })
            .catch(error => res.status(500).json({error}));
        sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };
    } else {
        sauceObject = {...req.body} ;
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (userId === sauceObject.userId) {
        Sauce.updateOne( {_id:req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce succesfully modified !'}))
            .catch(error => res.status(400).json({error}));
    } else {
        throw new Error("403: unauthorized request");
    }
    
};

exports.deleteSauce = (req,res,next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images')[1];
            console.log(filename);
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(204).json({message: 'Sauce deleted !'}))
                    .catch( error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
};

exports.likeOrDislikeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            switch(req.body.like) {
                case 1:
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes += 1;
                    break;
                case -1:
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.dislikes += 1;
                    break;
                case 0:
                    if (sauce.usersLiked.indexOf(req.body.userId) === -1) {
                        sauce.usersDisliked = sauce.usersDisliked.filter(user => user != req.body.userId);
                        sauce.dislikes -= 1;
                    } else {
                        sauce.usersLiked = sauce.usersLiked.filter(user => user != req.body.userId);
                        sauce.likes -= 1;
                    }
                    break;
                default:
                    throw new Error('Value of like not conforms - check Front-end');
            };
            sauce.save();
            res.status(200).json({message:'Like or dislike updated !'});
        })
        .catch(error => res.status(400).json(error));
};


exports.getAllSauces = (req,res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({error}));
};