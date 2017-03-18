(function () {
    'use strict';

    angular
        .module('app')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['$state', 'Search'];

    function FeedController($state, Search) {
        var vm = this;
        vm.locations = null;
        vm.radius = 9000;

        if (navigator.geolocation) {
            navigator
                .geolocation
                .getCurrentPosition((position) => {
                    vm.location = [position.coords.latitude, position.coords.longitude];
                    vm.radius /= 6371;
                    let find = {
                        location: vm.location,
                        radius: vm.radius,
                        keyword: 'C'
                    };
                    Search.searchLocations(find).then(
                        (result) => {
                            console.log(result);
                            vm.locations = result.data;
                        },
                        () => {

                        }
                    );
                });
        } else {
            alert("Geolocation is not supported by this browser.");
        };
    }
})();