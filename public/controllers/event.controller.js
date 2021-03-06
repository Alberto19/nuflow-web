(function () {
    'use strict';
    angular
        .module('app')
        .controller('EventController', EventController);

    EventController.$inject = ['$state', 'Events', '$timeout'];

    function EventController($state, Events, $timeout) {
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
        vm.showEvent = true;
        vm.showBanner = false;

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

        vm.post = post;
        vm.uploadBanner = uploadBanner;

        function post() {
            Events.post(vm.event).then(event => {
                if (event.data.token === null) {
                    $state.go('main.event');
                } else {
                    vm.event.id = event.data.eventId;
                    vm.showEvent = false;
                    vm.showBanner = true;
                }
            });
        }

        function uploadBanner() {
            Events.uploadBanner(vm.event.id, vm.event.file).then(() => {
                Materialize.toast('Banner Enviado com sucesso', 3000);
                $timeout($state.go('main.event.list'), 4000);
            });
        }
    }
})();