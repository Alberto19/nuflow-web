(function () {
    'use strict';
    angular
        .module('app')
        .controller('EventEditController', EventEditController);

    EventEditController.$inject = ['$state', 'Events', '$stateParams'];

    function EventEditController($state, Events, $stateParams) {
        var vm = this;
        vm.event = {
            name: null,
            type: null,
            dateEvent: new Date(),
            price: null,
            description: null,
            artists: null,
            banner: null,
            checkIn: null,
            file: null,
            id: null,
        };

        var days = 15;
        vm.date = {
            month: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
            weekdaysLetter: ['D', 'S', 'T', 'Q', 'QU', 'SE', 'Sab'],
            disable: [false, 1, 7],
            today: 'Hoje',
            clear: 'Limpar',
            close: 'Fechar',
            minDate: (new Date(vm.event.dateEvent.getTime() - (1000 * 60 * 60 * 24 * days))).toISOString(),
            maxDate: (new Date(vm.event.dateEvent.getTime() + (1000 * 60 * 60 * 24 * days))).toISOString(),
        };

        vm.onStart = function () {};
        vm.onRender = function () {};
        vm.onOpen = function () {};
        vm.onClose = function () {};
        vm.onSet = function () {};
        vm.onStop = function () {};

        vm.put = put;
        vm.uploadBanner = uploadBanner;

        getById();

        function getById() {
            debugger
            var eventId = $stateParams.eventId;
            Events.getById(eventId).then(event => {
                debugger
                vm.event.name = event.data.name;
                vm.event.type = event.data.type;
                vm.event.dateEvent = event.data.dateEvent;
                vm.event.price = event.data.price;
                vm.event.description = event.data.description;
                vm.event.artists = event.data.artists;
                Events.getBanner(event.data.banner).then(banner => {
                    vm.event.banner = banner.data;
                });
            });
        };

        function put() {
            if (vm.event.banner != null) {
                vm.event.banner = null;
                vm.event.file = null;
            }
            Events.put($stateParams.eventId, vm.event).then((result) => {
                    Materialize.toast(result.message, 3000);
                    getById();
                },
                (err) => {
                    Materialize.toast(err.message, 3000);
                });
        };

        function uploadBanner() {
            Events.uploadBanner($stateParams.eventId, vm.event.file).then((eventBanner) => {
                Events.getBanner(eventBanner.data).then(banner => {
                    vm.event.banner = banner.data;
                });
                Materialize.toast('Banner Atualizado com sucesso', 3000);
            });
        }
    }
})();