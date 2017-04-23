(function () {
        'use strict';
        angular
            .module('app')
            .controller('AllEventsController', AllEventsController);

        AllEventsController.$inject = ['$state', 'Events', '$q'];

        function AllEventsController($state, Events, $q) {
            var vm = this;
            vm.events = null;

            vm.createEvent = createEvent;
            getEvents();

            function getEvents() {
                var defer = $q.defer();
                Events.getAllEvents().then(events => {
                    getBanners(events.data).then(dataEvents => {
                        vm.events = dataEvents;
                        defer.resolve(vm.events);
                    })
                });
                return defer.promise;
            };

            function getBanners(dataEvents) {
                var events = [];
                var defer = $q.defer();
                // dataEvents.map(event => {
                    Events.getBanner(dataEvents[0]._id).then(banner => {
                        event.banner = banner.data;
                        defer.resolve(dataEvents);
                    });
                // });
            return defer.promise;
            };

        function createEvent() {
            $state.go('main.event.create');
        }
    }
})();