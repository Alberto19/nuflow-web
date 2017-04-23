(function () {
    'use strict';

    angular
        .module('app')
        .factory('Events', Events);

    Events.$inject = ['$http', 'config', 'Upload', '$q'];

    function Events($http, config, Upload, $q) {
        var service = {
            getEventById: getEventById,
            createEvent: createEvent,
            updateEvent: updateEvent,
            uploadBanner: uploadBanner,
            getBanner: getBanner,
            getAllEvents: getAllEvents,
        };

        return service;

        ////////////////
        function getEventById(eventId) {
            debugger
            return $http.get(`${config.baseApiUrl}/event/${eventId}`);
        };

        function createEvent(event) {
            return $http.post(`${config.baseApiUrl}/event`, event);
        };

        function updateEvent(event) {
            return $http.put(`${config.baseApiUrl}/event/update`, event);
        };

        function getBanner(eventId) {
            var defer = $q.defer();
            debugger
            $http.post(`${config.baseApiUrl}/event/banner`, {
                id: eventId
            }).then(res => {
                defer.resolve(res);
            });
            return defer.promise;
        };

        function uploadBanner(id, banner) {
            return Upload.upload({
                url: `${config.baseApiUrl}/event/uploadBanner`,
                data: {
                    file: banner,
                    id: id
                }
            });
        }

        function getAllEvents() {
            return $http.get(`${config.baseApiUrl}/event`);
        }
    }
})();