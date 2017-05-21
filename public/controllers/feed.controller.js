(function ($) {
    'use strict';

    angular
        .module('app')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['$state', 'Search', 'auth', '$q', '$scope'];

    function FeedController($state, Search, auth, $q, $scope) {
        var vm = this;
        vm.locations = null;
        vm.radius = 10;
        vm.distance = 0;
        vm.location = null;
        vm.changeRadius = function changeRadius() {
            makeLocation();
            console.log(vm.radius);
        }

        if (navigator.geolocation) {
           makeLocation();
        } else {
            alert("Geolocation is not supported by this browser.");
        };
        async function makeLocation() {
            navigator.geolocation
            .getCurrentPosition((position) => {
                vm.location = [position.coords.latitude, position.coords.longitude];
                let raio = angular.copy(vm.radius);
                vm.distance = raio /= 100;
                let find = {
                    location: vm.location,
                    radius: vm.distance,
                    keyword: ''
                    };
                Search.searchLocations(find)
                    .then((result) => {
                        return getPhotoCompany(result.data);
                    })
                    .then(data => {
                        data.map(location => {
                            if(location.days.length === 7) {
                                location.days = ['domingo à domingo'];
                            }
                        })
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
    });
    }
    }
})(jQuery);