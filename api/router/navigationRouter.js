'use strict'
let NavigationRouter = require('express').Router();


NavigationRouter.get('/', (req, res) => {
    if(req.decoded.type === 'company'){
        res.status(200).send({
            button: 'Eventos',
            path: 'main.event.list',
            profile: 'main.profileCompany',
            icon: 'monetization_on'
        });
    }else{
        res.status(200).send({
            button: 'Favoritos',
            path: 'main.favoritos',
            profile: 'main.profile',
            icon: 'favorite'
        });
    }
});

module.exports = NavigationRouter;

