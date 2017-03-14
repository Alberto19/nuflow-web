(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = [];

    function HomeController($state, auth) {
        var vm = this;

    }
})();