(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProfileCompany', ProfileCompany);

    ProfileCompany.$inject = ['$http', 'config', 'Upload'];

    function ProfileCompany($http, config, Upload) {
        var service = {
            getProfileCompany: getProfileCompany,
            updateProfileCompany: updateProfileCompany,
            uploadPhoto: uploadPhoto,
            sendComment: sendComment
        };

        return service;

        ////////////////
        function getProfileCompany() {
            return $http.get(config.baseApiUrl + '/company/ProfileCompany');
        };

        function updateProfileCompany(ProfileCompany) {
            return $http.post(`${config.baseApiUrl}/company/updateProfileCompany`, ProfileCompany);
        };

        function uploadPhoto(photo){
            return Upload.upload({
                url: `${config.baseApiUrl}/auth/uploadPhoto`,
                data: { file: photo }
            });
        }

        function sendComment(id, comment){
            debugger
            return $http.post(`${config.baseApiUrl}/company/comments`, {id ,comment});
        };
    }
})();