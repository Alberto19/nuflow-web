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
            uploadCompanyPhotos: uploadCompanyPhotos
        };

        return service;

        ////////////////
        function getProfileCompany() {
            return $http.get(config.baseApiUrl + '/company/ProfileCompany');
        };

        function updateProfileCompany(ProfileCompany) {
            return $http.post(`${config.baseApiUrl}/company/updateProfileCompany`, ProfileCompany);
        };

        function uploadCompanyPhotos(photo){
            return Upload.upload({
                url: `${config.baseApiUrl}/company/uploadCompanyPhotos`,
                data: { file: photo }
            });
        }
    }
})();