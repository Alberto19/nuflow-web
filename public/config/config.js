(function () {
    'use strict';

    angular
        .module('app')
        .factory('config', config);

    function config() {
        return {
            baseApiUrl: "https://nuflow.herokuapp.com/api"
            // baseApiUrl: "http://localhost:3000/api"
        };
    }
})();
