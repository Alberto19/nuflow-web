'use strict'
let NavigationRouter = require('express').Router();


NavigationRouter.get('/', (req, res) => {
    if(req.decoded.type === 'company'){
        res.status(200).send({
            button: 'Eventos',
            path: "main.event.list",
            profile: "main.profileCompany"
        });
    }else{
        res.status(200).send({
            button: 'Favoritos',
            path: "main.favoritos",
            profile: "main.profile"
        });
    }
});

module.exports = NavigationRouter;

