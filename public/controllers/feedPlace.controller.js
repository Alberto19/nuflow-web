(function ($) {
    'use strict';

    angular
        .module('app')
        .controller('FeedPlaceController', FeedPlaceController);

    FeedPlaceController.$inject = ['$stateParams', 'Search', 'auth', '$q', 'Events'];

    function FeedPlaceController($stateParams, Search, auth, $q, Events) {
        var vm = this;
        vm.place = null;
        vm.events = null;

        getById();

        function getById() {
            var placeId = $stateParams.placeId;
            Search.getById(placeId)
              .then(place => {
                return getPhotoCompany(place.data);
            })
            .then(data => {
                vm.place = data;
                return getAllEvents();
            });
        
        };

         function getPhotoCompany(company) {
            var defer = $q.defer();
            auth.getPhotoCompany(company._id)
                .then(picture => {
                    company.photos[0] = picture;
                    defer.resolve(company);
                });
            return defer.promise;
        }


        function getAllEvents() {
            Events.getAllParam($stateParams.placeId).then(events => {
                return getBanners(events.data);
            }).then(dataEvents => vm.events = dataEvents);
        };

        function getBanners(dataEvents) {
            var defer = $q.defer();
            dataEvents.map(event => {
                Events.getBanner(event.banner).then(banner => {
                    event.banner = banner.data;
                });
                defer.resolve(dataEvents);
            });
            return defer.promise;
        };

    }
})(jQuery);