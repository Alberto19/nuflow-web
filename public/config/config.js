(function () {
    'use strict';

    angular
        .module('app')
        .factory('config', config);

    function config() {
        return {
            // baseApiUrl: "https://bee-test.herokuapp.com/api"
            baseApiUrl: "http://localhost:3001/api"
        };
    }
})();
