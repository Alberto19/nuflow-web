(function () {
    'use strict';
    angular
        .module('app')
        .controller('AllEventsController', AllEventsController);

    AllEventsController.$inject = ['$state', 'Events', '$q'];

    function AllEventsController($state, Events, $q) {
        var vm = this;
        vm.events = null;

        vm.post = post;
        vm.delete = deleted;
        getAll();

        function getAll() {
            Events.getAll().then(events => {
                getBanners(events.data).then(dataEvents => {
                    vm.events = dataEvents;
                });
            });
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

        function post() {
            $state.go('main.event.create');
        }
        
        function deleted(id){
            alert(id);
        }
    }
})();