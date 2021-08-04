const Sauce = require('../models/Sauce');
const fs = require('fs');


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
        console.log(req.file);
        console.log("1er sauce objet : ", sauceObject);
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images')[1];
                console.log(filename);
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
    Sauce.updateOne( {_id:req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce succesfully modified !'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req,res,next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images')[1];
            console.log(filename);
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce deleted !'}))
                    .catch( error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
};


exports.getAllSauces = (req,res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({error}));
};