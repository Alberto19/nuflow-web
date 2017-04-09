(function () {
    'use strict';

    angular
        .module('app')
        .factory('Profile', Profile);

    Profile.$inject = ['$http', 'config', 'Upload'];

    function Profile($http, config, Upload) {
        var service = {
            getProfile: getProfile,
            updateProfile: updateProfile,
            uploadPhoto: uploadPhoto
        };

        return service;

        ////////////////
        function getProfile() {
            return $http.get(config.baseApiUrl + '/user/profile');
        };

        function updateProfile(profile) {
            return $http.post(`${config.baseApiUrl}/user/updateProfile`, profile);
        };

        function uploadPhoto(photo){
            return Upload.upload({
                url: `${config.baseApiUrl}/user/uploadPhoto`,
                data: { file: photo }
            });
        }
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