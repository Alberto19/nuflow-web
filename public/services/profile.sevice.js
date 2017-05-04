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
            debugger
            return $http.post(`${config.baseApiUrl}/user/updateProfile`, profile);
        };

        function uploadPhoto(photo){
            return Upload.upload({
                url: `${config.baseApiUrl}/auth/uploadPhoto`,
                data: { file: photo }
            });
        }
    }
})();