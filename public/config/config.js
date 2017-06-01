(function () {
    'use strict';

    angular
        .module('app')
        .factory('config', config);

    function config() {
        return {
            baseApiUrl: "http://localhost:3003/api"
            // baseApiUrl: "https://nuflow.herokuapp.com/api"
        };
    }
})();
