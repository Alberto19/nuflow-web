(function () {
    'use strict';

    angular
        .module('app')
        .factory('Profile', Profile);

    Profile.$inject = ['$http', 'config'];

    function Profile($http, config) {
        var service = {
            getProfile: getProfile,
            updateProfile:updateProfile
        };

        return service;

        ////////////////
        function getProfile(email) {
            return $http.post(config.baseApiUrl + '/user/profile', email);
        };
        function updateProfile(Profile){
            return $http.post(config.baseApiUrl + '/Profile/create', Profile);
        };
        // function getProfile(Profile) {
        //     return $http.get(config.baseApiUrl + '/Profile/edit/' + Profile);
        // }
        // function editar(Profile) {
        //     return $http.post(config.baseApiUrl + '/Profile/editar/', Profile);
        // }
        // function deletar(Profile) {
        //     return $http.post(config.baseApiUrl + '/Profile/delete/' + Profile);
        // }
    }
})();
