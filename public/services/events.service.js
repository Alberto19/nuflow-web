(function () {
    'use strict';

    angular
        .module('app')
        .factory('Events', Events);

    Events.$inject = ['$http', 'config', 'Upload'];

    function Events($http, config, Upload) {
        var service = {
            getById: getById,
            getAll: getAll,
            post: post,
            put:put,
            uploadBanner: uploadBanner,
            getBanner: getBanner,
            getAllParam: getAllParam
        };

        return service;

        function getById(eventId) {
            return $http.get(`${config.baseApiUrl}/event/${eventId}`);
        };

        function getAll() {
            return $http.get(`${config.baseApiUrl}/event`);
        };

         function getAllParam(id) {
            return $http.post(`${config.baseApiUrl}/event/eventParams`, { id });
        };

        function post(event) {
            return $http.post(`${config.baseApiUrl}/event`, event);
        };

        function put(id, event){
            return $http.put(`${config.baseApiUrl}/event`, {id, event});
        };

        function getBanner(eventId) {
           return $http.post(`${config.baseApiUrl}/event/banner`, {banner: eventId});
        };

        function uploadBanner(id, banner) {
            return Upload.upload({
                url: `${config.baseApiUrl}/event/uploadBanner`,
                data: {
                    file: banner,
                    id: id
                }
            });
        };
    }
})();