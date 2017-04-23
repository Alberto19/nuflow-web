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

        vm.updateEvent = updateEvent;
        vm.updateBanner = updateBanner;

        getEventById();

        function getEventById() {
            debugger
            var eventId = $stateParams.eventId;
            Events.getEventById(eventId).then(event => {
                debugger
                vm.event.name = event.data.name;
                vm.event.type = event.data.type;
                vm.event.dateEvent = event.data.dateEvent;
                vm.event.price = event.data.price;
                vm.event.description = event.data.description;
                vm.event.artists = event.data.artists;
                Events.getBanner(eventId).then(banner => {
                    debugger
                    vm.event.banner = banner;
                });
            });
        };

        function updateEvent() {
            if (vm.event.banner != null) {
                vm.event.banner = null;
                vm.event.file = null;
            }
            Events.updateEvent(vm.event).then((result) => {
                    Materialize.toast(result.message, 3000);
                },
                (err) => {
                    Materialize.toast(err.message, 3000);
                });
        };

        function updateBanner() {
            Events.uploadBanner($stateParams.eventId, vm.event.file).then(() => {
                Events.getBanner($stateParams.eventId).then(banner => {
                    vm.event.banner = banner.data;
                });
                Materialize.toast('Banner Atualizado com sucesso', 3000);
            });
        }
    }
})();