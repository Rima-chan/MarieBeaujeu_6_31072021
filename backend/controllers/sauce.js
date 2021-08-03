const Sauce = require('../models/sauce');


exports.createSauce = (req, res, next) => {
    console.log("Test fonction createSauce");
    const sauceObject = JSON.parse(req.body.sauce);
    console.log("sauce object = " + sauceObject);
    
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    delete sauce._id;
    console.log(sauce);
    sauce.save()
        .then( () => res.status(201).json({message:'Sauce created !'}))
        .catch(error => res.status(400).json({error}));
};

exports.getAllSauces = (req,res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json({sauces: sauces}))
        .catch((error) => res.status(404).json({error}));
};