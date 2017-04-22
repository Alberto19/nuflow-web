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
                Events.getAllEvents().then(events => {
                    debugger
                    getBanners(events.data).then(dataEvents => {
                        debugger
                        vm.events = dataEvents;
                    })
                });
            };

            function getBanners(dataEvents) {
                var events = [];
                var defer = $q.defer();
                dataEvents.map(event => {
                    Events.getBanner(event._id).then(banner => {
                        debugger
                        event.banner = banner.data;
                        defer.resolve(dataEvents);
                    });
                });
            return defer.promise;
            };

        function createEvent() {
            $state.go('main.event');
        }
    }
})();