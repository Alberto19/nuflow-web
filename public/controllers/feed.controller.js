(function ($) {
    'use strict';

    angular
        .module('app')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['$state', 'Search', 'auth', '$q'];

    function FeedController($state, Search, auth, $q) {
        var vm = this;
        vm.locations = null;
        vm.radius = 900000;
        vm.location = null;

        if (navigator.geolocation) {
            navigator
                .geolocation
                .getCurrentPosition((position) => {
                    vm.location = [position.coords.latitude, position.coords.longitude];
                    vm.radius /= 6371;
                    let find = {
                        location: vm.location,
                        radius: vm.radius,
                        keyword: ''
                    };
                    Search.searchLocations(find)
                        .then((result) => {
                            return getPhotoCompany(result.data);
                        })
                        .then(data => {
                            vm.locations = data;
                        });
                function getPhotoCompany(companies){
                    var defer = $q.defer();
                        companies.map(company => {
                            auth.getPhotoCompany(company._id)
                                .then(picture => {
                                    company.photos[0] = picture
                                });
                                defer.resolve(companies);
                        });
                    return defer.promise;
                } 

        function getAll() {
            Events.getAll().then(events => {
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


                });
        } else {
            alert("Geolocation is not supported by this browser.");
        };


    }
})(jQuery);