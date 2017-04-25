(function () {
    'use strict';

    angular
        .module('app')
        .factory('Navigation', Navigation);

    Navigation.$inject = ['$http', 'config'];

    function Navigation($http, config ) {
        var service = {
            get: get
        };

        return service;

        ////////////////
        function get() {
            return $http.get(config.baseApiUrl + '/navigation');
        };
    }
})();