(function () {
    'use strict';

    angular
        .module('app')
        .factory('Search', Search);

    Search.$inject = ['$http', 'config'];

    function Search($http, config) {
        var service = {
            searchLocations: searchLocations,
            getById: getById
        };
        return service;

        ////////////////

        function searchLocations(location){
            return $http.post(`${config.baseApiUrl}/search/places`, location);
        };

        function getById(placeId) {
            return $http.get(`${config.baseApiUrl}/search/places/${placeId}`);
        }
    }
})();
