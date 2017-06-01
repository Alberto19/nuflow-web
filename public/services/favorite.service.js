(function () {
    'use strict';

    angular
        .module('app')
        .factory('Favorite', Favorite);

    Favorite.$inject = ['$http', 'config'];

    function Favorite($http, config) {
        var service = {
            get: get,
            getUser: getUser,
            getCompany: getCompany,
            postFavorite: postFavorite
        };

        return service;

        ////////////////
         function get() {
            return $http.get(`${config.baseApiUrl}/favorite/`);
        };

        function getUser() {
            return $http.get(`${config.baseApiUrl}/favorite/user`);
        };

        function getCompany() {
            return $http.get(`${config.baseApiUrl}/favorite/company`);
        };

        function postFavorite(favorite){
            return $http.post(`${config.baseApiUrl}/favorite/persiste`, favorite);
        }
    }
})();