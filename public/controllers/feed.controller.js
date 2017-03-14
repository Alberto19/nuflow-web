(function () {
    'use strict';

    angular
        .module('app')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['$state'];

    function FeedController($state) {
        var vm = this;

    }
})();