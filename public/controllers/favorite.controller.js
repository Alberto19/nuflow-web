(function () {
    'use strict';

    angular
        .module('app')
        .controller('FavoriteController', FavoriteController);

    FavoriteController.$inject = ['Favorite', '$q', 'Events'];

    function FavoriteController(Favorite, $q, Events) {
        var vm = this;
        vm.events = null;
       
        getAllEvents();

        function get() {
            Favorite.getUser().then(events => {
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
})();
